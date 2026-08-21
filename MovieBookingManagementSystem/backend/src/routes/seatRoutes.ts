import {FastifyInstance,} from "fastify";
import {createSeatsForShow,getSeatsByShow,getSeatById,updateSeat,deleteSeat,
} from "../controllers/seatController.js";
import { authenticate, adminOnly } from "../middleware/authMiddleware.js";

// SEAT ROUTES
const seatRoutes = async (app: FastifyInstance) => {

  // GET SEAT AVAILABILITY
  // GET /api/seats/show/:showId
  app.get("/show/:showId",
    {
      preHandler: authenticate,
    },
    getSeatsByShow
  );
  // GET ALL SEATS FOR SHOW
  // GET /api/seats/show/:showId/all
  app.get("/show/:showId/all",
    {
      preHandler: authenticate,
    },
    getSeatsByShow
  );

  // CREATE SEATS FOR SHOW  POST /api/seats/show/:showId
  app.post("/show/:showId",
    {
      preHandler: adminOnly,
    },
    createSeatsForShow
  );

// GET SINGLE SEAT
// GET /api/seats/:id
app.get("/:id",
  {
    preHandler: authenticate,
  },
  getSeatById
);

// UPDATE SEAT PATCH /api/seats/:id
app.patch("/:id",
  {
    preHandler: adminOnly,
  },
  updateSeat
);

// DELETE SEAT DELETE /api/seats/:id
app.delete("/:id",
  {
    preHandler: adminOnly,
  },
  deleteSeat
);
};

export default seatRoutes;
