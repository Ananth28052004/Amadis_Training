import {
  FastifyInstance,
} from "fastify";

import {
  createMovie,
  getMovies,
  updateMovie,
  deleteMovie,
  getMovieById,
} from "../controllers/movieController.js";

import {
  adminOnly,
} from "../middleware/authMiddleware.js";

const movieRoutes = async (
  app: FastifyInstance
) => {

  // ============================
  // GET ALL MOVIES
  // Anyone can view movies
  // GET /api/movies
  // ============================

  app.get(
    "/",
    getMovies
  );

  // ============================
  // GET ONE MOVIE
  // Anyone can view movie
  // GET /api/movies/:id
  // ============================

  app.get(
    "/:id",
    getMovieById
  );

  // ============================
  // CREATE MOVIE
  // ADMIN ONLY
  // POST /api/movies
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
  // PUT /api/movies/:id
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
  // DELETE /api/movies/:id
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
