import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import {
  createShow,
  getShows,
  getShowById,
  getShowsByMovie,
  updateShow,
  deleteShow,
} from "../controllers/showController.js";

// =====================================
// ADMIN AUTHENTICATION
// =====================================

import { adminOnly } from "../middleware/authMiddleware.js";

// =====================================
// SHOW ROUTES
// =====================================

const showRoutes = async (
  app: FastifyInstance
) => {

  // ===================================
  // CREATE SHOW
  // ADMIN ONLY
  // POST /api/shows
  // ===================================

  app.post(
    "/",
    {
      preHandler: adminOnly,
    },
    createShow
  );

  // ===================================
  // GET ALL SHOWS
  // PUBLIC
  // GET /api/shows
  // ===================================

  app.get(
    "/",
    getShows
  );

  // ===================================
  // GET SHOWS BY MOVIE
  // PUBLIC
  // GET /api/shows/movie/:movieId
  // ===================================

  app.get(
    "/movie/:movieId",
    getShowsByMovie
  );

  // ===================================
  // GET SHOW BY ID
  // PUBLIC
  // GET /api/shows/:id
  // ===================================

  app.get(
    "/:id",
    getShowById
  );

  // ===================================
  // UPDATE SHOW
  // ADMIN ONLY
  // PUT /api/shows/:id
  // ===================================

  app.put(
    "/:id",
    {
      preHandler: adminOnly,
    },
    updateShow
  );

  // ===================================
  // DELETE SHOW
  // ADMIN ONLY
  // DELETE /api/shows/:id
  // ===================================

  app.delete(
    "/:id", 
    {
      preHandler: adminOnly,
    },
    deleteShow
  );
};

export default showRoutes;
