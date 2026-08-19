import { Transaction } from "sequelize";
import Seat from "../models/Seat.js";
import Show from "../models/Show.js";
import Theater from "../models/Theater.js";

const DEFAULT_THEATER_SEATS = 100;

type TheaterModel = Theater & { get: (key?: string) => any };

function positiveInt(value: unknown): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

async function resolveCapacity(
  theater: TheaterModel,
  showId: number,
  transaction?: Transaction,
): Promise<number> {
  const configured = positiveInt(theater.get("totalSeats"));
  if (configured) return configured;

  // First repair from this show's existing seat rows.
  const currentCount = await Seat.count({ where: { showId }, transaction });
  if (currentCount > 0) {
    await theater.update({ totalSeats: currentCount }, { transaction });
    return currentCount;
  }

  // Then repair from another show in the same theater, if one exists.
  const siblingShows = await Show.findAll({
    where: { theaterId: theater.id },
    attributes: ["id"],
    transaction,
  });

  let inferred = 0;
  for (const sibling of siblingShows) {
    const count = await Seat.count({ where: { showId: sibling.id }, transaction });
    inferred = Math.max(inferred, count);
  }

  if (inferred > 0) {
    await theater.update({ totalSeats: inferred }, { transaction });
    return inferred;
  }

  // Legacy database repair: if totalSeats was never configured and there
  // are no old seat rows to infer from, make the theater usable immediately.
  // The admin can later change this value in Admin -> Theaters.
  await theater.update({ totalSeats: DEFAULT_THEATER_SEATS }, { transaction });
  return DEFAULT_THEATER_SEATS;
}

export async function ensureSeatsForShow(
  showId: number,
  transaction?: Transaction,
) {
  const show = await Show.findByPk(showId, {
    transaction,
    include: [{ model: Theater, as: "theater" }],
  });

  if (!show) throw new Error("SHOW_NOT_FOUND");

  // Always load the theater directly by foreign key. Do not depend on a
  // nested association object that can be stale in an older process.
  const theater = (await Theater.findByPk(show.theaterId, {
    transaction,
  })) as TheaterModel | null;

  if (!theater) {
    throw new Error(`THEATER_NOT_FOUND_FOR_SHOW:${showId}:${show.theaterId}`);
  }

  const capacity = await resolveCapacity(theater, showId, transaction);

  const existingSeats = await Seat.findAll({
    where: { showId },
    order: [["id", "ASC"]],
    transaction,
  });

  const existingNumbers = new Set(existingSeats.map((seat) => String(seat.seatNumber)));
  const missingSeats: Array<{
    showId: number;
    seatNumber: string;
    status: "available";
  }> = [];

  for (let number = 1; number <= capacity; number += 1) {
    const seatNumber = String(number);
    if (!existingNumbers.has(seatNumber)) {
      missingSeats.push({ showId, seatNumber, status: "available" });
    }
  }

  if (missingSeats.length > 0) {
    await Seat.bulkCreate(missingSeats, {
      transaction,
      ignoreDuplicates: true,
    });
  }

  const seats = await Seat.findAll({
    where: { showId },
    order: [["id", "ASC"]],
    transaction,
  });

  if (seats.length < capacity) {
    throw new Error(
      `SEAT_COUNT_MISMATCH:${showId}:${theater.id}:${capacity}:${seats.length}`,
    );
  }

  return {
    show,
    theater,
    seats,
    createdCount: missingSeats.length,
  };
}
