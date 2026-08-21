import User from "./User.js";
import Movie from "./Movie.js";
import Theater from "./Theater.js";
import Show from "./Show.js";
import Seat from "./Seat.js";
import Booking from "./Booking.js";

// MOVIE ↔ SHOW
Movie.hasMany(Show, {
  foreignKey: "movieId",
  as: "shows",
});
Show.belongsTo(Movie, {
  foreignKey: "movieId",
  as: "movie",
});

// THEATER ↔ SHOW
Theater.hasMany(Show, {
  foreignKey: "theaterId",
  as: "shows",
});
Show.belongsTo(Theater, {
  foreignKey: "theaterId",
  as: "theater",
});

// SHOW ↔ SEAT
Show.hasMany(Seat, {
  foreignKey: "showId",
  as: "seats",
});
Seat.belongsTo(Show, {
  foreignKey: "showId",
  as: "show",
});

// USER ↔ BOOKING
User.hasMany(Booking, {
  foreignKey: "userId",
  as: "bookings",
});
Booking.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// SHOW ↔ BOOKING
Show.hasMany(Booking, {
  foreignKey: "showId",
  as: "bookings",
});
Booking.belongsTo(Show, {
  foreignKey: "showId",
  as: "show",
});

// SEAT ↔ BOOKING
Seat.hasMany(Booking, {
  foreignKey: "seatId",
  as: "bookings",
});
Booking.belongsTo(Seat, {
  foreignKey: "seatId",
  as: "seat",
});