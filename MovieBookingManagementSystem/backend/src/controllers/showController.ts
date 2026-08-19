import {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import Show from "../models/Show.js";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";
import Seat from "../models/Seat.js";
import Booking from "../models/Booking.js";
import { ensureSeatsForShow } from "../services/seatService.js";

// =====================================
// ADMIN CHECK
// =====================================

const checkAdmin = (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = request.user as {
    id: number;
    role: string;
  };

  if (!user || !user.id) {
    reply.code(401).send({
      message:
        "Unauthorized. Please login first.",
    });

    return false;
  }

  if (user.role !== "admin") {
    reply.code(403).send({
      message:
        "Access denied. Admin only.",
    });

    return false;
  }

  return true;
};


// =====================================
// CREATE SHOW
// ADMIN ONLY
// POST /api/shows
// =====================================

export const createShow = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const sequelize = Show.sequelize!;
  let transaction: import("sequelize").Transaction | null = null;

  try {
    const user = request.user as { id?: number; role?: string };
    if (!user?.id) return reply.code(401).send({ message: "Unauthorized. Please login first." });
    if (user.role !== "admin") return reply.code(403).send({ message: "Access denied. Admin only." });

    const { movieId, theaterId, showTime, price } = request.body as {
      movieId?: number | string;
      theaterId?: number | string;
      showTime?: string;
      price?: number | string;
    };

    const parsedMovieId = Number(movieId);
    const parsedTheaterId = Number(theaterId);
    const parsedPrice = Number(price);
    const parsedShowTime = new Date(showTime ?? "");

    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
      return reply.code(400).send({ message: "Valid movieId is required" });
    }
    if (!Number.isInteger(parsedTheaterId) || parsedTheaterId <= 0) {
      return reply.code(400).send({ message: "Valid theaterId is required" });
    }
    if (Number.isNaN(parsedShowTime.getTime())) {
      return reply.code(400).send({ message: "Invalid showTime" });
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return reply.code(400).send({ message: "Price must be greater than 0" });
    }

    const movie = await Movie.findByPk(parsedMovieId);
    if (!movie) return reply.code(404).send({ message: "Movie not found" });

    const theater = await Theater.findByPk(parsedTheaterId);
    if (!theater) return reply.code(404).send({ message: "Theater not found" });

    transaction = await sequelize.transaction();

    const show = await Show.create(
      {
        movieId: parsedMovieId,
        theaterId: parsedTheaterId,
        showTime: parsedShowTime,
        price: parsedPrice,
      },
      { transaction },
    );

    const seatResult = await ensureSeatsForShow(show.id, transaction);

    await transaction.commit();
    transaction = null;

    return reply.code(201).send({
      message: "Show created successfully",
      show,
      seats: {
        totalSeats: seatResult.seats.length,
        createdSeats: seatResult.createdCount,
      },
    });
  } catch (error: any) {
    if (transaction && !(transaction as any).finished) await transaction.rollback();

    console.error("CREATE SHOW ERROR:", error);
    const message = String(error?.message ?? "");

    if (message.startsWith("THEATER_NOT_FOUND_FOR_SHOW:")) {
      return reply.code(409).send({ message: "The selected theater could not be linked to this show." });
    }
    if (message.startsWith("SEAT_COUNT_MISMATCH:")) {
      const [, currentShowId, theaterId, expected, actual] = message.split(":");
      return reply.code(409).send({
        message: `Show ${currentShowId} seat setup failed for theater ${theaterId}. Expected ${expected} seats but found ${actual}.`,
      });
    }

    return reply.code(500).send({ message: "Failed to create show", error: message });
  }
};


// =====================================
// GET ALL SHOWS
// =====================================

export const getShows = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {

    const shows =
      await Show.findAll({
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

        order: [
          ["showTime", "ASC"],
        ],
      });

    return reply.send({
      message:
        "Shows fetched successfully",

      totalShows:
        shows.length,

      shows,
    });

  } catch (error: any) {

    console.error(
      "❌ GET SHOWS ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch shows",

      error: error.message,
    });
  }
};

// =====================================
// GET SHOW BY ID
// PUBLIC
// GET /api/shows/:id
// =====================================

export const getShowById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // =================================
    // GET SHOW ID
    // =================================

    const { id } =
      request.params as {
        id: string;
      };

    const showId = Number(id);

    if (
      !Number.isInteger(showId) ||
      showId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid show id is required",
      });
    }

    // =================================
    // FIND SHOW
    // =================================

    const show =
      await Show.findByPk(showId, {
        include: [
          {
            model: Movie,
            as: "movie",
          },
          {
            model: Theater,
            as: "theater",
          },
          {
            model: Seat,
            as: "seats",
            order: [
              ["seatNumber", "ASC"],
            ],
          },
        ],
      });

    // =================================
    // SHOW NOT FOUND
    // =================================

    if (!show) {
      return reply.code(404).send({
        message:
          "Show not found",
      });
    }

    // =================================
    // RESPONSE
    // =================================

    return reply.send({
      message:
        "Show fetched successfully",

      show,
    });

  } catch (error: any) {

    console.error(
      "❌ GET SHOW ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch show",

      error: error.message,
    });
  }
};

// =====================================
// GET SHOWS BY MOVIE
// =====================================

