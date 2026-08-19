import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Printer,
  QrCode,
  Sparkles,
  Ticket,
  User,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Booking } from "../lib/api";

const BookingConfirmation = () => {
  const { bookingId } = useParams({ from: "/booking/$bookingId" });
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bookings/${bookingId}`);
        setBooking(response.data.booking ?? null);
      } catch (requestError: any) {
        setError(
          requestError?.response?.data?.message ?? "Unable to load booking."
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-16 text-center text-slate-500">
        <Ticket size={40} className="mx-auto text-slate-600 animate-pulse" />
        <p className="mt-4">Loading your digital ticket...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <XCircle size={32} />
        </div>
        <p className="mt-4 text-lg font-bold text-red-300">
          {error || "Booking not found."}
        </p>
        <Link
          to="/movies"
          className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
        >
          Browse Movies
        </Link>
      </div>
    );
  }

  const showTime = booking.show?.showTime
    ? new Date(booking.show.showTime)
    : null;
  const isConfirmed = booking.status === "confirmed";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Success Header */}
        <div className="text-center print:hidden">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
              isConfirmed
                ? "bg-emerald-500/10 text-emerald-400 shadow-xl shadow-emerald-500/10"
                : "bg-red-500/10 text-red-400 shadow-xl shadow-red-500/10"
            }`}
          >
            {isConfirmed ? <CheckCircle2 size={44} /> : <XCircle size={44} />}
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 px-3.5 py-1 text-xs font-semibold text-violet-300">
            <Sparkles size={13} /> Official E-Ticket
          </div>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            {isConfirmed ? "Booking Confirmed!" : "Booking Cancelled"}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            {isConfirmed
              ? "Your seat is reserved. Present this digital ticket at the cinema entrance."
              : "This ticket has been cancelled and the seat has been released."}
          </p>
        </div>

        {/* Digital Cinema Ticket Card */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
          {/* Ticket Header Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 p-6 sm:p-8">
            <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-violet-200">
              <span>CineBook Cinema Ticket</span>
              <span className="rounded-full bg-black/30 px-3 py-1 backdrop-blur">
                #{booking.id}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl text-white">
              {booking.show?.movie?.title ?? "Movie Ticket"}
            </h2>
            <p className="mt-1 text-xs text-violet-200">
              {booking.show?.movie?.genre ?? "Cinema Screening"}
            </p>
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Grid of Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <CalendarDays size={15} className="text-violet-400" />
                  Date
                </div>
                <p className="mt-2 text-base font-bold text-white">
                  {showTime?.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }) ?? "Unavailable"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <Clock3 size={15} className="text-blue-400" />
                  Showtime
                </div>
                <p className="mt-2 text-base font-bold text-white">
                  {showTime?.toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  }) ?? "Unavailable"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <MapPin size={15} className="text-violet-400" />
                  Theater / Venue
                </div>
                <p className="mt-2 text-base font-bold text-white">
                  {booking.show?.theater?.name ?? "Unavailable"}
                </p>
                <p className="text-xs text-slate-400">
                  {booking.show?.theater?.location ?? ""}
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <Ticket size={15} className="text-emerald-400" />
                  Seat & Price
                </div>
                <p className="mt-2 text-xl font-black text-violet-300">
                  Seat {booking.seat?.seatNumber ?? "N/A"}
                </p>
                <p className="text-xs text-slate-400">
                  Amount: ₹{Number(booking.show?.price ?? 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Customer & Security Tear */}
            <div className="flex items-center justify-between border-t border-dashed border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    {booking.user?.name ?? "Customer"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {booking.user?.email ?? ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <QrCode size={24} className="text-violet-400" />
                <span className="font-mono text-xs text-slate-400">
                  BK-{booking.id}
                </span>
              </div>
            </div>

            {/* Print & Navigation Actions */}
            <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-6 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-500"
              >
                <Printer size={16} /> Print Ticket
              </button>

              <Link
                to="/my-bookings"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <Ticket size={16} /> My Bookings
              </Link>

              <Link
                to="/movies"
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 hover:text-white"
              >
                Browse More Movies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
