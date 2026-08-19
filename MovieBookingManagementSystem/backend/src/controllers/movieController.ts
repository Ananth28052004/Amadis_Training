import {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import Theater from "../models/Theater.js";

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
// CREATE MOVIE
// ADMIN ONLY
// POST /api/movies
// =====================================

export const createMovie = async (
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
    // GET REQUEST BODY
    // =================================

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
      image?: string;
    };

    // =================================
    // VALIDATION
    // =================================

    if (
      !title ||
      !description ||
      !genre ||
      !image
    ) {
      return reply.code(400).send({
        message:
          "title, description and genre are required",
      });
    }

    const parsedDuration =
      Number(duration);

    const parsedRating =
      Number(rating);

    if (
      !Number.isInteger(
        parsedDuration
      ) ||
      parsedDuration <= 0
    ) {
      return reply.code(400).send({
        message:
          "Duration must be a positive integer",
      });
    }

    if (
      Number.isNaN(parsedRating) ||
      parsedRating < 0 ||
      parsedRating > 10
    ) {
      return reply.code(400).send({
        message:
          "Rating must be between 0 and 10",
      });
    }

    // =================================
    // CREATE MOVIE
    // =================================

    const movie =
      await Movie.create({
        title: title.trim(),
        description: description.trim(),
        genre: genre.trim(),
        duration: parsedDuration,
        rating: parsedRating,
        image: image.trim(),
      });

    // =================================
    // RESPONSE
    // =================================

    return reply.code(201).send({
      message:
        "Movie created successfully",

      movie,
    });

  } catch (error: any) {

    console.error(
      "❌ CREATE MOVIE ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to create movie",

      error: error.message,
    });
  }
};


// =====================================
// GET ALL MOVIES
// PUBLIC
// GET /api/movies
// =====================================

export const getMovies = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {

    const movies =
      await Movie.findAll({
        order: [
          ["createdAt", "DESC"],
        ],
      });

    return reply.send({
      message:
        "Movies fetched successfully",

      totalMovies:
        movies.length,

      movies,
    });

  } catch (error: any) {

    console.error(
      "❌ GET MOVIES ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to get movies",

      error: error.message,
    });
  }
};

// =====================================
// GET ONE MOVIE
// PUBLIC
// GET /api/movies/:id
// =====================================

export const getMovie = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {

    const { id } =
      request.params as {
        id: string;
      };

    const movieId =
      Number(id);

    if (
      !Number.isInteger(movieId) ||
      movieId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid movie id is required",
      });
    }

    const movie =
      await Movie.findByPk(
        movieId
      );

    if (!movie) {
      return reply.code(404).send({
        message:
          "Movie not found",
      });
    }

    return reply.send({
      message:
        "Movie fetched successfully",

      movie,
    });

  } catch (error: any) {

    console.error(
      "❌ GET MOVIE ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to get movie",

      error: error.message,
    });
  }
};



// =====================================
// UPDATE MOVIE
// ADMIN ONLY
// PUT /api/movies/:id
// =====================================

export const updateMovie = async (
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
    // GET MOVIE ID
    // =================================

    const { id } = request.params as {
      id: string;
    };

    const movieId = Number(id);

    if (
      !Number.isInteger(movieId) ||
      movieId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid movie id is required",
      });
    }

    // =================================
    // FIND MOVIE
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
    // GET BODY
    // =================================

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

    // =================================
    // VALIDATE DURATION
    // =================================

    if (duration !== undefined) {
      const parsedDuration =
        Number(duration);

      if (
        !Number.isInteger(parsedDuration) ||
        parsedDuration <= 0
      ) {
        return reply.code(400).send({
          message:
            "Duration must be a positive integer",
        });
      }
    }

    // =================================
    // VALIDATE RATING
    // =================================

    if (rating !== undefined) {
      const parsedRating =
        Number(rating);

      if (
        Number.isNaN(parsedRating) ||
        parsedRating < 0 ||
        parsedRating > 10
      ) {
        return reply.code(400).send({
          message:
            "Rating must be between 0 and 10",
        });
      }
    }

    // =================================
    // UPDATE MOVIE
    // =================================

    await movie.update({
      ...(title !== undefined && {
        title: title.trim(),
      }),

      ...(description !== undefined && {
        description:
          description.trim(),
      }),

      ...(genre !== undefined && {
        genre: genre.trim(),
      }),

      ...(duration !== undefined && {
        duration: Number(duration),
      }),

      ...(rating !== undefined && {
        rating: Number(rating),
      }),

      ...(image !== undefined && {
        image: image.trim(),
      }),
    });

    // =================================
    // RESPONSE
    // =================================

    return reply.send({
      message:
        "Movie updated successfully",

      movie,
    });

  } catch (error: any) {

    console.error(
      "❌ UPDATE MOVIE ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to update movie",

      error: error.message,
    });
  }
};




// =====================================
// DELETE MOVIE
// ADMIN ONLY
// DELETE /api/movies/:id
// =====================================

export const deleteMovie = async (
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
    // GET MOVIE ID
    // =================================

    const { id } = request.params as {
      id: string;
    };

    const movieId = Number(id);

    if (
      !Number.isInteger(movieId) ||
      movieId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid movie id is required",
      });
    }

    // =================================
    // FIND MOVIE
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
    // DELETE MOVIE
    // =================================

    await movie.destroy();

    // =================================
    // RESPONSE
    // =================================

    return reply.send({
      message:
        "Movie deleted successfully",

      movieId,
    });

  } catch (error: any) {

    console.error(
      "❌ DELETE MOVIE ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to delete movie",

      error: error.message,
    });
  }
};




// =====================================
// GET ALL MOVIES
// PUBLIC
// GET /api/movies
// =====================================

export const getAllMovies = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const movies = await Movie.findAll({
      include: [
        {
          model: Show,
          as: "shows",

          include: [
            {
              model: Theater,
              as: "theater",
            },
          ],
        },
      ],

      order: [
        ["createdAt", "DESC"],
      ],
    });

    return reply.send({
      message:
        "Movies fetched successfully",

      totalMovies:
        movies.length,

      movies,
    });

  } catch (error: any) {

    console.error(
      "❌ GET ALL MOVIES ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch movies",

      error: error.message,
    });
  }
};



// =====================================
// GET MOVIE BY ID
// PUBLIC
// GET /api/movies/:id
// =====================================

export const getMovieById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // =================================
    // GET MOVIE ID
    // =================================

    const { id } = request.params as {
      id: string;
    };

    const movieId = Number(id);

    if (
      !Number.isInteger(movieId) ||
      movieId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid movie id is required",
      });
    }

    // =================================
    // FIND MOVIE
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
    // RESPONSE
    // =================================

    return reply.send({
      message:
        "Movie fetched successfully",

      movie,
    });

  } catch (error: any) {

    console.error(
      "❌ GET MOVIE ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch movie",

      error: error.message,
    });
  }
};

