import {FastifyReply,FastifyRequest,
} from "fastify";
import Seat from "../models/Seat.js";
import { ensureSeatsForShow } from "../services/seatService.js";

// CREATE SEATS FOR SHOW POST /api/seats/show/:showId
export const createSeatsForShow = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as { id?: number; role?: string };
    if (!user?.id) {
      return reply.code(401).send({
        message: "Unauthorized. Please login first.",
      });
    }
    if (user.role !== "admin") {
      return reply.code(403).send({
        message: "Access denied. Admin only.",
      });
    }
    const { showId } = request.params as { showId: string };
    const parsedShowId = Number(showId);
    if (!Number.isInteger(parsedShowId) || parsedShowId <= 0) {
      return reply.code(400).send({
        message: "Valid showId is required",
      });
    }
    const result = await ensureSeatsForShow(parsedShowId);
    return reply.code(result.createdCount > 0 ? 201 : 200).send({
      message: result.createdCount > 0
        ? "Seats created successfully"
        : "Seats are already ready for this show",
      showId: parsedShowId,
      theaterId: result.theater.id,
      totalSeats: result.seats.length,
      createdSeats: result.createdCount,
    });
  } catch (error: any) {
    console.error("❌ CREATE/ENSURE SEATS ERROR:", error);
    const message = String(error?.message ?? "");
    if (message === "SHOW_NOT_FOUND") {
      return reply.code(404).send({ message: "Show not found" });
    }
    if (message.startsWith("THEATER_NOT_FOUND_FOR_SHOW:")) {
      const [, currentShowId, theaterId] = message.split(":");
      return reply.code(409).send({
        message: `The theater linked to show ${currentShowId} could not be loaded. theaterId=${theaterId}. Open Admin → Shows and re-save this show after confirming the theater exists.`,
      });
    }
    if (message.startsWith("THEATER_TOTAL_SEATS_INVALID:")) {
      const [, currentShowId, theaterId, capacity] = message.split(":");
      return reply.code(409).send({
        message: `Theater ${theaterId} has totalSeats=${capacity}. Set a positive Total seats value in Admin → Theaters, then create the seats again for show ${currentShowId}.`,
      });
    }
    return reply.code(500).send({
      message: "Failed to create seats",
      error: message,
    });
  }
};

// GET SEATS FOR SHOW
// GET /api/seats/show/:showId
export const getSeatsByShow = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { showId } = request.params as { showId: string };
    const parsedShowId = Number(showId);
    if (!Number.isInteger(parsedShowId) || parsedShowId <= 0) {
      return reply.code(400).send({
        message: "Valid showId is required",
      });
    }
    const result = await ensureSeatsForShow(parsedShowId);
    const seats = result.seats;
    return reply.send({
      message: "Seats fetched successfully",
      showId: parsedShowId,
      totalSeats: seats.length,
      availableSeats: seats.filter((seat) => seat.status === "available").length,
      bookedSeats: seats.filter((seat) => seat.status === "booked").length,
      seats,
    });
  } catch (error: any) {
    console.error("❌ GET SEATS ERROR:", error);
    const message = String(error?.message ?? "");
    if (message === "SHOW_NOT_FOUND") {
      return reply.code(404).send({ message: "Show not found" });
    }

    if (message.startsWith("THEATER_NOT_FOUND_FOR_SHOW:")) {
      const [, currentShowId, theaterId] = message.split(":");
      return reply.code(409).send({
        message: `The theater linked to show ${currentShowId} is missing. theaterId=${theaterId}. Fix the show theater in Admin → Shows.`,
      });
    }

    if (message.startsWith("THEATER_TOTAL_SEATS_INVALID:")) {
      const [, currentShowId, theaterId, capacity] = message.split(":");
      return reply.code(409).send({
        message: `Theater ${theaterId} has totalSeats=${capacity}. Set a positive Total seats value in Admin → Theaters, then create the seats again for show ${currentShowId}.`,
      });
    }

    return reply.code(500).send({
      message: "Failed to fetch seats",
      error: message,
    });
  }
};

