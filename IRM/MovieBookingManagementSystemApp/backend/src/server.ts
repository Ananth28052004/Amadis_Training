import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import sequelize from "./config/database.js";

// =====================================
// MODELS
// =====================================

import User from "./models/User.js";
import Movie from "./models/Movie.js";
import Theater from "./models/Theater.js";
import Show from "./models/Show.js";
import Seat from "./models/Seat.js";
import Booking from "./models/Booking.js";

// =====================================
// MODEL RELATIONSHIPS
// =====================================

import "./models/associations.js";

// =====================================
// ROUTES
// =====================================

import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import theaterRoutes from "./routes/theaterRoutes.js";
import showRoutes from "./routes/showRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// =====================================
// FASTIFY APP
// =====================================

const app = Fastify({
  logger: true,
});

// =====================================
// CORS
// =====================================

app.register(cors, {
  origin: true,
});

// =====================================
// JWT
// =====================================

app.register(jwt, {
  secret:
    "movie-booking-secret-key-change-this-later",
});

// =====================================
// AUTH ROUTES
// =====================================

app.register(authRoutes, {
  prefix: "/api/auth",
});

// =====================================
// MOVIE ROUTES
// =====================================

app.register(movieRoutes, {
  prefix: "/api/movies",
});

// =====================================
// THEATER ROUTES
// =====================================

app.register(theaterRoutes, {
  prefix: "/api/theaters",
});

// =====================================
// SHOW ROUTES
// =====================================

app.register(showRoutes, {
  prefix: "/api/shows",
});

// =====================================
// SEAT ROUTES
// =====================================

app.register(seatRoutes, {
  prefix: "/api/seats",
});

// =====================================
// BOOKING ROUTES
// =====================================

app.register(bookingRoutes, {
  prefix: "/api/bookings",
});

// =====================================
// TEST ROUTE
// =====================================

app.get("/", async () => {
  return {
    message:
      "Movie Booking API is running",
  };
});

// =====================================
// START SERVER
// =====================================

const start = async () => {
  try {

    // =================================
    // CONNECT DATABASE
    // =================================

    await sequelize.authenticate();

    console.log(
      "✅ PostgreSQL connected successfully"
    );

    // =================================
    // CHECK MODELS
    // =================================

    console.log(
      "User table:",
      User.tableName
    );

    console.log(
      "Movie table:",
      Movie.tableName
    );

    console.log(
      "Theater table:",
      Theater.tableName
    );

    console.log(
      "Show table:",
      Show.tableName
    );

    console.log(
      "Seat table:",
      Seat.tableName
    );

    console.log(
      "Booking table:",
      Booking.tableName
    );

    // =================================
    // SYNCHRONIZE DATABASE
    // =================================

    await sequelize.sync();

    console.log(
      "✅ Database tables synchronized"
    );

    // =================================
    // START SERVER
    // =================================

    await app.listen({
      port: 5050,
      host: "0.0.0.0",
    });

    console.log(
      "🚀 Server running on http://localhost:5050"
    );

  } catch (error) {

    console.error(
      "❌ Server startup error:",
      error
    );

    process.exit(1);
  }
};

// =====================================
// START APPLICATION
// =====================================

start();
