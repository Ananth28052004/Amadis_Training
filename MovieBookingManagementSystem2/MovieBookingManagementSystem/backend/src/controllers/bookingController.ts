import {FastifyReply,FastifyRequest,} from "fastify";
import {Transaction,} from "sequelize";
import sequelize from "../config/database.js";
import Booking from "../models/Booking.js";
import Seat from "../models/Seat.js";
import User from "../models/User.js";
import Show from "../models/Show.js";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";
import { ensureSeatsForShow } from "../services/seatService.js";

// BOOK A SEAT
// LOGIN REQUIRED
export const createBooking = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  let transaction: Transaction | null = null;
  try {
    const body = (request.body ?? {}) as {
      showId?: number | string;
      seatId?: number | string;
      seatIds?: Array<number | string>;
    };
    const parsedShowId = Number(body.showId);
    const requestedSeatIds = Array.isArray(body.seatIds)
      ? body.seatIds.map(Number): body.seatId !== undefined
      ? [Number(body.seatId)]:[];
    const uniqueSeatIds = [...new Set(requestedSeatIds)];
    if (
      !Number.isInteger(parsedShowId) ||
      parsedShowId <= 0 ||
      uniqueSeatIds.length === 0 ||
      uniqueSeatIds.some(
        (seatId) => !Number.isInteger(seatId) || seatId <= 0
      )
    ) {
      return reply.code(400).send({
        message: "Valid showId and seatId(s) are required",
      });
    }
    const user = request.user as { id?: number };
    if (!user?.id) {
      return reply.code(401).send({
        message: "Unauthorized. Please login first.",
      });
    }

    // Make sure the show has a complete seat map before booking.
    try {
      await ensureSeatsForShow(parsedShowId);
    } catch (seatError: any) {
      const seatMessage = String(seatError?.message ?? "");
      if (seatMessage === "SHOW_NOT_FOUND") {
        return reply.code(404).send({ message: "Show not found" });
      }

      if (seatMessage.startsWith("THEATER_NOT_FOUND_FOR_SHOW:")) {
        const [, currentShowId, theaterId] = seatMessage.split(":");
        return reply.code(409).send({
          message: `The theater linked to show ${currentShowId} is missing. theaterId=${theaterId}. Fix the show theater before booking.`,
        });
      }

      throw seatError;
    }

    transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    // FOR UPDATE is important here. It prevents two users from
    // successfully booking the same seat at the same time.
    const seats = await Seat.findAll({
      where: {
        id: uniqueSeatIds,
        showId: parsedShowId,
      },
      transaction,
      lock: Transaction.LOCK.UPDATE,
      order: [["id", "ASC"]],
    });

    if (seats.length !== uniqueSeatIds.length) {
      await transaction.rollback();
      transaction = null;

      return reply.code(404).send({
        message: "One or more selected seats were not found for this show",
      });
    }

    const alreadyBooked = seats.filter(
      (seat) => seat.status === "booked"
    );

    if (alreadyBooked.length > 0) {
      await transaction.rollback();
      transaction = null;

      return reply.code(409).send({
        message: `Seat(s) already booked: ${alreadyBooked
          .map((seat) => seat.seatNumber)
          .join(", ")}`,
      });
    }

    const createdBookings: Booking[] = [];

    for (const seat of seats) {
      const booking = await Booking.create(
        {
          userId: user.id,
          showId: parsedShowId,
          seatId: seat.id,
          status: "confirmed",
        },
        { transaction }
      );

      await seat.update(
        { status: "booked" },
        { transaction }
      );

      createdBookings.push(booking);
    }

    await transaction.commit();
    transaction = null;

    return reply.code(201).send({
      message: "Seat(s) booked successfully",
      bookings: createdBookings.map((booking) => ({
        id: booking.id,
        userId: booking.userId,
        showId: booking.showId,
        seatId: booking.seatId,
        status: booking.status,
      })),
      booking:
        createdBookings.length === 1
          ? {
              id: createdBookings[0].id,
              userId: createdBookings[0].userId,
              showId: createdBookings[0].showId,
              seatId: createdBookings[0].seatId,
              status: createdBookings[0].status,
            }
          : undefined,
    });
  } 
  catch (error: any) {
    if (transaction && !(transaction as any).finished) {
      await transaction.rollback();
    }
    console.error("❌ CREATE BOOKING ERROR:", error);

    // PostgreSQL unique-constraint errors should be shown as a
    // normal seat-conflict response instead of a generic 500.
    if (error?.name === "SequelizeUniqueConstraintError") {
      return reply.code(409).send({
        message: "One or more selected seats were already booked.",
      });
    }

    return reply.code(500).send({
      message: "Failed to create booking",
      error: error?.message ?? "Unknown booking error",
    });
  }
};