// GET SEAT AVAILABILITY GET /api/seats/show/:showId/availability
export const getSeatAvailability = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { showId } = request.params as { showId: string };
    const parsedShowId = Number(showId);

    if (!Number.isInteger(parsedShowId) || parsedShowId <= 0) {
      return reply.code(400).send({
        message: "Valid showId is required",
      });
    }

    const result = await ensureSeatsForShow(parsedShowId);
    const seats = result.seats;

    return reply.send({
      message: "Seat availability fetched successfully",
      showId: parsedShowId,
      summary: {
        totalSeats: seats.length,
        availableSeats: seats.filter((seat) => seat.status === "available").length,
        bookedSeats: seats.filter((seat) => seat.status === "booked").length,
      },
      seats,
    });
  } catch (error: any) {
    console.error("❌ GET SEAT AVAILABILITY ERROR:", error);

    const message = String(error?.message ?? "");

    if (message === "SHOW_NOT_FOUND") {
      return reply.code(404).send({ message: "Show not found" });
    }

    if (message.startsWith("THEATER_NOT_FOUND_FOR_SHOW:")) {
      const [, currentShowId, theaterId] = message.split(":");
      return reply.code(409).send({
        message: `The theater linked to show ${currentShowId} is missing. theaterId=${theaterId}. Fix the show theater in Admin → Shows.`,
      });
    }

    if (message.startsWith("THEATER_TOTAL_SEATS_INVALID:")) {
      const [, currentShowId, theaterId, capacity] = message.split(":");
      return reply.code(409).send({
        message: `Theater ${theaterId} has totalSeats=${capacity}. Set a positive Total seats value in Admin → Theaters, then create the seats again for show ${currentShowId}.`,
      });
    }

    return reply.code(500).send({
      message: "Failed to fetch seat availability",
      error: message,
    });
  }
};

// GET SINGLE SEAT GET /api/seats/:id
export const getSeatById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // GET SEAT ID
    const { id } = request.params as {
      id: string;
    };

    const seatId = Number(id);
    if (!Number.isInteger(seatId) || seatId <= 0) {
      return reply.code(400).send({
        message:"Valid seat id is required",
      });
    }

    // FIND SEAT
    const seat =await Seat.findByPk(seatId);
    if (!seat) {
      return reply.code(404).send({
        message:"Seat not found",
      });
    }

    // RESPONSE
    return reply.send({
      message:"Seat fetched successfully",
      seat,
    });

  } 
  catch (error: any) {
    console.error("❌ GET SEAT ERROR:",error);
    return reply.code(500).send({
      message:"Failed to fetch seat",
      error: error.message,
    });
  }
};

// UPDATE SEAT STATUS PATCH /api/seats/:id
export const updateSeat = async (
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
        message:"Access denied. Admin only.",
      });
    }

    // GET SEAT ID
    const { id } = request.params as {
      id: string;
    };
    const seatId = Number(id);
    if (!Number.isInteger(seatId) || seatId <= 0) {
      return reply.code(400).send({
        message:"Valid seat id is required",
      });
    }

    // GET BODY
    const { status } =
      request.body as {
        status: string;
      };

    // VALIDATE STATUS
    if (status !== "available" && status !== "booked") {
      return reply.code(400).send({
        message:"Status must be available or booked",
      });
    }

    // FIND SEAT
    const seat =await Seat.findByPk(seatId);
    if (!seat) {
      return reply.code(404).send({
        message:"Seat not found",
      });
    }

    // UPDATE SEAT
    await seat.update({status,});
    
    // RESPONSE
    return reply.send({
      message:"Seat updated successfully",
      seat,
    });

  } 
  catch (error: any) {console.error("❌ UPDATE SEAT ERROR:",error);
    return reply.code(500).send({
      message:"Failed to update seat",
      error: error.message,
    });
  }
};


// DELETE SEAT DELETE /api/seats/:id
export const deleteSeat = async (
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

    // GET SEAT ID
    const { id } = request.params as {
      id: string;
    };
    const seatId = Number(id);
    if (!Number.isInteger(seatId) ||seatId <= 0) {
      return reply.code(400).send({
        message:"Valid seat id is required",
      });
    }

    // FIND SEAT
    const seat =await Seat.findByPk(seatId);
    if (!seat) {
      return reply.code(404).send({
        message:"Seat not found",
      });
    }

    // DON'T DELETE BOOKED SEAT
    if (seat.status === "booked") {
      return reply.code(409).send({
        message:
          "Cannot delete a booked seat",
      });
    }

    // DELETE SEAT
    await seat.destroy();

    // RESPONSE
    return reply.send({
      message:"Seat deleted successfully",
      seatId,
    });
  } 
  catch (error: any) {
    console.error("❌ DELETE SEAT ERROR:",error);
    return reply.code(500).send({
      message:"Failed to delete seat",
      error: error.message,
    });
  }
};
