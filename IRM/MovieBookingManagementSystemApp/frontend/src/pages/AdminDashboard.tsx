import {
  CalendarDays,
  Film,
  Ticket,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <section className="border-b border-white/10 bg-white/[0.02]">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                CineBook Admin
              </p>

              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                Dashboard
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your movies, shows, bookings and
                users from one place.
              </p>

            </div>

            <Link
              to="/admin/movies"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
            >
              <Plus size={18} />
              Add Movie
            </Link>

          </div>

        </div>

      </section>

      {/* Dashboard */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Movies */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                <Film size={23} />
              </div>

              <TrendingUp
                size={18}
                className="text-emerald-400"
              />

            </div>

            <p className="mt-6 text-sm text-slate-500">
              Total Movies
            </p>

            <p className="mt-1 text-3xl font-black">
              6
            </p>

            <p className="mt-2 text-xs text-emerald-400">
              +2 this month
            </p>

          </div>

          {/* Shows */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <CalendarDays size={23} />
              </div>

              <TrendingUp
                size={18}
                className="text-emerald-400"
              />

            </div>

            <p className="mt-6 text-sm text-slate-500">
              Active Shows
            </p>

            <p className="mt-1 text-3xl font-black">
              12
            </p>

            <p className="mt-2 text-xs text-emerald-400">
              +4 this week
            </p>

          </div>

          {/* Bookings */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Ticket size={23} />
              </div>

              <TrendingUp
                size={18}
                className="text-emerald-400"
              />

            </div>

            <p className="mt-6 text-sm text-slate-500">
              Total Bookings
            </p>

            <p className="mt-1 text-3xl font-black">
              248
            </p>

            <p className="mt-2 text-xs text-emerald-400">
              +18% this month
            </p>

          </div>

          {/* Users */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-400">
                <Users size={23} />
              </div>

              <TrendingUp
                size={18}
                className="text-emerald-400"
              />

            </div>

            <p className="mt-6 text-sm text-slate-500">
              Registered Users
            </p>

            <p className="mt-1 text-3xl font-black">
              154
            </p>

            <p className="mt-2 text-xs text-emerald-400">
              +12 this month
            </p>

          </div>

        </div>

        {/* Management cards */}
        <section className="mt-10">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
              Management
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Quick Actions
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Movies */}
            <Link
              to="/admin/movies"
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.05]"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                  <Film size={26} />
                </div>

                <ArrowRight
                  size={20}
                  className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-violet-400"
                />

              </div>

              <h3 className="mt-6 text-xl font-bold">
                Manage Movies
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add new movies, update movie information,
                change ratings and remove movies.
              </p>

              <div className="mt-5 text-sm font-semibold text-violet-400">
                Open Movies →
              </div>

            </Link>

            {/* Shows */}
            <Link
              to="/admin/shows"
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <CalendarDays size={26} />
                </div>

                <ArrowRight
                  size={20}
                  className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
                />

              </div>

              <h3 className="mt-6 text-xl font-bold">
                Manage Shows
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create showtimes, assign screens, set
                ticket prices and manage schedules.
              </p>

              <div className="mt-5 text-sm font-semibold text-blue-400">
                Open Shows →
              </div>

            </Link>

          </div>

        </section>

        {/* Recent activity */}
        <section className="mt-10">

          <div className="mb-5 flex items-end justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Activity
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Recent Bookings
              </h2>

            </div>

            <Link
              to="/my-bookings"
              className="text-sm font-semibold text-violet-400 hover:text-violet-300"
            >
              View all
            </Link>

          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

            {[
              {
                movie: "Midnight Echo",
                user: "Ananth",
                seats: "A5, A6",
                amount: 360,
              },
              {
                movie: "The Last Horizon",
                user: "Rahul",
                seats: "C4",
                amount: 220,
              },
              {
                movie: "Silent Shadows",
                user: "Priya",
                seats: "B2, B3",
                amount: 360,
              },
            ].map((booking) => (

              <div
                key={`${booking.movie}-${booking.user}`}
                className="flex flex-col gap-4 border-b border-white/10 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Ticket size={19} />
                  </div>

                  <div>

                    <p className="font-semibold">
                      {booking.movie}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {booking.user} • Seats {booking.seats}
                    </p>

                  </div>

                </div>

                <p className="font-bold text-violet-300">
                  ₹{booking.amount}
                </p>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
};

export default AdminDashboard;
