import {FastifyReply,FastifyRequest,} from "fastify";
import Theater from "../models/Theater.js";

// CREATE THEATER POST /api/theaters
export const createTheater = async (
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
        message:"Unauthorized. Please login first.",});
    }

    // ADMIN CHECK
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:"Access denied. Admin only.",
      });
    }

    // GET BODY
    const {name,location,totalSeats,
    } = request.body as {
      name: string;
      location: string;
      totalSeats: number;
    };

    
    // VALIDATION
    if (!name ||!location ||totalSeats === undefined) {
      return reply.code(400).send({
        message:"name, location and totalSeats are required",
      });
    }

    const parsedTotalSeats =Number(totalSeats);
    if (!Number.isInteger(parsedTotalSeats) || parsedTotalSeats <= 0) {
      return reply.code(400).send({
        message:"totalSeats must be a positive integer",
      });
    }

          // CREATE THEATER
    const theater =await Theater.create({
        name: name.trim(),
        location: location.trim(),
        totalSeats: parsedTotalSeats,
      });

    // RESPONSE
    return reply.code(201).send({
      message:"Theater created successfully",
      theater,
    });
  } 
  catch (error: any) {
    console.error("❌ CREATE THEATER ERROR:",error);
    return reply.code(500).send({
      message:"Failed to create theater",
      error: error.message,
    });
  }
};

// GET ALL THEATERS
export const getTheaters = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const theaters =await Theater.findAll({
        order: [["createdAt", "DESC"],],
      });
    return reply.send({
      message:"Theaters fetched successfully",
      totalTheaters:theaters.length,
      theaters,
    });

  } 
  catch (error: any) {
    console.error("GET THEATERS ERROR:",error);
    return reply.code(500).send({
      message:"Failed to fetch theaters",
      error: error.message,
    });
  }
};

// GET THEATER BY ID
export const getTheaterById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } =request.params as {
        id: string;
      };
    const theater =await Theater.findByPk(
        Number(id)
      );
    if (!theater) {
      return reply.code(404).send({
        message:"Theater not found",
      });
    }
    return reply.send({
      message:"Theater fetched successfully",
      theater,
    });

  } 
  catch (error: any) {
    console.error("GET THEATER ERROR:",error);
    return reply.code(500).send({
      message:"Failed to fetch theater",
      error: error.message,
    });
  }
};

// UPDATE THEATE PUT /api/theaters/:id
export const updateTheater = async (
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
        message:"Unauthorized. Please login first.",
      });
    }

    // ADMIN CHECK
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:"Access denied. Admin only.",
      });
    }

    // GET THEATER ID
    const { id } = request.params as {
      id: string;
    };
    const theaterId = Number(id);
    if (!Number.isInteger(theaterId) ||theaterId <= 0
    ) {
      return reply.code(400).send({
        message:"Valid theater id is required",
      });
    }

    // FIND THEATER
    const theater =await Theater.findByPk(theaterId);
    if (!theater) {
      return reply.code(404).send({
        message:
          "Theater not found",
      });
    }
    
    // GET BODY
    const {name,location,totalSeats,} = request.body as {
      name?: string;
      location?: string;
      totalSeats?: number;
    };

    // VALIDATE TOTAL SEATS
    if (totalSeats !== undefined) {
      const parsedTotalSeats =
        Number(totalSeats);
      if (!Number.isInteger(parsedTotalSeats) ||parsedTotalSeats <= 0) {
        return reply.code(400).send({
          message:"totalSeats must be a positive integer",
        });
      }
    }

    // UPDATE THEATER
    await theater.update({
      ...(name !== undefined && {
        name: name.trim(),
      }),

      ...(location !== undefined && {
        location: location.trim(),
      }),

      ...(totalSeats !== undefined && {
        totalSeats: Number(totalSeats),
      }),
    });

    // RESPONSE
    return reply.send({
      message:"Theater updated successfully",
      theater,
    });

  } 
  catch (error: any) {
    console.error("❌ UPDATE THEATER ERROR:",error);
    return reply.code(500).send({
      message:"Failed to update theater",
      error: error.message,
    });
  }
};


// DELETE THEATER
// DELETE /api/theaters/:id
export const deleteTheater = async (
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
        message:"Unauthorized. Please login first.",
      });
    }

    // ADMIN CHECK
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:"Access denied. Admin only.",
      });
    }

    // GET THEATER ID
    const { id } = request.params as {
      id: string;
    };
    const theaterId = Number(id);
    if (!Number.isInteger(theaterId) || theaterId <= 0
    ) {
      return reply.code(400).send({
        message:"Valid theater id is required",
      });
    }

    // FIND THEATER
    const theater =await Theater.findByPk(theaterId);
    if (!theater) {
      return reply.code(404).send({
        message:"Theater not found",
      });
    }

    // DELETE THEATER
    await theater.destroy();

    // RESPONSE
    return reply.send({
      message:"Theater deleted successfully",
      theaterId,
    });

  } 
  catch (error: any) {
    console.error("❌ DELETE THEATER ERROR:",error);
    return reply.code(500).send({
      message:"Failed to delete theater",
      error: error.message,
    });
  }
};
