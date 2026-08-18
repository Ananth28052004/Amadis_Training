import {
  ArrowLeft,
  Check,
  Clock3,
  MapPin,
  Ticket,
} from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";

const rows = ["A", "B", "C", "D", "E", "F"];

const seatsPerRow = 8;

const unavailableSeats = [
  "A3",
  "A4",
  "B5",
  "C2",
  "C3",
  "D7",
  "E1",
  "E2",
];

const seatPrice = 180;

const SeatSelection = () => {
  const { showId } = useParams({
    from: "/seats/$showId",
  });

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seatId: string) => {
    if (unavailableSeats.includes(seatId)) {
      return;
    }

    setSelectedSeats((currentSeats) => {
      if (currentSeats.includes(seatId)) {
        return currentSeats.filter(
          (seat) => seat !== seatId
        );
      }

      return [...currentSeats, seatId];
    });
  };

  const totalPrice = selectedSeats.length * seatPrice;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <section className="border-b border-white/10 bg-white/[0.02]">

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <Link
            to="/movies"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Movies
          </Link>

          <div className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Choose Your Seats
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Midnight Echo
              </h1>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">

                <span className="flex items-center gap-2">
                  <Clock3 size={15} />
                  7:30 PM
                </span>

                <span className="flex items-center gap-2">
                  <MapPin size={15} />
                  CineBook Cinemas
                </span>

                <span>
                  Screen 2
                </span>

              </div>

            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
              Show ID:{" "}
              <span className="font-semibold text-white">
                {showId}
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* Seat Area */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">

            {/* Screen */}
            <div className="mx-auto max-w-2xl">

              <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-lg shadow-violet-500/30" />

              <p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-slate-600">
                Screen
              </p>

            </div>

            {/* Seats */}
            <div className="mt-12 overflow-x-auto pb-3">

              <div className="mx-auto min-w-[500px] max-w-2xl">

                {rows.map((row) => (

                  <div
                    key={row}
                    className="mb-4 flex items-center justify-center gap-2 sm:gap-3"
                  >

                    {/* Row label */}
                    <span className="w-5 text-center text-xs font-bold text-slate-600">
                      {row}
                    </span>

                    {Array.from(
                      { length: seatsPerRow },
                      (_, index) => {

                        const seatNumber = index + 1;
                        const seatId = `${row}${seatNumber}`;

                        const isUnavailable =
                          unavailableSeats.includes(
                            seatId
                          );

                        const isSelected =
                          selectedSeats.includes(
                            seatId
                          );

                        return (
                          <button
                            key={seatId}
                            type="button"
                            disabled={isUnavailable}
                            onClick={() =>
                              toggleSeat(seatId)
                            }
                            className={[
                              "flex h-9 w-9 items-center justify-center rounded-lg text-[10px] font-bold transition sm:h-10 sm:w-10 sm:text-xs",
                              isUnavailable
                                ? "cursor-not-allowed bg-slate-800 text-slate-600"
                                : isSelected
                                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                                  : "bg-white/10 text-slate-400 hover:bg-violet-500/30 hover:text-white",
                            ].join(" ")}
                          >
                            {isSelected ? (
                              <Check size={15} />
                            ) : (
                              seatNumber
                            )}
                          </button>
                        );
                      }
                    )}

                  </div>

                ))}

              </div>

            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap justify-center gap-5 border-t border-white/10 pt-7">

              <div className="flex items-center gap-2 text-xs text-slate-500">

                <span className="h-4 w-4 rounded bg-white/10" />

                Available

              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">

                <span className="h-4 w-4 rounded bg-violet-600" />

                Selected

              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">

                <span className="h-4 w-4 rounded bg-slate-800" />

                Occupied

              </div>

            </div>

          </section>

          {/* Summary */}
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                <Ticket size={21} />
              </div>

              <div>

                <h2 className="font-bold">
                  Booking Summary
                </h2>

                <p className="text-xs text-slate-500">
                  Your selected seats
                </p>

              </div>

            </div>

            {/* Selected seats */}
            <div className="mt-7">

              <p className="text-xs uppercase tracking-wider text-slate-600">
                Seats
              </p>

              {selectedSeats.length === 0 ? (

                <p className="mt-3 rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-slate-600">
                  No seats selected
                </p>

              ) : (

                <div className="mt-3 flex flex-wrap gap-2">

                  {selectedSeats.map((seat) => (

                    <span
                      key={seat}
                      className="rounded-lg bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-300"
                    >
                      {seat}
                    </span>

                  ))}

                </div>

              )}

            </div>

            {/* Price */}
            <div className="mt-7 space-y-3 border-t border-white/10 pt-6">

              <div className="flex justify-between text-sm">

                <span className="text-slate-500">
                  Tickets
                </span>

                <span>
                  {selectedSeats.length}
                </span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-slate-500">
                  Price per seat
                </span>

                <span>
                  ₹{seatPrice}
                </span>

              </div>

              <div className="flex justify-between border-t border-white/10 pt-4">

                <span className="font-semibold">
                  Total
                </span>

                <span className="text-xl font-black text-violet-400">
                  ₹{totalPrice}
                </span>

              </div>

            </div>

            {/* Continue */}
            {selectedSeats.length > 0 ? (

              <Link
                to="/booking/$bookingId"
                params={{
                  bookingId: `${showId}-${selectedSeats.join("-")}`,
                }}
                className="mt-7 flex w-full items-center justify-center rounded-xl bg-violet-600 py-3.5 text-sm font-semibold transition hover:bg-violet-500"
              >
                Continue Booking
              </Link>

            ) : (

              <button
                type="button"
                disabled
                className="mt-7 w-full cursor-not-allowed rounded-xl bg-slate-800 py-3.5 text-sm font-semibold text-slate-600"
              >
                Select Seats First
              </button>

            )}

          </aside>

        </div>

      </main>

    </div>
  );
};

export default SeatSelection;
