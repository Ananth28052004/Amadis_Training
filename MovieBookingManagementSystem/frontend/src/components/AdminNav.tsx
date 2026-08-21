import { Link, useRouterState } from "@tanstack/react-router";
import {CalendarDays,Film,LayoutDashboard,MapPin,Ticket}from "lucide-react";
interface AdminNavProps {
  current?: "dashboard" | "movies" | "theaters" | "shows" | "bookings";
}

const AdminNav = ({ current }: AdminNavProps) => {
  const routerState = useRouterState();
  const path = routerState?.location?.pathname ?? "";

  const items = [
    {
      id: "dashboard",
      label: "Dashboard",
      to: "/admin",
      icon: LayoutDashboard,
      active: current ? current === "dashboard" : path === "/admin",
    },
    {
      id: "movies",
      label: "Movies",
      to: "/admin/movies",
      icon: Film,
      active: current ? current === "movies" : path.startsWith("/admin/movies"),
    },
    {
      id: "theaters",
      label: "Theaters",
      to: "/admin/theaters",
      icon: MapPin,
      active: current ? current === "theaters" : path.startsWith("/admin/theaters"),
    },
    {
      id: "shows",
      label: "Shows",
      to: "/admin/shows",
      icon: CalendarDays,
      active: current ? current === "shows" : path.startsWith("/admin/shows"),
    },
    {
      id: "bookings",
      label: "Bookings",
      to: "/admin/bookings",
      icon: Ticket,
      active: current ? current === "bookings" : path.startsWith("/admin/bookings"),
    },
  ];

  return (
    <nav aria-label="Admin Navigation" className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        <span className="mr-3 hidden items-center gap-1.5 rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-violet-300 md:inline-flex">
          Admin Portal
        </span>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.to}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                item.active
                  ? "bg-violet-600 font-semibold text-white shadow-lg shadow-violet-600/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminNav;
