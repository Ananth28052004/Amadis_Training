import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import AdminShows from "../pages/AdminShows";
import Navbar from "../components/Navbar";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MovieDetails from "../pages/MovieDetails";
import SeatSelection from "../pages/SeatSelection";
import BookingConfirmation from "../pages/BookingConfirmation";
import MyBookings from "../pages/MyBookings";
import AdminMovies from "../pages/AdminMovies";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

const movieDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/movies/$movieId",
  component: MovieDetails,
});

const seatSelectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seats/$showId",
  component: SeatSelection,
});

const bookingConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/booking/$bookingId",
  component: BookingConfirmation,
});

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-bookings",
  component: MyBookings,
});

const adminMoviesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/movies",
  component: AdminMovies,
});
const adminShowsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/shows",
  component: AdminShows,
});
const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  movieDetailsRoute,
  seatSelectionRoute,
  bookingConfirmationRoute,
  myBookingsRoute,
  adminMoviesRoute,
  adminShowsRoute,
]);

export const router = createRouter({
  routeTree,
});