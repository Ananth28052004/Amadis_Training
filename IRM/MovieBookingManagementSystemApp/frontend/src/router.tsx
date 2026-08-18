import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import SeatSelection from "./pages/SeatSelection";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminMovies from "./pages/AdminMovies";
import AdminShows from "./pages/AdminShows";
import AdminDashboard from "./pages/AdminDashboard";

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

const moviesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/movies",
  component: Movies,
});

const movieDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/movies/$movieId",
  component: MovieDetails,
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

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-bookings",
  component: MyBookings,
});

const seatSelectionRoute = createRoute({
    getParentRoute: () => rootRoute, 
    path: "/seats/$showId", component: SeatSelection,
});

const bookingConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/booking/$bookingId",
  component: BookingConfirmation,
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

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  moviesRoute,
  movieDetailsRoute,
  loginRoute,
  registerRoute,
  myBookingsRoute,
  seatSelectionRoute,
  bookingConfirmationRoute,
  adminMoviesRoute,
  adminShowsRoute,
  adminDashboardRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