export const getShowsByMovie = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { movieId } =
      request.params as {
        movieId: string;
      };

    const parsedMovieId =
      Number(movieId);

    // =================================
    // VALIDATION
    // =================================

    if (
      !Number.isInteger(parsedMovieId) ||
      parsedMovieId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid movieId is required",
      });
    }

    // =================================
    // GET SHOWS
    // =================================

    const shows =
      await Show.findAll({
        where: {
          movieId: parsedMovieId,
        },

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

        order: [
          ["showTime", "ASC"],
        ],
      });

    // =================================
    // RESPONSE
    // =================================

    return reply.send({
      message:
        "Movie shows fetched successfully",

      totalShows:
        shows.length,

      shows,
    });

  } catch (error: any) {

    console.error(
      "❌ GET MOVIE SHOWS ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch movie shows",

      error: error.message,
    });
  }
};


// =====================================
// UPDATE SHOW
// ADMIN ONLY
// PUT /api/shows/:id
// =====================================

export const updateShow = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // =================================
    // GET LOGGED-IN USER
    // =================================

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
    // GET SHOW ID
    // =================================

    const { id } =
      request.params as {
        id: string;
      };

    const showId = Number(id);

    if (
      !Number.isInteger(showId) ||
      showId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid show id is required",
      });
    }

    // =================================
    // FIND SHOW
    // =================================

    const show =
      await Show.findByPk(showId);

    if (!show) {
      return reply.code(404).send({
        message:
          "Show not found",
      });
    }

    // =================================
    // GET BODY
    // =================================

    const {
      movieId,
      theaterId,
      showTime,
      price,
    } = request.body as {
      movieId?: number;
      theaterId?: number;
      showTime?: string;
      price?: number;
    };

    // =================================
    // CHECK MOVIE
    // =================================

    if (movieId !== undefined) {
      const parsedMovieId =
        Number(movieId);

      if (
        !Number.isInteger(parsedMovieId) ||
        parsedMovieId <= 0
      ) {
        return reply.code(400).send({
          message:
            "Valid movieId is required",
        });
      }

      const movie =
        await Movie.findByPk(
          parsedMovieId
        );

      if (!movie) {
        return reply.code(404).send({
          message:
            "Movie not found",
        });
      }
    }

    // =================================
    // CHECK THEATER
    // =================================

    if (theaterId !== undefined) {
      const parsedTheaterId =
        Number(theaterId);

      if (
        !Number.isInteger(
          parsedTheaterId
        ) ||
        parsedTheaterId <= 0
      ) {
        return reply.code(400).send({
          message:
            "Valid theaterId is required",
        });
      }

      const theater =
        await Theater.findByPk(
          parsedTheaterId
        );

      if (!theater) {
        return reply.code(404).send({
          message:
            "Theater not found",
        });
      }
    }

    // =================================
    // CHECK SHOW TIME
    // =================================

    let parsedShowTime: Date | undefined;

    if (showTime !== undefined) {
      parsedShowTime =
        new Date(showTime);

      if (
        Number.isNaN(
          parsedShowTime.getTime()
        )
      ) {
        return reply.code(400).send({
          message:
            "Invalid showTime",
        });
      }
    }

    // =================================
    // CHECK PRICE
    // =================================

    let parsedPrice: number | undefined;

    if (price !== undefined) {
      parsedPrice = Number(price);

      if (
        Number.isNaN(parsedPrice) ||
        parsedPrice <= 0
      ) {
        return reply.code(400).send({
          message:
            "Price must be greater than 0",
        });
      }
    }

    // =================================
    // UPDATE SHOW
    // =================================

    await show.update({
      ...(movieId !== undefined && {
        movieId: Number(movieId),
      }),

      ...(theaterId !== undefined && {
        theaterId: Number(theaterId),
      }),

      ...(parsedShowTime !== undefined && {
        showTime: parsedShowTime,
      }),

      ...(parsedPrice !== undefined && {
        price: parsedPrice,
      }),
    });

    // =================================
    // RESPONSE
    // =================================

    return reply.send({
      message:
        "Show updated successfully",

      show,
    });

  } catch (error: any) {

    console.error(
      "❌ UPDATE SHOW ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to update show",

      error: error.message,
    });
  }
};



// =====================================
// DELETE SHOW
// ADMIN ONLY
// DELETE /api/shows/:id
// =====================================

export const deleteShow = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // =================================
    // GET LOGGED-IN USER
    // =================================

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
    // GET SHOW ID
    // =================================

    const { id } =
      request.params as {
        id: string;
      };

    const showId = Number(id);

    if (
      !Number.isInteger(showId) ||
      showId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid show id is required",
      });
    }

    // =================================
    // FIND SHOW
    // =================================

    const show =
      await Show.findByPk(showId);

    if (!show) {
      return reply.code(404).send({
        message:
          "Show not found",
      });
    }

    // =================================
    // CHECK BOOKINGS
    // =================================

    const bookingCount =
      await Booking.count({
        where: {
          showId: showId,
        },
      });

    if (bookingCount > 0) {
      return reply.code(409).send({
        message:
          "Cannot delete show because bookings already exist",
      });
    }

    // =================================
    // DELETE SHOW SEATS
    // =================================

    await Seat.destroy({
      where: {
        showId,
      },
    });

    // =================================
    // DELETE SHOW
    // =================================

    await show.destroy();

    // =================================
    // RESPONSE
    // =================================

    return reply.send({
      message:
        "Show deleted successfully",

      showId,
    });

  } catch (error: any) {

    console.error(
      "❌ DELETE SHOW ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to delete show",

      error: error.message,
    });
  }
};



// =====================================
// GET ALL SHOWS
// PUBLIC
// GET /api/shows
// =====================================

export const getAllShows = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const shows = await Show.findAll({
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

      order: [
        ["showTime", "ASC"],
      ],
    });

    return reply.send({
      message:
        "Shows fetched successfully",

      totalShows:
        shows.length,

      shows,
    });

  } catch (error: any) {

    console.error(
      "❌ GET ALL SHOWS ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch shows",

      error: error.message,
    });
  }
};


