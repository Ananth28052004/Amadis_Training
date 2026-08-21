import {FastifyReply,FastifyRequest,
} from "fastify";
import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

// ADMIN CHECK
const checkAdmin = (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = request.user as {
    id: number;
    role: string;
  };

  if (!user || !user.id) {
    reply.code(401).send({
      message:
        "Unauthorized. Please login first.",
    });

    return false;
  }

  if (user.role !== "admin") {
    reply.code(403).send({
      message:
        "Access denied. Admin only.",
    });

    return false;
  }

  return true;
};

// ADMIN DASHBOARD
export const getAdminDashboard = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!checkAdmin(request, reply)) {
      return;
    }

    // GET COUNTS
    const totalUsers =await User.count();
    const totalMovies =await Movie.count();
    const totalTheaters =await Theater.count();
    const totalShows =await Show.count();
    const totalBookings =await Booking.count();

    // BOOKING COUNTS
    const confirmedBookings =
      await Booking.count({
        where: {
          status: "confirmed",
        },
      });

    const cancelledBookings =
      await Booking.count({
        where: {
          status: "cancelled",
        },
      });

    // GET CONFIRMED BOOKINGS
    const confirmed =
      await Booking.findAll({
        where: {
          status: "confirmed",
        },

        include: [
          {
            model: Show,
            as: "show",
          },
        ],
      });

    // CALCULATE REVENUE
    const totalRevenue =
      confirmed.reduce(
        (total, booking: any) => {
          const price =
            Number(
              booking.show?.price || 0
            );

          return total + price;
        },
        0
      );

    // RESPONSE
    return reply.send({
      message:
        "Admin dashboard fetched successfully",

      dashboard: {
        users: {
          total: totalUsers,
        },

        movies: {
          total: totalMovies,
        },

        theaters: {
          total: totalTheaters,
        },

        shows: {
          total: totalShows,
        },

        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
        },

        revenue: {
          total: totalRevenue,
        },
      },
    });

  }
  catch (error: any) {
    console.error("❌ ADMIN DASHBOARD ERROR:",error);
    return reply.code(500).send({
      message:"Failed to fetch admin dashboard",
      error: error.message,
    });
  }
};