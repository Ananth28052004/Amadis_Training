import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import adminRoutes from "./routes/adminRoutes.js";
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
const app = Fastify({logger: true,});

// CORS
const allowedOrigin = process.env.CORS_ORIGIN;
app.register(cors, {
  origin: allowedOrigin ? (allowedOrigin === "*" ? true : allowedOrigin.split(",")) : true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// JWT
app.register(jwt, {
  secret:
    process.env.JWT_SECRET ||
    "movie-booking-secret-key-change-this-later",
});

// AUTH ROUTES
app.register(authRoutes, {
  prefix: "/api/auth",
});

// MOVIE ROUTES
app.register(movieRoutes, {
  prefix: "/api/movies",
});

// THEATER ROUTES
app.register(theaterRoutes, {
  prefix: "/api/theaters",
});

// SHOW ROUTES
app.register(showRoutes, {
  prefix: "/api/shows",
});

app.register(adminRoutes, {
  prefix: "/api/admin",
});


// SEAT ROUTES
app.register(seatRoutes, {
  prefix: "/api/seats",
});

// BOOKING ROUTES
app.register(bookingRoutes, {
  prefix: "/api/bookings",
});

// TEST ROUTE
app.get("/api/health", async () => ({
  ok: true,
  service: "cinebook-backend",
  version: "2026-08-19-booking-seat-fix-v3",
}));

app.get("/", async () => {
  return {
    message:
      "Movie Booking API is running",
  };
});

// START SERVER
const start = async () => {
  try {
    // CONNECT DATABASE
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully");

    // CHECK MODELS
    console.log("User table:",User.tableName);
    console.log("Movie table:",Movie.tableName);
    console.log("Theater table:",Theater.tableName);
    console.log("Show table:",Show.tableName);
    console.log("Seat table:",Seat.tableName);
    console.log("Booking table:",Booking.tableName);

    // SYNCHRONIZE DATABASE
    await sequelize.sync({ alter: true });
    console.log("✅ Database tables synchronized");

    // START SERVER
    const PORT = Number(process.env.PORT) || 5050;
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`🚀 Server running on port ${PORT}`);

  } catch (error) {
    console.error("❌ Server startup error:",error);
    process.exit(1);
  }
};
// START APPLICATION
start();
