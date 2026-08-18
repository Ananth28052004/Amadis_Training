import {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import Seat from "../models/Seat.js";

// =====================================
// GET SEATS FOR A SHOW
// =====================================

export const getSeatsByShow = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { showId } =
      request.params as {
        showId: string;
      };

    const id = Number(showId);

    // =================================
    // VALIDATE SHOW ID
    // =================================

    if (!id || Number.isNaN(id)) {
      return reply.code(400).send({
        message:
          "Valid showId is required",
      });
    }

    // =================================
    // GET SEATS
    // =================================

    const seats =
      await Seat.findAll({
        where: {
          showId: id,
        },

        order: [
          ["seatNumber", "ASC"],
        ],
      });

    // =================================
    // CHECK SEATS
    // =================================

    if (seats.length === 0) {
      return reply.code(404).send({
        message:
          "No seats found for this show",
      });
    }

    // =================================
    // RESPONSE
    // =================================

    return reply.send({
      message:
        "Seats fetched successfully",

      showId: id,

      totalSeats:
        seats.length,

      availableSeats:
        seats.filter(
          (seat) =>
            seat.status ===
            "available"
        ).length,

      bookedSeats:
        seats.filter(
          (seat) =>
            seat.status ===
            "booked"
        ).length,

      seats,
    });

  } catch (error: any) {

    console.error(
      "❌ GET SEATS ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch seats",

      error: error.message,
    });
  }
};
