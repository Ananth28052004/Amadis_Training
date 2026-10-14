
import {FastifyInstance,FastifyReply,FastifyRequest,} from "fastify";
import {createBooking,cancelBooking,getMyBookings,getBookingById,getAllBookings,adminCancelBooking,
  getBookingStats,getAdminDashboard,getConfirmedBookings,getCancelledBookings,
  getBookingsByShow,getShowSeatStatus,adminDeleteBooking} from "../controllers/bookingController.js";

// AUTHENTICATION
const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
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

// BOOKING ROUTES
const bookingRoutes = async (
  app: FastifyInstance
) => {

  // CREATE BOOKING  POST /api/bookings
  app.post("/",
    {
      preHandler: authenticate,
    },
    createBooking
  );

  // GET MY BOOKINGS GET /api/bookings/my
  app.get("/my",
    {
      preHandler: authenticate,
    },
    getMyBookings
  );
  // GET ALL BOOKINGS GET /api/bookings/all

  app.get("/all",
    {
      preHandler: authenticate,
    },
    getAllBookings
  );

  // ADMIN DASHBOARD
  // GET /api/bookings/admin/dashboard
  app.get("/admin/dashboard",
    {
      preHandler: authenticate,
    },
    getAdminDashboard
  );

  // ADMIN BOOKING STATS
  // GET /api/bookings/admin/stats
  app.get("/admin/stats",
    {
      preHandler: authenticate,
    },
    getBookingStats
  );

  // ADMIN CANCEL BOOKING
  // PATCH /api/bookings/admin/:id/cancel
  app.patch("/admin/:id/cancel",
    {
      preHandler: authenticate,
    },
    adminCancelBooking
  );
  // GET BOOKING BY ID
  // GET /api/bookings/:id
  app.get("/:id",
    {
      preHandler: authenticate,
    },
    getBookingById
  );

  // CANCEL OWN BOOKING
  // DELETE /api/bookings/:id
  app.delete("/:id",
    {
      preHandler: authenticate,
    },
    cancelBooking
  );


// GET CONFIRMED BOOKINGS
// GET /api/bookings/admin/confirmed
app.get("/admin/confirmed",
  {
    preHandler: authenticate,
  },
  getConfirmedBookings
);

// GET CANCELLED BOOKINGS GET /api/bookings/admin/cancelled
app.get("/admin/cancelled",
  {
    preHandler: authenticate,
  },
  getCancelledBookings
);

// GET BOOKINGS BY SHOW
// GET /api/bookings/admin/show/:showId
app.get("/admin/show/:showId",
  {
    preHandler: authenticate,
  },
  getBookingsByShow
);

// GET SHOW SEAT STATUS
// GET /api/bookings/admin/show/:showId/seats

app.get("/admin/show/:showId/seats",
  {
    preHandler: authenticate,
  },
  getShowSeatStatus
);

// DELETE BOOKING
// DELETE /api/bookings/admin/:id

app.delete("/admin/:id",
  {
    preHandler: authenticate,
  },
  adminDeleteBooking
);
};

export default bookingRoutes;
