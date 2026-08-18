import {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import {
  Transaction,
} from "sequelize";

import sequelize from "../config/database.js";

import Booking from "../models/Booking.js";
import Seat from "../models/Seat.js";
import User from "../models/User.js";
import Show from "../models/Show.js";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";

// =====================================
// BOOK A SEAT
// LOGIN REQUIRED
// =====================================

export const createBooking = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  let transaction: Transaction | null = null;

  try {
    const { showId, seatId } =
      request.body as {
        showId: number;
        seatId: number;
      };

    const parsedShowId = Number(showId);
    const parsedSeatId = Number(seatId);

    // =================================
    // VALIDATION
    // =================================

    if (
      !Number.isInteger(parsedShowId) ||
      !Number.isInteger(parsedSeatId) ||
      parsedShowId <= 0 ||
      parsedSeatId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid showId and seatId are required",
      });
    }

    // =================================
    // LOGGED-IN USER
    // =================================

    const user = request.user as {
      id: number;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }

    // =================================
    // START TRANSACTION
    // =================================

    transaction =
      await sequelize.transaction({
        isolationLevel:
          Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });

    // =================================
    // FIND SEAT
    // =================================

    const seat =
      await Seat.findOne({
        where: {
          id: parsedSeatId,
          showId: parsedShowId,
        },

        transaction,

        lock: "UPDATE",
      });

    if (!seat) {
      await transaction.rollback();
      transaction = null;

      return reply.code(404).send({
        message:
          "Seat not found for this show",
      });
    }

    // =================================
    // CHECK SEAT
    // =================================

    if (seat.status === "booked") {
      await transaction.rollback();
      transaction = null;

      return reply.code(409).send({
        message:
          "Seat is already booked",
      });
    }

    // =================================
    // CREATE BOOKING
    // =================================

    const booking =
      await Booking.create(
        {
          userId: user.id,
          showId: parsedShowId,
          seatId: parsedSeatId,
          status: "confirmed",
        },
        {
          transaction,
        }
      );

    // =================================
    // BOOK SEAT
    // =================================

    await seat.update(
      {
        status: "booked",
      },
      {
        transaction,
      }
    );

    // =================================
    // COMMIT
    // =================================

    await transaction.commit();
    transaction = null;

    // =================================
    // RESPONSE
    // =================================

    return reply.code(201).send({
      message:
        "Seat booked successfully",

      booking: {
        id: booking.id,
        userId: booking.userId,
        showId: booking.showId,
        seatId: booking.seatId,
        status: booking.status,
      },
    });

  } catch (error: any) {

    if (
      transaction &&
      !transaction.finished
    ) {
      await transaction.rollback();
    }

    console.error(
      "❌ CREATE BOOKING ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to create booking",

      error: error.message,
    });
  }
};

// =====================================
// CANCEL BOOKING
// USER CAN CANCEL OWN BOOKING
// =====================================

export const cancelBooking = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  let transaction: Transaction | null = null;

  try {
    const { id } =
      request.params as {
        id: string;
      };

    const bookingId = Number(id);

    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid booking id is required",
      });
    }

    const user = request.user as {
      id: number;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }

    transaction =
      await sequelize.transaction({
        isolationLevel:
          Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });

    // =================================
    // FIND BOOKING
    // =================================

    const booking =
      await Booking.findOne({
        where: {
          id: bookingId,
          userId: user.id,
        },

        transaction,

        lock: "UPDATE",
      });

    if (!booking) {
      await transaction.rollback();
      transaction = null;

      return reply.code(404).send({
        message:
          "Booking not found",
      });
    }

    // =================================
    // CHECK STATUS
    // =================================

    if (
      booking.status === "cancelled"
    ) {
      await transaction.rollback();
      transaction = null;

      return reply.code(400).send({
        message:
          "Booking is already cancelled",
      });
    }

    // =================================
    // FIND SEAT
    // =================================

    const seat =
      await Seat.findOne({
        where: {
          id: booking.seatId,
          showId: booking.showId,
        },

        transaction,

        lock: "UPDATE",
      });

    if (!seat) {
      await transaction.rollback();
      transaction = null;

      return reply.code(404).send({
        message:
          "Seat not found",
      });
    }

    // =================================
    // CANCEL BOOKING
    // =================================

    await booking.update(
      {
        status: "cancelled",
      },
      {
        transaction,
      }
    );

    // =================================
    // RELEASE SEAT
    // =================================

    await seat.update(
      {
        status: "available",
      },
      {
        transaction,
      }
    );

    // =================================
    // COMMIT
    // =================================

    await transaction.commit();
    transaction = null;

    return reply.send({
      message:
        "Booking cancelled successfully",

      booking: {
        id: booking.id,
        userId: booking.userId,
        showId: booking.showId,
        seatId: booking.seatId,
        status: booking.status,
      },

      seat: {
        id: seat.id,
        seatNumber: seat.seatNumber,
        status: seat.status,
      },
    });

  } catch (error: any) {

    if (
      transaction &&
      !transaction.finished
    ) {
      await transaction.rollback();
    }

    console.error(
      "❌ CANCEL BOOKING ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to cancel booking",

      error: error.message,
    });
  }
};

