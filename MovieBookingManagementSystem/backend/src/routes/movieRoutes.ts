import { FastifyInstance } from "fastify";

import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController";

import { adminMiddleware } from "../middleware/adminMiddleware";

const movieRoutes = async (
  app: FastifyInstance
) => {
  // Public
  app.get("/", getAllMovies);

  app.get("/:movieId", getMovieById);

  // Admin
  app.post(
    "/",
    {
      preHandler: adminMiddleware,
    },
    createMovie
  );

  app.put(
    "/:movieId",
    {
      preHandler: adminMiddleware,
    },
    updateMovie
  );

  app.delete(
    "/:movieId",
    {
      preHandler: adminMiddleware,
    },
    deleteMovie
  );
};

export default movieRoutes;
