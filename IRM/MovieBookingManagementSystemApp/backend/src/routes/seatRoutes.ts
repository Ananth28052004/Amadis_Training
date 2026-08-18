import {
  FastifyInstance,
} from "fastify";

import {
  getSeatsByShow,
} from "../controllers/seatController.js";

const seatRoutes = async (
  app: FastifyInstance
) => {

  // =====================================
  // GET SEATS FOR SHOW
  // =====================================

  app.get(
    "/show/:showId",
    getSeatsByShow
  );
};

export default seatRoutes;
