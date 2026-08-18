import {
  FastifyInstance,
} from "fastify";

import {
  createTheater,
  getTheaters,
  getTheaterById,
} from "../controllers/theaterController.js";

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

const theaterRoutes = async (
  app: FastifyInstance
) => {

  // ===================================
  // CREATE THEATER
  // ADMIN ONLY
  // ===================================

  app.post(
    "/",
    {
      preHandler: authenticate,
    },
    createTheater
  );

  // ===================================
  // GET ALL THEATERS
  // ===================================

  app.get(
    "/",
    getTheaters
  );

  // ===================================
  // GET THEATER BY ID
  // ===================================

  app.get(
    "/:id",
    getTheaterById
  );
};

export default theaterRoutes;
