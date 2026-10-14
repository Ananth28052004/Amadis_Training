import {
  CalendarDays,
  Film,
  MapPin,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import { api, getStoredUser } from "../lib/api";

type Dashboard = {
  users?: { total: number };
  movies?: { total: number };
  theaters?: { total: number };
  shows?: { total: number };
  bookings?: { total: number; confirmed: number; cancelled: number };
  revenue?: { total: number };
  seats?: { total: number; booked: number; available: number };
};

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role !== "admin") {
      setError("Admin access is required to view this page.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const [mainResponse, bookingResponse] = await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/bookings/admin/dashboard"),
        ]);

        const main = mainResponse.data.dashboard ?? {};
        const booking = bookingResponse.data.dashboard ?? {};

        setDashboard({
          ...main,
          bookings: booking.bookings ?? main.bookings,
          revenue: booking.revenue ?? main.revenue,
          seats: booking.seats ?? main.seats,
        });
      } catch (requestError: any) {
        setError(
          requestError?.response?.data?.message ??
            "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const cards = [
    { label: "Registered Users", value: dashboard?.users?.total ?? 0, icon: Users, to: "/admin" },
    { label: "Total Movies", value: dashboard?.movies?.total ?? 0, icon: Film, to: "/admin/movies" },
    { label: "Theaters", value: dashboard?.theaters?.total ?? 0, icon: MapPin, to: "/admin/theaters" },
    { label: "Scheduled Shows", value: dashboard?.shows?.total ?? 0, icon: CalendarDays, to: "/admin/shows" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav current="dashboard" />

      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            System Overview
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Admin Dashboard</h1>
          <p className="mt-3 text-sm text-slate-400">
            Real-time analytics and database resource management for CineBook.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading dashboard stats...</div>
        ) : (
          <>
            {/* Core Entity Counts */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.label}
                    to={card.to}
                    className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-violet-500/30"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition">
                      <Icon size={23} />
                    </div>
                    <p className="mt-5 text-sm font-medium text-slate-400">{card.label}</p>
                    <p className="mt-1 text-3xl font-black">{card.value}</p>
                  </Link>
                );
              })}
            </div>

            {/* Performance Analytics Strip */}
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Confirmed Bookings
                  </span>
                  <Ticket size={22} className="text-violet-400" />
                </div>
                <p className="mt-4 text-3xl font-black">{dashboard?.bookings?.confirmed ?? 0}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-3">
                  <span>Total: {dashboard?.bookings?.total ?? 0}</span>
                  <span className="text-red-400">Cancelled: {dashboard?.bookings?.cancelled ?? 0}</span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Gross Revenue
                  </span>
                  <TrendingUp size={22} className="text-emerald-400" />
                </div>
                <p className="mt-4 text-3xl font-black text-emerald-400">
                  ₹{Number(dashboard?.revenue?.total ?? 0).toFixed(2)}
                </p>
                <p className="mt-3 text-xs text-slate-500 border-t border-white/5 pt-3">
                  Calculated directly from confirmed booking rows
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Seat Utilization
                  </span>
                  <Ticket size={22} className="text-blue-400" />
                </div>
                <p className="mt-4 text-3xl font-black text-blue-300">
                  {dashboard?.seats?.booked ?? 0}{" "}
                  <span className="text-lg font-normal text-slate-500">
                    / {dashboard?.seats?.total ?? 0}
                  </span>
                </p>
                <p className="mt-3 text-xs text-slate-500 border-t border-white/5 pt-3">
                  {dashboard?.seats?.available ?? 0} seats currently available
                </p>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="mt-8">
              <h2 className="text-lg font-bold">Manage Resources</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  to="/admin/movies"
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/30 hover:bg-white/[0.05]"
                >
                  <Film size={24} className="text-violet-400" />
                  <h3 className="mt-3 text-base font-bold">Movies</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Add, edit and manage movie catalog and posters.
                  </p>
                </Link>

                <Link
                  to="/admin/theaters"
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/30 hover:bg-white/[0.05]"
                >
                  <MapPin size={24} className="text-violet-400" />
                  <h3 className="mt-3 text-base font-bold">Theaters</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Configure venues, locations and seat capacities.
                  </p>
                </Link>

                <Link
                  to="/admin/shows"
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/30 hover:bg-white/[0.05]"
                >
                  <CalendarDays size={24} className="text-violet-400" />
                  <h3 className="mt-3 text-base font-bold">Shows</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Schedule movie showtimes and pricing.
                  </p>
                </Link>

                <Link
                  to="/admin/bookings"
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/30 hover:bg-white/[0.05]"
                >
                  <Ticket size={24} className="text-emerald-400" />
                  <h3 className="mt-3 text-base font-bold">Bookings</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Inspect reservations and handle customer cancellations.
                  </p>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
