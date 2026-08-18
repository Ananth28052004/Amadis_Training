import { FastifyInstance } from "fastify";

import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookingById,lockSeats,
} from "../controllers/bookingController";

const bookingRoutes = async (app: FastifyInstance) => {
  // Create booking
  app.post(
    "/",
    {
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch {
          return reply.code(401).send({
            message: "Unauthorized",
          });
        }
      },
    },
    createBooking
  );

  // My bookings
  app.get(
    "/my",
    {
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch {
          return reply.code(401).send({
            message: "Unauthorized",
          });
        }
      },
    },
    getMyBookings
  );
  app.patch(
  "/:id/cancel",
  {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }
    },
  },
  cancelBooking
);
app.get(
  "/:id",
  {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }
    },
  },
  getBookingById
);
app.post(
  "/lock",
  async (request, reply) => {
    try {
      await request.jwtVerify();

      return lockSeats(request, reply);
    } catch (error) {
      return reply.code(401).send({
        message: "Please login first",
      });
    }
  }
);
};

export default bookingRoutes;