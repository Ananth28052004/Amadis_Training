import {FastifyInstance,}from "fastify";
import {createMovie,getMovies,updateMovie,deleteMovie,getMovieById,} from "../controllers/movieController.js";
import {adminOnly,} from "../middleware/authMiddleware.js";

const movieRoutes = async (
  app: FastifyInstance
) => {
  // GET /api/movies
  app.get("/",getMovies);

  // GET /api/movies/:id
  app.get("/:id",getMovieById);

  // ADMIN ONLY POST /api/movies
  app.post("/",
    {
      preHandler: adminOnly,
    },
    createMovie
  );

  // ADMIN ONLY
  // PUT /api/movies/:id
  app.put("/:id",
    {
      preHandler: adminOnly,
    },
    updateMovie
  );

  // ADMIN ONLY
  // DELETE /api/movies/:id
  app.delete("/:id",
    {
      preHandler: adminOnly,
    },
    deleteMovie
  );
};

export default movieRoutes;
