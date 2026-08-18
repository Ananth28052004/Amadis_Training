import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import authRoutes from "./routes/authRoutes";
import movieRoutes from "./routes/movieRoutes";
import showRoutes from "./routes/showRoutes";
import seatRoutes from "./routes/seatRoutes";
import bookingRoutes from "./routes/bookingRoutes";

const app = Fastify({
  logger: true,
});

const setupApp = async () => {
  // CORS
  await app.register(cors, {
    origin: "http://localhost:5173",
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
  });

  // JWT
  await app.register(jwt, {
    secret:
      process.env.JWT_SECRET ||
      "my_movie_secret_key",
  });

  // Routes
  await app.register(authRoutes, {
    prefix: "/api/auth",
  });

  await app.register(movieRoutes, {
    prefix: "/api/movies",
  });

  await app.register(showRoutes, {
    prefix: "/api/shows",
  });

  await app.register(seatRoutes, {
    prefix: "/api/seats",
  });

  await app.register(bookingRoutes, {
    prefix: "/api/bookings",
  });
};

setupApp();

export default app;