// CANCEL BOOKING
// USER CAN CANCEL OWN BOOKING

export const cancelBooking = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  let transaction: Transaction | null = null;
  try {
    const { id } =
      request.params as {
        id: string;
      };
    const bookingId = Number(id);

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return reply.code(400).send({
        message:"Valid booking id is required",
      });
    }
    const user = request.user as {id: number};

    if (!user || !user.id) {
      return reply.code(401).send({
        message:"Unauthorized. Please login first.",
      });
    }
    transaction =
      await sequelize.transaction({
        isolationLevel:
          Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });

    // FIND BOOKING
    const booking =
      await Booking.findOne({
        where: {
          id: bookingId,
          userId: user.id,
        },
        transaction,
        lock: Transaction.LOCK.UPDATE,
      });
    if (!booking) {
      await transaction.rollback();
      transaction = null;
      return reply.code(404).send({
        message:
          "Booking not found",
      });
    }

    // CHECK STATUS
    if (booking.status === "cancelled") {
      await transaction.rollback();
      transaction = null;
      return reply.code(400).send({
        message:
          "Booking is already cancelled",
      });
    }

    
    // FIND SEAT
    const seat =await Seat.findOne({
        where: {
          id: booking.seatId,
          showId: booking.showId,
        },
        transaction,
        lock: Transaction.LOCK.UPDATE,
      });

    if (!seat) {
      await transaction.rollback();
      transaction = null;
      return reply.code(404).send({
        message:
          "Seat not found",
      });
    }

    // CANCEL BOOKING
    await booking.update(
      {
        status: "cancelled",
      },
      {
        transaction,
      }
    );

    // RELEASE SEAT
    await seat.update(
      {
        status: "available",
      },
      {
        transaction,
      }
    );

    // COMMIT
    await transaction.commit();
    transaction = null;
    return reply.send({
      message:"Booking cancelled successfully",
      booking: {
        id: booking.id,
        userId: booking.userId,
        showId: booking.showId,
        seatId: booking.seatId,
        status: booking.status,
      },
      seat: {
        id: seat.id,
        seatNumber: seat.seatNumber,
        status: seat.status,
      },
    });
  } 
  catch (error: any) {
    if (transaction && !(transaction as any).finished
    ) {
      await transaction.rollback();
    }

    console.error("❌ CANCEL BOOKING ERROR:",error
    );
    return reply.code(500).send({
      message:"Failed to cancel booking",
      error: error.message,
    });
  }
};

