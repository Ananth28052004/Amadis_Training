import {FastifyInstance} from "fastify";
import {createTheater,getTheaters,getTheaterById,updateTheater,deleteTheater,
} from "../controllers/theaterController.js";
import { adminOnly } from "../middleware/authMiddleware.js";

const theaterRoutes = async (
  app: FastifyInstance
) => {

  // CREATE THEATER
  app.post("/",
    {
      preHandler: adminOnly,
    },
    createTheater
  );

  // GET ALL THEATERS
  app.get("/",getTheaters);

  // GET THEATER BY ID
  app.get("/:id",getTheaterById);

// UPDATE THEATER
// PUT /api/theaters/:id
app.put("/:id",
  {
    preHandler: adminOnly,
  },
  updateTheater
);

// DELETE THEATER
// DELETE /api/theaters/:id
app.delete("/:id",
  {
    preHandler: adminOnly,
  },
  deleteTheater
);
};

export default theaterRoutes;
