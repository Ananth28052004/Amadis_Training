import { FastifyRequest, FastifyReply } from "fastify";

import Booking from "../models/Booking";
import Seat from "../models/Seat";
import Show from "../models/Show";

import sequelize from "../config/database";

export const createBooking = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const transaction = await sequelize.transaction();

  try {
    await request.jwtVerify();

    const user = request.user as {
      id: number;
    };

    const { showId, seatIds } = request.body as {
      showId: number;
      seatIds: number[];
    };

    if (!showId || !seatIds || seatIds.length === 0) {
      await transaction.rollback();

      return reply.code(400).send({
        message: "showId and seatIds are required",
      });
    }

    const show = await Show.findByPk(showId, {
      transaction,
    });

    if (!show) {
      await transaction.rollback();

      return reply.code(404).send({
        message: "Show not found",
      });
    }

    const seats = await Seat.findAll({
      where: {
        id: seatIds,
        showId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (seats.length !== seatIds.length) {
      await transaction.rollback();

      return reply.code(400).send({
        message: "One or more seats are invalid",
      });
    }

    const unavailableSeat = seats.find(
      (seat: any) =>
        seat.get("status") !== "AVAILABLE" &&
        seat.get("status") !== "LOCKED"
    );

    if (unavailableSeat) {
      await transaction.rollback();

      return reply.code(409).send({
        message: `Seat ${unavailableSeat.get(
          "seatNumber"
        )} is not available`,
      });
    }

    const price = Number(show.get("price"));
    const totalAmount = price * seatIds.length;

    const bookingReference =
      "BK-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 1000);

    const booking = await Booking.create(
      {
        userId: user.id,
        showId,
        seatIds,
        totalAmount,
        bookingReference,
        status: "CONFIRMED",
      },
      {
        transaction,
      }
    );

    await Seat.update(
      {
        status: "BOOKED",
        lockedUntil: null,
      },
      {
        where: {
          id: seatIds,
          showId,
        },
        transaction,
      }
    );

    await transaction.commit();

    return reply.code(201).send({
      message: "Booking created successfully",
      booking,
    });
  } catch (error: any) {
    await transaction.rollback();

    console.error(
      "CREATE BOOKING ERROR:",
      error
    );

    return reply.code(500).send({
      message: "Booking failed",
      error: error.message,
    });
  }
};
export const getMyBookings = async (
  request: any,
  reply: any
) => {
  try {
    const userId = request.user.id;

    const bookings = await Booking.findAll({
      where: {
        userId,
      },
      include: [Show],
      order: [["createdAt", "DESC"]],
    });

    return reply.send({
      bookings,
    });
  } catch (error: any) {
    console.error("Get bookings error:", error);

    return reply.code(500).send({
      message: "Failed to get bookings",
      error: error.message,
    });
  }
};
export const cancelBooking = async (
  request: any,
  reply: any
) => {
  const transaction = await sequelize.transaction();

  try {
    await request.jwtVerify();

    const userId = request.user.id;
    const { id } = request.params;

    const booking = await Booking.findOne({
      where: {
        id,
        userId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!booking) {
      await transaction.rollback();

      return reply.code(404).send({
        message: "Booking not found",
      });
    }

    if (booking.get("status") === "CANCELLED") {
      await transaction.rollback();

      return reply.code(400).send({
        message: "Booking is already cancelled",
      });
    }

    const showId = booking.get("showId");
    const seatIds = booking.get("seatIds") as number[];

    await Seat.update(
      {
        status: "AVAILABLE",
        lockedUntil: null,
      },
      {
        where: {
          id: seatIds,
          showId,
        },
        transaction,
      }
    );

    await booking.update(
      {
        status: "CANCELLED",
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return reply.send({
      message: "Booking cancelled successfully",
      bookingReference: booking.get(
        "bookingReference"
      ),
      status: "CANCELLED",
    });
  } catch (error: any) {
    await transaction.rollback();

    console.error(
      "Cancel booking error:",
      error
    );

    return reply.code(500).send({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};
export const getBookingById = async (
  request: any,
  reply: any
) => {
  try {
    const userId = request.user.id;
    const { id } = request.params;

    const booking = await Booking.findOne({
      where: {
        id,
        userId,
      },
      include: [
        {
          model: Show,
        },
      ],
    });

    if (!booking) {
      return reply.code(404).send({
        message: "Booking not found",
      });
    }

    const show: any = booking.get("Show");

    const seatIds = booking.get("seatIds") as number[];

    const seats = await Seat.findAll({
      where: {
        id: seatIds,
        showId: booking.get("showId"),
      },
    });

    const seatNumbers = seats.map((seat: any) =>
      seat.get("seatNumber")
    );

    return reply.send({
      ticket: {
        bookingId: booking.get("id"),
        bookingReference: booking.get("bookingReference"),

        show: {
          id: show?.get("id"),
          date: show?.get("showDate"),
          time: show?.get("showTime"),
          price: show?.get("price"),
        },

        seats: seatNumbers,

        totalAmount: booking.get("totalAmount"),

        status: booking.get("status"),
      },
    });
  } catch (error: any) {
    console.error("Get booking error:", error);

    return reply.code(500).send({
      message: "Failed to get booking",
      error: error.message,
    });
  }
};
export const lockSeats = async (
  request: any,
  reply: any
) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      showId,
      seatIds,
    } = request.body;

    if (
      !showId ||
      !Array.isArray(seatIds) ||
      seatIds.length === 0
    ) {
      await transaction.rollback();

      return reply.code(400).send({
        message: "showId and seatIds are required",
      });
    }

    // Lock the rows so another user cannot modify them
    const seats = await Seat.findAll({
      where: {
        id: seatIds,
        showId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (seats.length !== seatIds.length) {
      await transaction.rollback();

      return reply.code(400).send({
        message: "One or more seats are invalid",
      });
    }

    const now = new Date();

    // Check existing locks
    const unavailableSeat = seats.find((seat: any) => {
      const status = seat.get("status");
      const lockedUntil = seat.get("lockedUntil");

      if (status === "BOOKED") {
        return true;
      }

      if (
        status === "LOCKED" &&
        lockedUntil &&
        new Date(lockedUntil) > now
      ) {
        return true;
      }

      return false;
    });

    if (unavailableSeat) {
      await transaction.rollback();

      return reply.code(409).send({
        message: `Seat ${unavailableSeat.get(
          "seatNumber"
        )} is not available`,
      });
    }

    // Lock for 5 minutes
    const lockedUntil = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await Seat.update(
      {
        status: "LOCKED",
        lockedUntil,
      },
      {
        where: {
          id: seatIds,
          showId,
        },
        transaction,
      }
    );

    await transaction.commit();

    return reply.send({
      message: "Seats locked successfully",
      seatIds,
      lockedUntil,
    });
  } catch (error: any) {
    await transaction.rollback();

    console.error("Lock seats error:", error);

    return reply.code(500).send({
      message: "Failed to lock seats",
      error: error.message,
    });
  }
};