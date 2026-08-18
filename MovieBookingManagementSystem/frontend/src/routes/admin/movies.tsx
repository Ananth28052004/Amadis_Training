import { createFileRoute } from "@tanstack/react-router";
import AdminMovies from "../../pages/AdminMovies";

export const Route = createFileRoute("/admin/movies")({
  component: AdminMovies,
});
