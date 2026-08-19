import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  Ticket,
  Trash2,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminNav from "../components/AdminNav";
import { api, getStoredUser } from "../lib/api";
import type { Booking } from "../lib/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "cancelled">("all");
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/bookings/all");
      setBookings(response.data.bookings ?? []);
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ??
          "Unable to load bookings from database."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role !== "admin") {
      setError("Admin access is required to view this page.");
      setLoading(false);
      return;
    }
    void loadBookings();
  }, []);

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    const revenue = bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + Number(b.show?.price ?? 0), 0);

    return { total, confirmed, cancelled, revenue };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      // Status filter
      if (statusFilter !== "all" && booking.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (!query) return true;

      const userName = (booking.user?.name ?? "").toLowerCase();
      const userEmail = (booking.user?.email ?? "").toLowerCase();
      const movieTitle = (booking.show?.movie?.title ?? "").toLowerCase();
      const theaterName = (booking.show?.theater?.name ?? "").toLowerCase();
      const seatNumber = (booking.seat?.seatNumber ?? "").toLowerCase();
      const bookingId = String(booking.id);

      return (
        userName.includes(query) ||
        userEmail.includes(query) ||
        movieTitle.includes(query) ||
        theaterName.includes(query) ||
        seatNumber.includes(query) ||
        bookingId.includes(query)
      );
    });
  }, [bookings, search, statusFilter]);

  const handleAdminCancel = async (bookingId: number) => {
    if (!window.confirm(`Cancel booking #${bookingId}? This will release the seat back to available.`)) {
      return;
    }

    try {
      setActionLoading(bookingId);
      await api.patch(`/bookings/admin/${bookingId}/cancel`);
      await loadBookings();
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ??
          "Failed to cancel booking."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleAdminDelete = async (bookingId: number) => {
    if (
      !window.confirm(
        `Permanently delete booking #${bookingId}? This will remove the booking record and release the seat.`
      )
    ) {
      return;
    }

    try {
      setActionLoading(bookingId);
      await api.delete(`/bookings/admin/${bookingId}`);
      await loadBookings();
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ??
          "Failed to delete booking."
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav current="bookings" />

      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Admin Operations
              </p>
              <h1 className="mt-3 text-4xl font-black">Manage Bookings</h1>
              <p className="mt-3 text-sm text-slate-400">
                Inspect customer reservations, monitor ticket statuses, and manage cancellations.
              </p>
            </div>
            <button
              onClick={() => void loadBookings()}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Bookings
              </span>
              <Ticket size={20} className="text-violet-400" />
            </div>
            <p className="mt-3 text-3xl font-black">{stats.total}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Confirmed
              </span>
              <CheckCircle2 size={20} className="text-emerald-400" />
            </div>
            <p className="mt-3 text-3xl font-black text-emerald-300">
              {stats.confirmed}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Cancelled
              </span>
              <XCircle size={20} className="text-red-400" />
            </div>
            <p className="mt-3 text-3xl font-black text-red-300">
              {stats.cancelled}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Revenue
              </span>
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
            <p className="mt-3 text-3xl font-black text-emerald-400">
              ₹{stats.revenue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, movie, theater, seat, ID..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-500" />
            <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1 text-xs">
              {(["all", "confirmed", "cancelled"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3 py-1.5 font-semibold capitalize transition ${
                    statusFilter === status
                      ? "bg-violet-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="mt-12 text-center text-slate-500">
            Loading bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-16 text-center text-slate-500">
            <Ticket size={36} className="mx-auto text-slate-600" />
            <p className="mt-4 font-semibold">No bookings found</p>
            <p className="mt-1 text-sm text-slate-600">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or status filter."
                : "No customer bookings have been made yet."}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredBookings.map((booking) => {
              const showTime = booking.show?.showTime
                ? new Date(booking.show.showTime)
                : null;
              const isProcessing = actionLoading === booking.id;

              return (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/20"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-red-500/10 text-red-300"
                          }`}
                        >
                          {booking.status === "confirmed" ? (
                            <CheckCircle2 size={13} />
                          ) : (
                            <XCircle size={13} />
                          )}
                          {booking.status}
                        </span>

                        <span className="text-xs font-mono text-slate-500">
                          ID: #{booking.id}
                        </span>

                        <span className="text-xs text-slate-500">
                          Booked:{" "}
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "N/A"}
                        </span>
                      </div>

                      <h2 className="mt-3 text-xl font-bold">
                        {booking.show?.movie?.title ?? `Movie #${booking.show?.movieId}`}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      {booking.status === "confirmed" && (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => void handleAdminCancel(booking.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          {isProcessing ? "Processing..." : "Cancel Booking"}
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => void handleAdminDelete(booking.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/5 pt-4 text-xs">
                    <div className="flex items-start gap-2 text-slate-400">
                      <User size={15} className="mt-0.5 shrink-0 text-violet-400" />
                      <div>
                        <p className="font-semibold text-white">
                          {booking.user?.name ?? "Unknown Customer"}
                        </p>
                        <p className="text-slate-500">
                          {booking.user?.email ?? "No email"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-slate-400">
                      <MapPin size={15} className="mt-0.5 shrink-0 text-violet-400" />
                      <div>
                        <p className="font-semibold text-white">
                          {booking.show?.theater?.name ?? "Unknown Theater"}
                        </p>
                        <p className="text-slate-500">
                          {booking.show?.theater?.location ?? ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-slate-400">
                      <CalendarDays size={15} className="mt-0.5 shrink-0 text-violet-400" />
                      <div>
                        <p className="font-semibold text-white">
                          {showTime
                            ? showTime.toLocaleDateString(undefined, {
                                dateStyle: "medium",
                              })
                            : "N/A"}
                        </p>
                        <p className="flex items-center gap-1 text-slate-500">
                          <Clock3 size={12} />
                          {showTime
                            ? showTime.toLocaleTimeString(undefined, {
                                hour: "numeric",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-slate-400">
                      <Ticket size={15} className="mt-0.5 shrink-0 text-violet-400" />
                      <div>
                        <p className="font-semibold text-violet-300">
                          Seat: {booking.seat?.seatNumber ?? "N/A"}
                        </p>
                        <p className="font-bold text-white">
                          ₹{Number(booking.show?.price ?? 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
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

export default AdminBookings;
