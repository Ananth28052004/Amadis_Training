import {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import Show from "../models/Show.js";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";
import Seat from "../models/Seat.js";

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
// =====================================

export const createShow = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // =================================
    // CHECK ADMIN
    // =================================

    if (!checkAdmin(request, reply)) {
      return;
    }

    // =================================
    // REQUEST BODY
    // =================================

    const {
      movieId,
      theaterId,
      showTime,
      price,
    } = request.body as {
      movieId: number;
      theaterId: number;
      showTime: string;
      price: number;
    };

    // =================================
    // VALIDATION
    // =================================

    if (
      !movieId ||
      !theaterId ||
      !showTime ||
      price === undefined ||
      price === null
    ) {
      return reply.code(400).send({
        message:
          "movieId, theaterId, showTime and price are required",
      });
    }

    if (price <= 0) {
      return reply.code(400).send({
        message:
          "Price must be greater than 0",
      });
    }

    // =================================
    // CHECK MOVIE
    // =================================

    const movie =
      await Movie.findByPk(movieId);

    if (!movie) {
      return reply.code(404).send({
        message:
          "Movie not found",
      });
    }

    // =================================
    // CHECK THEATER
    // =================================

    const theater =
      await Theater.findByPk(theaterId);

    if (!theater) {
      return reply.code(404).send({
        message:
          "Theater not found",
      });
    }

    // =================================
    // VALIDATE SHOW TIME
    // =================================

    const parsedShowTime =
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

    // =================================
    // GET TOTAL SEATS
    // =================================

    const totalSeats =
      theater.get("totalSeats") as number;

    if (
      !totalSeats ||
      totalSeats <= 0
    ) {
      return reply.code(400).send({
        message:
          "Theater has no valid seats",
      });
    }

    // =================================
    // CREATE SHOW
    // =================================

    const show =
      await Show.create({
        movieId,
        theaterId,
        showTime: parsedShowTime,
        price,
      });

    // =================================
    // CREATE SEATS
    // =================================

    const seats = [];

    for (
      let i = 1;
      i <= totalSeats;
      i++
    ) {
      seats.push({
        showId:
          show.get("id") as number,

        // IMPORTANT:
        // Seat.seatNumber is STRING
        seatNumber: String(i),

        status:
          "available" as const,
      });
    }

    // =================================
    // SAVE SEATS
    // =================================

    await Seat.bulkCreate(seats);

    // =================================
    // RESPONSE
    // =================================

    return reply.code(201).send({
      message:
        "Show created successfully",

      show,

      seatsCreated:
        totalSeats,
    });

  } catch (error: any) {

    console.error(
      "❌ CREATE SHOW ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to create show",

      error: error.message,
    });
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
// =====================================

export const getShowById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {

    const { id } =
      request.params as {
        id: string;
      };

    const show =
      await Show.findByPk(
        Number(id),
        {
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
            },
          ],
        }
      );

    if (!show) {
      return reply.code(404).send({
        message:
          "Show not found",
      });
    }

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
