import {
  FastifyInstance,
} from "fastify";

import {
  createShow,
  getShows,
  getShowById,
} from "../controllers/showController.js";

const authenticate = async (
  request: any,
  reply: any
) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.code(401).send({
      message:
        "Unauthorized. Please login first.",
    });
  }
};

const showRoutes = async (
  app: FastifyInstance
) => {

  // ================================
  // CREATE SHOW
  // ADMIN ONLY
  // ================================

  app.post(
    "/",
    {
      preHandler: authenticate,
    },
    createShow
  );

  // ================================
  // GET ALL SHOWS
  // ================================

  app.get(
    "/",
    getShows
  );

  // ================================
  // GET SHOW BY ID
  // ================================

  app.get(
    "/:id",
    getShowById
  );
};

export default showRoutes;
