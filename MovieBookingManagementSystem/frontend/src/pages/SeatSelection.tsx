import { ArrowLeft, Check, Clock3, MapPin, Ticket } from "lucide-react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { api, isLoggedIn } from "../lib/api";
import type { Seat, Show } from "../lib/api";

const SeatSelection = () => {
  const { showId } = useParams({ from: "/seats/$showId" });
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!isLoggedIn()) {
        setError("Please login before selecting seats.");
        setLoading(false);
        return;
      }

      try {
        const [showResponse, seatResponse] = await Promise.all([
          api.get(`/shows/${showId}`),
          api.get(`/seats/show/${showId}`),
        ]);
        setShow(showResponse.data.show ?? null);
        setSeats(seatResponse.data.seats ?? []);
      } catch (requestError: any) {
        setError(requestError?.response?.data?.message ?? "Unable to load this show.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [showId]);

  const rows = useMemo(() => {
    const groups = new Map<string, Seat[]>();
    seats.forEach((seat) => {
      const number = Number(seat.seatNumber);
      const row = Number.isFinite(number) ? String.fromCharCode(64 + Math.ceil(number / 10)) : seat.seatNumber.charAt(0);
      const current = groups.get(row) ?? [];
      current.push(seat);
      groups.set(row, current);
    });
    return Array.from(groups.entries());
  }, [seats]);

  const total = selectedSeats.reduce((sum) => sum + Number(show?.price ?? 0), 0);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "booked") return;
    setSelectedSeats((current) =>
      current.some((item) => item.id === seat.id)
        ? current.filter((item) => item.id !== seat.id)
        : [...current, seat]
    );
  };

  const bookSeats = async () => {
    if (selectedSeats.length === 0) return;
    setError("");

    try {
      setBooking(true);

      const response = await api.post("/bookings", {
        showId: Number(showId),
        seatIds: selectedSeats.map((seat) => seat.id),
      });

      const firstBookingId =
        response.data.bookings?.[0]?.id ??
        response.data.booking?.id;

      if (!firstBookingId) {
        throw new Error("Booking was created but no booking id was returned.");
      }

      navigate({
        to: "/booking/$bookingId",
        params: { bookingId: String(firstBookingId) },
      });
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ??
          requestError?.message ??
          "Booking failed. Please try again."
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-10 text-center text-slate-500">Loading seats...</div>;
  }

  if (error && !show) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-center text-white">
        <p className="text-red-300 font-medium">{error}</p>
        <div className="mt-6 flex justify-center gap-3">
          {!isLoggedIn() && (
            <Link
              to="/login"
              className="inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500 shadow-lg shadow-violet-600/30"
            >
              Sign In to Continue
            </Link>
          )}
          <Link
            to="/movies"
            className="inline-flex rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10"
          >
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link to="/movies" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={17} />Back to Movies</Link>
          <div className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Choose Your Seats</p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">{show?.movie?.title ?? "Movie"}</h1>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-2"><Clock3 size={15} />{show ? new Date(show.showTime).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : ""}</span>
                <span className="flex items-center gap-2"><MapPin size={15} />{show?.theater?.name ?? "Theater"}</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
              Show ID: <span className="font-semibold text-white">{showId}</span>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error && show && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
            <div className="mx-auto max-w-2xl">
              <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-lg shadow-violet-500/30" />
              <p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-slate-600">Screen</p>
            </div>

            {seats.length === 0 ? (
              <div className="mt-12 rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-500">
                No seats are available for this show. The backend could not build the seat map. Check Admin → Shows → Create Seats, then reload this page.
              </div>
            ) : (
              <div className="mt-12 space-y-4 overflow-x-auto pb-3">
                {rows.map(([row, rowSeats]) => (
                  <div key={row} className="flex min-w-max items-center justify-center gap-2">
                    <span className="w-5 text-center text-xs font-bold text-slate-600">{row}</span>
                    {rowSeats.map((seat) => {
                      const selected = selectedSeats.some((item) => item.id === seat.id);
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={seat.status === "booked"}
                          onClick={() => toggleSeat(seat)}
                          className={[
                            "flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold transition",
                            seat.status === "booked"
                              ? "cursor-not-allowed bg-slate-800 text-slate-600"
                              : selected
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                                : "bg-white/10 text-slate-400 hover:bg-violet-500/30 hover:text-white",
                          ].join(" ")}
                        >
                          {selected ? <Check size={15} /> : seat.seatNumber}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-5 border-t border-white/10 pt-7 text-xs text-slate-500">
              <span className="flex items-center gap-2"><span className="h-4 w-4 rounded bg-white/10" />Available</span>
              <span className="flex items-center gap-2"><span className="h-4 w-4 rounded bg-violet-600" />Selected</span>
              <span className="flex items-center gap-2"><span className="h-4 w-4 rounded bg-slate-800" />Booked</span>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400"><Ticket size={21} /></div>
              <div>
                <h2 className="font-bold">Booking Summary</h2>
                <p className="text-xs text-slate-500">Live seat selection</p>
              </div>
            </div>

            <div className="mt-7">
              <p className="text-xs uppercase tracking-wider text-slate-600">Seats</p>
              {selectedSeats.length === 0 ? (
                <p className="mt-3 rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-slate-600">No seats selected</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span key={seat.id} className="rounded-lg bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-300">{seat.seatNumber}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-7 space-y-3 border-t border-white/10 pt-6">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Tickets</span><span>{selectedSeats.length}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Price per seat</span><span>₹{Number(show?.price ?? 0).toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-white/10 pt-4"><span className="font-semibold">Total</span><span className="text-xl font-black text-violet-400">₹{total.toFixed(2)}</span></div>
            </div>

            <button
              type="button"
              disabled={selectedSeats.length === 0 || booking}
              onClick={() => void bookSeats()}
              className="mt-7 w-full rounded-xl bg-violet-600 py-3.5 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-600"
            >
              {booking ? "Booking..." : "Confirm Booking"}
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default SeatSelection;
