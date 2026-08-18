import { createFileRoute } from "@tanstack/react-router";
import AdminShows from "../../pages/AdminShows";

export const Route = createFileRoute("/admin/shows")({
  component: AdminShows,
});