// GET MY BOOKINGS
// LOGIN REQUIRED
export const getMyBookings = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as {
      id: number;
    };
    if (!user || !user.id) {
      return reply.code(401).send({
        message:"Unauthorized. Please login first.",
      });
    }

    // GET BOOKINGS
    const bookings =
      await Booking.findAll({
        where: {
          userId: user.id,
        },

        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
              "role",
            ],
          },

          {
            model: Show,
            as: "show",

            include: [
              {
                model: Movie,
                as: "movie",
              },

              {
                model: Theater,
                as: "theater",
              },
            ],
          },

          {
            model: Seat,
            as: "seat",
          },
        ],

        order: [["createdAt", "DESC"],],
      });

    // RESPONSE
    return reply.send({
      message:
        "Bookings fetched successfully",
      totalBookings:bookings.length,
      bookings,
    });

  } 
  catch (error: any) {
    console.error("❌ GET MY BOOKINGS ERROR:",error);
    return reply.code(500).send({
      message:"Failed to fetch bookings",
      error: error.message,
    });
  }
};
// GET BOOKING BY ID
// USER CAN SEE OWN BOOKING
export const getBookingById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } =
      request.params as {
        id: string;
      };
    const bookingId = Number(id);
    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid booking id is required",
      });
    }
    const user = request.user as {
      id: number;
    };
    if (!user || !user.id) {
      return reply.code(401).send({
        message:"Unauthorized. Please login first.",
      });
    }
    const booking =
      await Booking.findOne({
        where: {
          id: bookingId,
          userId: user.id,
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
              "role",
            ],
          },
          {
            model: Show,
            as: "show",

            include: [
              {
                model: Movie,
                as: "movie",
              },
              {
                model: Theater,
                as: "theater",
              },
            ],
          },
          {
            model: Seat,
            as: "seat",
          },
        ],
      });

    if (!booking) {
      return reply.code(404).send({
        message:"Booking not found",
      });
    }
    return reply.send({
      message:"Booking fetched successfully",
      booking,
    });
  } 
  catch (error: any) {
    console.error("❌ GET BOOKING ERROR:",error);
    return reply.code(500).send({
      message:"Failed to fetch booking",
      error: error.message,
    });
  }
};

// GET ALL BOOKINGS
// ADMIN ONLY
export const getAllBookings = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as {
      id: number;
      role: string;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }

    // ADMIN CHECK
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:
          "Access denied. Admin only.",
      });
    }

    // GET ALL BOOKINGS
    const bookings =
      await Booking.findAll({
        include: [
          {
            model: User,
            as: "user",

            attributes: [
              "id",
              "name",
              "email",
              "role",
            ],
          },

          {
            model: Show,
            as: "show",

            include: [
              {
                model: Movie,
                as: "movie",
              },

              {
                model: Theater,
                as: "theater",
              },
            ],
          },

          {
            model: Seat,
            as: "seat",
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],
      });

    // RESPONSE
    return reply.send({
      message:
        "All bookings fetched successfully",

      totalBookings:
        bookings.length,

      bookings,
    });

  } catch (error: any) {

    console.error(
      "❌ GET ALL BOOKINGS ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch all bookings",

      error: error.message,
    });
  }
};

export const adminCancelBooking = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  let transaction: Transaction | null = null;

  try {
    const { id } = request.params as {
      id: string;
    };
    const bookingId = Number(id);
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return reply.code(400).send({
        message: "Valid booking id is required",
      });
    }
    const user = request.user as {
      id: number;
      role: string;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message: "Unauthorized. Please login first.",
      });
    }

    // ADMIN CHECK
    if (user.role !== "admin") {
      return reply.code(403).send({
        message: "Access denied. Admin only.",
      });
    }

    // START TRANSACTION
    transaction = await sequelize.transaction({
      isolationLevel:
        Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    // FIND BOOKING
    const booking = await Booking.findByPk(
      bookingId,
      {
        transaction,
        lock: Transaction.LOCK.UPDATE,
      }
    );

    if (!booking) {
      await transaction.rollback();
      transaction = null;

      return reply.code(404).send({
        message: "Booking not found",
      });
    }

    // CHECK STATUS
    if (booking.status === "cancelled") {
      await transaction.rollback();
      transaction = null;
      return reply.code(400).send({
        message: "Booking is already cancelled",
      });
    }

    // FIND SEAT
    const seat = await Seat.findOne({
      where: {
        id: booking.seatId,
        showId: booking.showId,
      },
      transaction,
      lock: Transaction.LOCK.UPDATE,
    });

    if (!seat) {
      await transaction.rollback();
      transaction = null;

      return reply.code(404).send({
        message: "Seat not found",
      });
    }

   // CANCEL BOOKING
    await booking.update(
      {
        status: "cancelled",
      },
      {
        transaction,
      }
    );

    // MAKE SEAT AVAILABLE
    await seat.update(
      {
        status: "available",
      },
      {
        transaction,
      }
    );

    // COMMIT
    await transaction.commit();
    transaction = null;

    // RESPONSE
    return reply.send({
      message: "Booking cancelled by admin successfully",

      booking: {
        id: booking.id,
        userId: booking.userId,
        showId: booking.showId,
        seatId: booking.seatId,
        status: booking.status,
      },

      seat: {
        id: seat.id,
        seatNumber: seat.seatNumber,
        status: seat.status,
      },
    });

  } catch (error: any) {

    if (
      transaction &&
      !(transaction as any).finished
    ) {
      await transaction.rollback();
    }

    console.error(
      "❌ ADMIN CANCEL BOOKING ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to cancel booking",
      error: error.message,
    });
  }
};