// =====================================
// GET MY BOOKINGS
// LOGIN REQUIRED
// =====================================

export const getMyBookings = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as {
      id: number;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }

    const bookings =
      await Booking.findAll({
        where: {
          userId: user.id,
        },

        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
              "role",
            ],
          },
          {
            model: Show,
            as: "show",
            include: [
              {
                model: Movie,
                as: "movie",
              },
              {
                model: Theater,
                as: "theater",
              },
            ],
          },
          {
            model: Seat,
            as: "seat",
            attributes: [
              "id",
              "seatNumber",
              "status",
            ],
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],
      });

    return reply.send({
      message:
        "Bookings fetched successfully",

      totalBookings:
        bookings.length,

      bookings,
    });

  } catch (error: any) {

    console.error(
      "❌ GET MY BOOKINGS ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch bookings",

      error: error.message,
    });
  }
};

// =====================================
// GET BOOKING BY ID
// USER CAN SEE OWN BOOKING
// =====================================

export const getBookingById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } =
      request.params as {
        id: string;
      };

    const bookingId = Number(id);

    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid booking id is required",
      });
    }

    const user = request.user as {
      id: number;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }

    const booking =
      await Booking.findOne({
        where: {
          id: bookingId,
          userId: user.id,
        },

        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
              "role",
            ],
          },
          {
            model: Show,
            as: "show",
            include: [
              {
                model: Movie,
                as: "movie",
              },
              {
                model: Theater,
                as: "theater",
              },
            ],
          },
          {
            model: Seat,
            as: "seat",
            attributes: [
              "id",
              "seatNumber",
              "status",
            ],
          },
        ],
      });

    if (!booking) {
      return reply.code(404).send({
        message:
          "Booking not found",
      });
    }

    return reply.send({
      message:
        "Booking fetched successfully",

      booking,
    });

  } catch (error: any) {

    console.error(
      "❌ GET BOOKING ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch booking",

      error: error.message,
    });
  }
};

// =====================================
// GET ALL BOOKINGS
// ADMIN ONLY
// =====================================

export const getAllBookings = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as {
      id: number;
      role: string;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }

    // =================================
    // ADMIN CHECK
    // =================================

    if (user.role !== "admin") {
      return reply.code(403).send({
        message:
          "Access denied. Admin only.",
      });
    }

    // =================================
    // GET ALL BOOKINGS
    // =================================

    const bookings =
      await Booking.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
              "role",
            ],
          },
          {
            model: Show,
            as: "show",
            include: [
              {
                model: Movie,
                as: "movie",
              },
              {
                model: Theater,
                as: "theater",
              },
            ],
          },
          {
            model: Seat,
            as: "seat",
            attributes: [
              "id",
              "seatNumber",
              "status",
            ],
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],
      });

    return reply.send({
      message:
        "All bookings fetched successfully",

      totalBookings:
        bookings.length,

      bookings,
    });

  } catch (error: any) {

    console.error(
      "❌ GET ALL BOOKINGS ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch all bookings",

      error: error.message,
    });
  }
};
