import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  MapPin,
  Ticket,
} from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";

const BookingConfirmation = () => {
  const { bookingId } = useParams({
    from: "/booking/$bookingId",
  });

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">

      <div className="mx-auto max-w-3xl">

        {/* Success */}
        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={44} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Booking Confirmed
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            You're going to the movies! 🍿
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Your tickets have been successfully reserved.
            Keep this booking ID for your reference.
          </p>

        </div>

        {/* Ticket */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl">

          {/* Ticket header */}
          <div className="bg-gradient-to-r from-violet-700 to-indigo-700 p-6 sm:p-8">

            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="text-sm text-violet-200">
                  Movie Ticket
                </p>

                <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                  Midnight Echo
                </h2>
              </div>

              <div className="hidden rounded-xl bg-white/10 p-3 sm:block">
                <Ticket size={28} />
              </div>

            </div>

          </div>

          {/* Ticket body */}
          <div className="p-6 sm:p-8">

            {/* Booking ID */}
            <div className="rounded-2xl border border-white/10 bg-black/10 p-5">

              <p className="text-xs uppercase tracking-wider text-slate-500">
                Booking ID
              </p>

              <p className="mt-2 text-lg font-bold tracking-wider text-violet-300">
                BK-{bookingId}
              </p>

            </div>

            {/* Details */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                <CalendarDays
                  size={21}
                  className="text-violet-400"
                />

                <p className="mt-3 text-xs text-slate-500">
                  Date
                </p>

                <p className="mt-1 font-semibold">
                  August 20, 2026
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                <Clock3
                  size={21}
                  className="text-blue-400"
                />

                <p className="mt-3 text-xs text-slate-500">
                  Showtime
                </p>

                <p className="mt-1 font-semibold">
                  7:30 PM
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                <MapPin
                  size={21}
                  className="text-emerald-400"
                />

                <p className="mt-3 text-xs text-slate-500">
                  Cinema
                </p>

                <p className="mt-1 font-semibold">
                  CineBook Cinemas
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Madurai
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                <Ticket
                  size={21}
                  className="text-fuchsia-400"
                />

                <p className="mt-3 text-xs text-slate-500">
                  Seats
                </p>

                <div className="mt-2 flex gap-2">
                  <span className="rounded-lg bg-violet-500/10 px-3 py-1.5 text-sm font-semibold text-violet-300">
                    A5
                  </span>

                  <span className="rounded-lg bg-violet-500/10 px-3 py-1.5 text-sm font-semibold text-violet-300">
                    A6
                  </span>
                </div>

              </div>

            </div>

            {/* Price */}
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">

              <span className="text-slate-500">
                Total Amount
              </span>

              <span className="text-2xl font-black text-violet-400">
                ₹360
              </span>

            </div>

          </div>

          {/* Actions */}
          <div className="border-t border-white/10 bg-white/[0.02] p-6 sm:px-8">

            <div className="grid gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3.5 text-sm font-semibold transition hover:bg-white/10"
              >
                <Download size={18} />
                Download Ticket
              </button>

              <Link
                to="/my-bookings"
                className="flex items-center justify-center rounded-xl bg-violet-600 py-3.5 text-sm font-semibold transition hover:bg-violet-500"
              >
                View My Bookings
              </Link>

            </div>

            <Link
              to="/movies"
              className="mt-4 block text-center text-sm text-slate-500 transition hover:text-white"
            >
              Browse More Movies
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;