// GET BOOKING STATISTICS
// GET /api/bookings/admin/stats
export const getBookingStats = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as {
      id: number;
      role: string;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:
          "Access denied. Admin only.",
      });
    }

    // GET BOOKINGS + SHOW
    const bookings =
      await Booking.findAll({
        include: [
          {
            model: Show,
            as: "show",
            attributes: [
              "id",
              "price",
            ],
          },
        ],
      });

    // CALCULATE BOOKING COUNTS
    const totalBookings =
      bookings.length;

    const confirmedBookings =
      bookings.filter(
        (booking) =>
          booking.status === "confirmed"
      ).length;

    const cancelledBookings =
      bookings.filter(
        (booking) =>
          booking.status === "cancelled"
      ).length;

    // CALCULATE REVENUE
    let totalRevenue = 0;

    for (const booking of bookings) {
      if (
        booking.status !== "confirmed"
      ) {
        continue;
      }

      const show = (booking as any).show;

      if (!show) {
        continue;
      }

      const price = Number(show.price);

      if (
        Number.isFinite(price)
      ) {
        totalRevenue += price;
      }
    }

    // RESPONSE
    return reply.send({
      message:
        "Booking statistics fetched successfully",

      statistics: {
        totalBookings,

        confirmedBookings,

        cancelledBookings,

        totalRevenue:
          Number(
            totalRevenue.toFixed(2)
          ),
      },
    });

  } catch (error: any) {

    console.error("❌ BOOKING STATS ERROR:",error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch booking statistics",

      error: error.message,
    });
  }
};






// GET ADMIN BOOKING BY ID
// ADMIN ONLY
export const getAdminBookingById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as {
      id: number;
      role: string;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }

    // ADMIN CHECK
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:
          "Access denied. Admin only.",
      });
    }

    // GET BOOKING ID
    const { id } = request.params as {
      id: string;
    };

    const bookingId = Number(id);

    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid booking id is required",
      });
    }

    // FIND BOOKING
    const booking =
      await Booking.findByPk(
        bookingId,
        {
          include: [
            {
              association: "user",
              attributes: [
                "id",
                "name",
                "email",
                "role",
              ],
            },

            {
              association: "show",
              include: [
                {
                  association: "movie",
                },

                {
                  association: "theater",
                },
              ],
            },

            {
              association: "seat",
            },
          ],
        }
      );

    // NOT FOUND
    if (!booking) {
      return reply.code(404).send({
        message:
          "Booking not found",
      });
    }

    // RESPONSE
    return reply.send({
      message:
        "Admin booking fetched successfully",

      booking,
    });

  } catch (error: any) {

    console.error(
      "❌ GET ADMIN BOOKING ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch admin booking",

      error: error.message,
    });
  }
};

