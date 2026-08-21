import {FastifyInstance}from "fastify";
import {createShow,getShows,getShowById,getShowsByMovie,updateShow,deleteShow,
} from "../controllers/showController.js";
import { adminOnly } from "../middleware/authMiddleware.js";

// SHOW ROUTES
const showRoutes = async (
  app: FastifyInstance
) => {
  // CREATE SHOW POST /api/shows
  app.post("/",
    {
      preHandler: adminOnly,
    },
    createShow
  );
  // GET ALL SHOWS GET /api/shows
  app.get("/",getShows);
  
  // GET /api/shows/movie/:movieId
  app.get("/movie/:movieId",getShowsByMovie);

  // GET SHOW BY ID
  // GET /api/shows/:id

  app.get("/:id",getShowById);

  // UPDATE SHOW PUT /api/shows/:id
  app.put("/:id",
    {
      preHandler: adminOnly,
    },
    updateShow
  );

  
  // DELETE SHOW  DELETE /api/shows/:id
  app.delete("/:id", 
    {
      preHandler: adminOnly,
    },
    deleteShow
  );
};

export default showRoutes;
