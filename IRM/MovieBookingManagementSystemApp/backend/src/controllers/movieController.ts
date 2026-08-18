import { FastifyReply, FastifyRequest } from "fastify";
import Movie from "../models/Movie.js";

// ==============================
// ADD MOVIE
// ==============================

export const createMovie = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const {
      title,
      description,
      genre,
      duration,
      rating,
      image,
    } = request.body as {
      title: string;
      description: string;
      genre: string;
      duration: number;
      rating: number;
      image: string;
    };

    if (
      !title ||
      !description ||
      !genre ||
      !duration ||
      rating === undefined ||
      !image
    ) {
      return reply.code(400).send({
        message: "All movie fields are required",
      });
    }

    const movie = await Movie.create({
      title,
      description,
      genre,
      duration,
      rating,
      image,
    });

    return reply.code(201).send({
      message: "Movie created successfully",
      movie,
    });
  } catch (error) {
    console.error("CREATE MOVIE ERROR:", error);

    return reply.code(500).send({
      message: "Failed to create movie",
    });
  }
};

// ==============================
// GET ALL MOVIES
// ==============================

export const getMovies = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const movies = await Movie.findAll({
      order: [["createdAt", "DESC"]],
    });

    return reply.send({
      message: "Movies fetched successfully",
      movies,
    });
  } catch (error) {
    console.error("GET MOVIES ERROR:", error);

    return reply.code(500).send({
      message: "Failed to get movies",
    });
  }
};

// ==============================
// GET ONE MOVIE
// ==============================

export const getMovie = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as {
      id: string;
    };

    const movie = await Movie.findByPk(Number(id));

    if (!movie) {
      return reply.code(404).send({
        message: "Movie not found",
      });
    }

    return reply.send({
      message: "Movie fetched successfully",
      movie,
    });
  } catch (error) {
    console.error("GET MOVIE ERROR:", error);

    return reply.code(500).send({
      message: "Failed to get movie",
    });
  }
};

// ==============================
// UPDATE MOVIE
// ==============================

export const updateMovie = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as {
      id: string;
    };

    const movie = await Movie.findByPk(Number(id));

    if (!movie) {
      return reply.code(404).send({
        message: "Movie not found",
      });
    }

    const {
      title,
      description,
      genre,
      duration,
      rating,
      image,
    } = request.body as {
      title?: string;
      description?: string;
      genre?: string;
      duration?: number;
      rating?: number;
      image?: string;
    };

    await movie.update({
      title: title ?? movie.title,
      description: description ?? movie.description,
      genre: genre ?? movie.genre,
      duration: duration ?? movie.duration,
      rating: rating ?? movie.rating,
      image: image ?? movie.image,
    });

    return reply.send({
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    console.error("UPDATE MOVIE ERROR:", error);

    return reply.code(500).send({
      message: "Failed to update movie",
    });
  }
};

// ==============================
// DELETE MOVIE
// ==============================

export const deleteMovie = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as {
      id: string;
    };

    const movie = await Movie.findByPk(Number(id));

    if (!movie) {
      return reply.code(404).send({
        message: "Movie not found",
      });
    }

    await movie.destroy();

    return reply.send({
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MOVIE ERROR:", error);

    return reply.code(500).send({
      message: "Failed to delete movie",
    });
  }
};
