import Fastify from "fastify";
import cors from "@fastify/cors";

import authRoutes from "./routes/authRoutes";
import movieRoutes from "./routes/movieRoutes";
import showRoutes from "./routes/showRoutes";

const app = Fastify({
  logger: true,
});

app.register(cors, {
  origin: true,
});

app.register(authRoutes, {
  prefix: "/api/auth",
});

app.register(movieRoutes, {
  prefix: "/api/movies",
});

app.register(showRoutes, {
  prefix: "/api/shows",
});

const start = async () => {
  try {
    await app.listen({
      port: 5050,
      host: "0.0.0.0",
    });

    console.log(
      "Server running on http://localhost:5050"
    );
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
