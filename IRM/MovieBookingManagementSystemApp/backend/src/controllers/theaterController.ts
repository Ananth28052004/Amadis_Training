import {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import Theater from "../models/Theater.js";

// =====================================
// CHECK ADMIN
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
// CREATE THEATER
// ADMIN ONLY
// =====================================

export const createTheater = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!checkAdmin(request, reply)) {
      return;
    }

    const {
      name,
      location,
      totalSeats,
    } = request.body as {
      name: string;
      location: string;
      totalSeats: number;
    };

    // Validation
    if (
      !name ||
      !location ||
      !totalSeats
    ) {
      return reply.code(400).send({
        message:
          "name, location and totalSeats are required",
      });
    }

    if (totalSeats <= 0) {
      return reply.code(400).send({
        message:
          "totalSeats must be greater than 0",
      });
    }

    // Create theater
    const theater =
      await Theater.create({
        name,
        location,
        totalSeats,
      });

    return reply.code(201).send({
      message:
        "Theater created successfully",

      theater,
    });

  } catch (error: any) {

    console.error(
      "CREATE THEATER ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to create theater",

      error: error.message,
    });
  }
};

// =====================================
// GET ALL THEATERS
// =====================================

export const getTheaters = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {

    const theaters =
      await Theater.findAll({
        order: [
          ["createdAt", "DESC"],
        ],
      });

    return reply.send({
      message:
        "Theaters fetched successfully",

      totalTheaters:
        theaters.length,

      theaters,
    });

  } catch (error: any) {

    console.error(
      "GET THEATERS ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch theaters",

      error: error.message,
    });
  }
};

// =====================================
// GET THEATER BY ID
// =====================================

export const getTheaterById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {

    const { id } =
      request.params as {
        id: string;
      };

    const theater =
      await Theater.findByPk(
        Number(id)
      );

    if (!theater) {
      return reply.code(404).send({
        message:
          "Theater not found",
      });
    }

    return reply.send({
      message:
        "Theater fetched successfully",

      theater,
    });

  } catch (error: any) {

    console.error(
      "GET THEATER ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch theater",

      error: error.message,
    });
  }
};
