
import Movie from "./Movie";
import Show from "./Show";
import Seat from "./Seat";
import User from "./User";
import Booking from "./Booking";


// Movie → Shows
Movie.hasMany(Show, {
  foreignKey: "movieId",
});

Show.belongsTo(Movie, {
  foreignKey: "movieId",
});


// Show → Seats
Show.hasMany(Seat, {
  foreignKey: "showId",
});

Seat.belongsTo(Show, {
  foreignKey: "showId",
});


// User → Bookings
User.hasMany(Booking, {
  foreignKey: "userId",
});

Booking.belongsTo(User, {
  foreignKey: "userId",
});


// Show → Bookings
Show.hasMany(Booking, {
  foreignKey: "showId",
});

Booking.belongsTo(Show, {
  foreignKey: "showId",
});


export {
  Movie,
  Show,
  Seat,
  User,
  Booking,
};
