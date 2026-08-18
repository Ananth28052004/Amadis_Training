import {
  FastifyInstance,
} from "fastify";

import {
  createBooking,
  cancelBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
} from "../controllers/bookingController.js";

// =====================================
// AUTHENTICATION
// =====================================

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

// =====================================
// BOOKING ROUTES
// =====================================

const bookingRoutes = async (
  app: FastifyInstance
) => {

  // ===================================
  // CREATE BOOKING
  // POST /api/bookings
  // ===================================

  app.post(
    "/",
    {
      preHandler: authenticate,
    },
    createBooking
  );

  // ===================================
  // GET MY BOOKINGS
  // GET /api/bookings/my
  // ===================================

  app.get(
    "/my",
    {
      preHandler: authenticate,
    },
    getMyBookings
  );

  // ===================================
  // GET ALL BOOKINGS
  // ADMIN ONLY
  // GET /api/bookings/all
  // ===================================

  app.get(
    "/all",
    {
      preHandler: authenticate,
    },
    getAllBookings
  );

  // ===================================
  // GET BOOKING BY ID
  // GET /api/bookings/:id
  // ===================================

  app.get(
    "/:id",
    {
      preHandler: authenticate,
    },
    getBookingById
  );

  // ===================================
  // CANCEL BOOKING
  // DELETE /api/bookings/:id
  // ===================================

  app.delete(
    "/:id",
    {
      preHandler: authenticate,
    },
    cancelBooking
  );
};

export default bookingRoutes;
