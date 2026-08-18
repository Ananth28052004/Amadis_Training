import { FastifyInstance } from "fastify";

import  Seat  from "../models/Seat";

const seatRoutes = async (app: FastifyInstance) => {
  app.get("/show/:showId", async (request, reply) => {
    try {
      const { showId } = request.params as {
        showId: string;
      };

      const seats = await Seat.findAll({
        where: {
          showId: Number(showId),
        },
        order: [["seatNumber", "ASC"]],
      });

      return {
        seats,
      };
    } catch (error) {
      console.error(error);

      return reply.code(500).send({
        message: "Failed to get seats",
      });
    }
  });
};

export default seatRoutes;