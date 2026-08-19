import {
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  Ticket,
  XCircle,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, isLoggedIn } from "../lib/api";
import type { Booking } from "../lib/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState<number | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/bookings/my");
      setBookings(response.data.bookings ?? []);
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ?? "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      setError("Please sign in to view and manage your tickets.");
      setLoading(false);
      return;
    }
    void loadBookings();
  }, []);

  const cancel = async (bookingId: number) => {
    if (!window.confirm("Cancel this booking? Your seat will be released.")) return;

    try {
      setCancelling(bookingId);
      await api.delete(`/bookings/${bookingId}`);
      await loadBookings();
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ?? "Unable to cancel booking."
      );
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Your Cinema Experience
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">My Bookings</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            View all your active tickets, screening details, and manage cancellations.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
            <p>{error}</p>
            {!isLoggedIn() && (
              <div className="mt-4">
                <Link
                  to="/login"
                  className="inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-violet-500"
                >
                  Sign In Now
                </Link>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <Ticket size={36} className="mx-auto text-slate-600 animate-pulse" />
            <p className="mt-4">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 && !error ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <Ticket size={30} />
            </div>
            <h2 className="mt-5 text-xl font-bold sm:text-2xl">No bookings yet</h2>
            <p className="mt-2 text-sm text-slate-500">
              You haven't reserved any movie tickets yet.
            </p>
            <Link
              to="/movies"
              className="mt-6 inline-flex rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500 shadow-lg shadow-violet-600/30"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => {
              const showTime = booking.show?.showTime
                ? new Date(booking.show.showTime)
                : null;
              const isConfirmed = booking.status === "confirmed";

              return (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7 transition hover:border-violet-500/30"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                            isConfirmed
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-300 border border-red-500/20"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          Booking #{booking.id}
                        </span>
                      </div>
                      <h2 className="mt-3 text-2xl font-black">
                        {booking.show?.movie?.title ?? "Movie"}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-violet-300">
                        {booking.seat?.seatNumber
                          ? `Seat ${booking.seat.seatNumber}`
                          : "Seat details unavailable"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <Link
                        to="/booking/$bookingId"
                        params={{ bookingId: String(booking.id) }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                      >
                        <ExternalLink size={14} />
                        View Ticket
                      </Link>

                      {isConfirmed && (
                        <button
                          type="button"
                          disabled={cancelling === booking.id}
                          onClick={() => void cancel(booking.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          {cancelling === booking.id
                            ? "Cancelling..."
                            : "Cancel Ticket"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <CalendarDays size={16} className="text-violet-400" />
                      <p className="mt-2.5 text-xs text-slate-500">Screening Date</p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {showTime?.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }) ?? "Unavailable"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <Clock3 size={16} className="text-blue-400" />
                      <p className="mt-2.5 text-xs text-slate-500">Showtime</p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {showTime?.toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        }) ?? "Unavailable"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <MapPin size={16} className="text-violet-400" />
                      <p className="mt-2.5 text-xs text-slate-500">Theater Venue</p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {booking.show?.theater?.name ?? "Unavailable"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {booking.show?.theater?.location ?? ""}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5 text-sm">
                    <span className="text-slate-400">Paid Ticket Amount</span>
                    <span className="text-xl font-black text-violet-300">
                      ₹{Number(booking.show?.price ?? 0).toFixed(2)}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;