// ADMIN DASHBOARD
// ADMIN ONLY
export const getAdminDashboard = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as {
      id: number;
      role: string;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }

    
    // ADMIN CHECK
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:
          "Access denied. Admin only.",
      });
    }

    // GET BOOKINGS
    const bookings =await Booking.findAll();

    // BOOKING COUNTS
    const totalBookings =
      bookings.length;

    const confirmedBookings =
      bookings.filter(
        (booking) =>
          booking.status === "confirmed"
      ).length;

    const cancelledBookings =
      bookings.filter(
        (booking) =>
          booking.status === "cancelled"
      ).length;

    // GET CONFIRMED BOOKINGS
    const confirmedBookingsList =
      bookings.filter(
        (booking) =>
          booking.status === "confirmed"
      );

    // GET SHOWS
    const showIds =
      confirmedBookingsList.map(
        (booking) => booking.showId
      );

    const shows =
      showIds.length > 0
        ? await Show.findAll({
            where: {
              id: showIds,
            },
          })
        : [];

        // CALCULATE REVENUE
    const totalRevenue =
      confirmedBookingsList.reduce(
        (total, booking) => {
          const show = shows.find(
            (item) =>
              item.id === booking.showId
          );

          return (
            total +
            (show
              ? Number(show.price)
              : 0)
          );
        },
        0
      );

    // GET SEATS
    const seats =
      await Seat.findAll();

    const totalSeats =
      seats.length;

    const bookedSeats =
      seats.filter(
        (seat) =>
          seat.status === "booked"
      ).length;

    const availableSeats =
      seats.filter(
        (seat) =>
          seat.status === "available"
      ).length;

    // RESPONSE
    return reply.send({
      message:
        "Admin dashboard fetched successfully",

      dashboard: {
        bookings: {
          total: totalBookings,
          confirmed:
            confirmedBookings,
          cancelled:
            cancelledBookings,
        },

        revenue: {
          total: totalRevenue,
        },

        seats: {
          total: totalSeats,
          booked: bookedSeats,
          available:
            availableSeats,
        },
      },
    });

  } catch (error: any) {

    console.error(
      "❌ ADMIN DASHBOARD ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch admin dashboard",

      error: error.message,
    });
  }
};
// GET CONFIRMED BOOKINGS
// GET /api/bookings/admin/confirmed
export const getConfirmedBookings = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as {
      id: number;
      role: string;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:
          "Access denied. Admin only.",
      });
    }

    // GET CONFIRMED BOOKINGS
    const bookings =
      await Booking.findAll({
        where: {
          status: "confirmed",
        },

        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
            ],
          },

          {
            model: Show,
            as: "show",

            include: [
              {
                model: Movie,
                as: "movie",
              },

              {
                model: Theater,
                as: "theater",
              },
            ],
          },

          {
            model: Seat,
            as: "seat",
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],
      });

    // =================================
    // RESPONSE
    // =================================

    return reply.send({
      message:
        "Confirmed bookings fetched successfully",

      totalBookings:
        bookings.length,

      bookings,
    });

  } catch (error: any) {

    console.error(
      "❌ GET CONFIRMED BOOKINGS ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch confirmed bookings",

      error: error.message,
    });
  }
};

// GET CANCELLED BOOKINGS
// GET /api/bookings/admin/cancelled
export const getCancelledBookings = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as {
      id: number;
      role: string;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:
          "Access denied. Admin only.",
      });
    }

    // GET CANCELLED BOOKINGS
    const bookings =
      await Booking.findAll({
        where: {
          status: "cancelled",
        },

        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
            ],
          },

          {
            model: Show,
            as: "show",

            include: [
              {
                model: Movie,
                as: "movie",
              },

              {
                model: Theater,
                as: "theater",
              },
            ],
          },

          {
            model: Seat,
            as: "seat",
          },
        ],

        order: [
          ["updatedAt", "DESC"],
        ],
      });

    // RESPONSE
    return reply.send({
      message:
        "Cancelled bookings fetched successfully",

      totalBookings:
        bookings.length,

      bookings,
    });

  } catch (error: any) {

    console.error(
      "❌ GET CANCELLED BOOKINGS ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch cancelled bookings",

      error: error.message,
    });
  }
};

// GET BOOKINGS BY SHOW
// GET /api/bookings/admin/show/:showId
export const getBookingsByShow = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as {
      id: number;
      role: string;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:
          "Access denied. Admin only.",
      });
    }

    // GET SHOW ID
    const { showId } =
      request.params as {
        showId: string;
      };

    const parsedShowId =
      Number(showId);

    if (
      !Number.isInteger(parsedShowId) ||
      parsedShowId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid showId is required",
      });
    }

    // GET BOOKINGS
    const bookings =
      await Booking.findAll({
        where: {
          showId: parsedShowId,
        },

        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
              "role",
            ],
          },

          {
            model: Show,
            as: "show",

            include: [
              {
                model: Movie,
                as: "movie",
              },

              {
                model: Theater,
                as: "theater",
              },
            ],
          },

          {
            model: Seat,
            as: "seat",
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],
      });

    // RESPONSE
    return reply.send({
      message:
        "Show bookings fetched successfully",

      showId: parsedShowId,

      totalBookings:
        bookings.length,

      bookings,
    });

  } catch (error: any) {

    console.error(
      "❌ GET BOOKINGS BY SHOW ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch show bookings",

      error: error.message,
    });
  }
};

