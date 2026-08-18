import { FastifyInstance } from "fastify";

import {
  createShow,
  getAllShows,
  getShowsByMovie,
  updateShow,
  deleteShow,
} from "../controllers/showController";

import { adminMiddleware } from "../middleware/adminMiddleware";

const showRoutes = async (
  app: FastifyInstance
) => {

  // Public
  app.get("/", getAllShows);

  app.get(
    "/movie/:movieId",
    getShowsByMovie
  );

  // Admin
  app.post(
    "/",
    {
      preHandler: adminMiddleware,
    },
    createShow
  );

  app.put(
    "/:showId",
    {
      preHandler: adminMiddleware,
    },
    updateShow
  );

  app.delete(
    "/:showId",
    {
      preHandler: adminMiddleware,
    },
    deleteShow
  );
};

export default showRoutes;
