import { Movie } from "../models";

export const createMovie = async (
  request: any,
  reply: any
) => {
  try {
    const {
      title,
      description,
      duration,
      language,
      posterUrl,
    } = request.body;

    if (
      !title ||
      !description ||
      !duration ||
      !language
    ) {
      return reply.code(400).send({
        message: "All movie fields are required",
      });
    }

    const movie = await Movie.create({
      title,
      description,
      duration: Number(duration),
      language,
      posterUrl: posterUrl || null,
    });

    return reply.code(201).send({
      message: "Movie created successfully",
      movie,
    });
  } catch (error: any) {
    console.error("Create movie error:", error);

    return reply.code(500).send({
      message: "Failed to create movie",
      error: error.message,
    });
  }
};

export const getAllMovies = async (
  request: any,
  reply: any
) => {
  try {
    const movies = await Movie.findAll();

    return reply.send({
      movies,
    });
  } catch (error: any) {
    console.error("Get movies error:", error);

    return reply.code(500).send({
      message: "Failed to get movies",
      error: error.message,
    });
  }
};

export const getMovieById = async (
  request: any,
  reply: any
) => {
  try {
    const { movieId } = request.params;

    const movie = await Movie.findByPk(
      Number(movieId)
    );

    if (!movie) {
      return reply.code(404).send({
        message: "Movie not found",
      });
    }

    return reply.send({
      movie,
    });
  } catch (error: any) {
    console.error("Get movie error:", error);

    return reply.code(500).send({
      message: "Failed to get movie",
      error: error.message,
    });
  }
};

export const updateMovie = async (
  request: any,
  reply: any
) => {
  try {
    const { movieId } = request.params;

    const movie = await Movie.findByPk(
      Number(movieId)
    );

    if (!movie) {
      return reply.code(404).send({
        message: "Movie not found",
      });
    }

    const {
      title,
      description,
      duration,
      language,
      posterUrl,
    } = request.body;

    await movie.update({
      title,
      description,
      duration: Number(duration),
      language,
      posterUrl: posterUrl || null,
    });

    return reply.send({
      message: "Movie updated successfully",
      movie,
    });
  } catch (error: any) {
    console.error("Update movie error:", error);

    return reply.code(500).send({
      message: "Failed to update movie",
      error: error.message,
    });
  }
};

export const deleteMovie = async (
  request: any,
  reply: any
) => {
  try {
    const { movieId } = request.params;

    const movie = await Movie.findByPk(
      Number(movieId)
    );

    if (!movie) {
      return reply.code(404).send({
        message: "Movie not found",
      });
    }

    await movie.destroy();

    return reply.send({
      message: "Movie deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete movie error:", error);

    return reply.code(500).send({
      message: "Failed to delete movie",
      error: error.message,
    });
  }
};
