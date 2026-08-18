import { FastifyInstance } from "fastify";

import {
  createMovie,
  getMovies,
  getMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

import {
  authenticate,
  adminOnly,
} from "../middleware/authMiddleware.js";

const movieRoutes = async (
  app: FastifyInstance
) => {

  // ============================
  // GET ALL MOVIES
  // Anyone can view movies
  // ============================

  app.get("/", getMovies);

  // ============================
  // GET ONE MOVIE
  // Anyone can view movie
  // ============================

  app.get("/:id", getMovie);

  // ============================
  // CREATE MOVIE
  // ADMIN ONLY
  // ============================

  app.post(
    "/",
    {
      preHandler: adminOnly,
    },
    createMovie
  );

  // ============================
  // UPDATE MOVIE
  // ADMIN ONLY
  // ============================

  app.put(
    "/:id",
    {
      preHandler: adminOnly,
    },
    updateMovie
  );

  // ============================
  // DELETE MOVIE
  // ADMIN ONLY
  // ============================

  app.delete(
    "/:id",
    {
      preHandler: adminOnly,
    },
    deleteMovie
  );
};

export default movieRoutes;