// GET SHOW SEAT STATUS
// GET /api/bookings/admin/show/:showId/seats

export const getShowSeatStatus = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as {
      id: number;
      role: string;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }

    // ADMIN CHECK
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:
          "Access denied. Admin only.",
      });
    }

    // GET SHOW ID
    const { showId } =
      request.params as {
        showId: string;
      };

    const parsedShowId =
      Number(showId);

    if (
      !Number.isInteger(parsedShowId) ||
      parsedShowId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid showId is required",
      });
    }

    // GET SEATS
    const seats =
      await Seat.findAll({
        where: {
          showId: parsedShowId,
        },

        order: [
          ["id", "ASC"],
        ],
      });

    if (seats.length === 0) {
      return reply.code(404).send({
        message:
          "No seats found for this show",
      });
    }

    // CALCULATE STATUS
    const totalSeats =
      seats.length;

    const bookedSeats =
      seats.filter(
        (seat) =>
          seat.status === "booked"
      ).length;

    const availableSeats =
      seats.filter(
        (seat) =>
          seat.status === "available"
      ).length;

    // RESPONSE
    return reply.send({
      message:
        "Show seat status fetched successfully",

      showId: parsedShowId,

      summary: {
        totalSeats,
        bookedSeats,
        availableSeats,
      },

      seats,
    });

  } catch (error: any) {

    console.error(
      "❌ GET SHOW SEAT STATUS ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to fetch show seat status",

      error: error.message,
    });
  }
};


// DELETE BOOKING
// DELETE /api/bookings/admin/:id
export const adminDeleteBooking = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  let transaction: Transaction | null = null;

  try {
    const user = request.user as {
      id: number;
      role: string;
    };

    if (!user || !user.id) {
      return reply.code(401).send({
        message:
          "Unauthorized. Please login first.",
      });
    }
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:
          "Access denied. Admin only.",
      });
    }

    // GET BOOKING ID
    const { id } =
      request.params as {
        id: string;
      };

    const bookingId = Number(id);

    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0
    ) {
      return reply.code(400).send({
        message:
          "Valid booking id is required",
      });
    }

    // START TRANSACTION
    transaction =
      await sequelize.transaction({
        isolationLevel:
          Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });

    // FIND BOOKING
    const booking =
      await Booking.findByPk(
        bookingId,
        {
          transaction,
          lock: Transaction.LOCK.UPDATE,
        }
      );

    if (!booking) {
      await transaction.rollback();
      transaction = null;

      return reply.code(404).send({
        message:
          "Booking not found",
      });
    }

    // FIND SEAT
    const seat =
      await Seat.findOne({
        where: {
          id: booking.seatId,
          showId: booking.showId,
        },

        transaction,

        lock: Transaction.LOCK.UPDATE,
      });

    // MAKE SEAT AVAILABLE
    if (seat) {
      await seat.update(
        {
          status: "available",
        },
        {
          transaction,
        }
      );
    }

    // DELETE BOOKING
    await booking.destroy({
      transaction,
    });

    // COMMIT
    await transaction.commit();
    transaction = null;

    // RESPONSE
    return reply.send({
      message:
        "Booking deleted successfully",

      bookingId,
      seatReleased:
        !!seat,
    });

  } catch (error: any) {

    if (
      transaction &&
      !(transaction as any).finished
    ) {
      await transaction.rollback();
    }

    console.error(
      "❌ ADMIN DELETE BOOKING ERROR:",
      error
    );

    return reply.code(500).send({
      message:
        "Failed to delete booking",

      error: error.message,
    });
  }
};


