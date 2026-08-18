import {
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

const bookings = [
  {
    id: "BK-1001",
    movie: "Midnight Echo",
    date: "August 20, 2026",
    time: "7:30 PM",
    cinema: "CineBook Cinemas",
    location: "Madurai",
    screen: "Screen 2",
    seats: ["A5", "A6"],
    amount: 360,
    status: "Confirmed",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "BK-1002",
    movie: "The Last Horizon",
    date: "August 22, 2026",
    time: "4:30 PM",
    cinema: "CineBook Cinemas",
    location: "Madurai",
    screen: "Screen 1",
    seats: ["C4"],
    amount: 220,
    status: "Confirmed",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
  },
];

const MyBookings = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <section className="border-b border-white/10 bg-white/[0.02]">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Your Tickets
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            My Bookings
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            View your upcoming movie tickets and booking details
            in one place.
          </p>

        </div>

      </section>

      {/* Bookings */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

        {bookings.length === 0 ? (

          /* Empty state */
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <Ticket size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold sm:text-2xl">
              No bookings yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              You haven't booked any movie tickets yet.
            </p>

            <Link
              to="/movies"
              className="mt-6 inline-flex rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold transition hover:bg-violet-500"
            >
              Browse Movies
            </Link>

          </div>

        ) : (

          <div className="space-y-6">

            {bookings.map((booking) => (

              <article
                key={booking.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-violet-500/30"
              >

                <div className="grid lg:grid-cols-[180px_1fr]">

                  {/* Movie image */}
                  <div className="relative h-64 lg:h-full">

                    <img
                      src={booking.image}
                      alt={booking.movie}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent lg:bg-gradient-to-r" />

                  </div>

                  {/* Booking details */}
                  <div className="p-6 sm:p-8">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row">

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                            {booking.status}
                          </span>

                          <span className="text-xs text-slate-600">
                            {booking.id}
                          </span>

                        </div>

                        <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                          {booking.movie}
                        </h2>

                      </div>

                      <div className="text-left sm:text-right">

                        <p className="text-xs text-slate-600">
                          Total
                        </p>

                        <p className="mt-1 text-2xl font-black text-violet-400">
                          ₹{booking.amount}
                        </p>

                      </div>

                    </div>

                    {/* Details */}
                    <div className="mt-7 grid gap-4 sm:grid-cols-2">

                      <div className="flex items-center gap-3">

                        <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
                          <CalendarDays size={18} />
                        </div>

                        <div>

                          <p className="text-xs text-slate-600">
                            Date
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {booking.date}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                          <Clock3 size={18} />
                        </div>

                        <div>

                          <p className="text-xs text-slate-600">
                            Showtime
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {booking.time}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                          <MapPin size={18} />
                        </div>

                        <div>

                          <p className="text-xs text-slate-600">
                            Cinema
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {booking.cinema}
                          </p>

                          <p className="text-xs text-slate-600">
                            {booking.location}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <div className="rounded-xl bg-fuchsia-500/10 p-2.5 text-fuchsia-400">
                          <Ticket size={18} />
                        </div>

                        <div>

                          <p className="text-xs text-slate-600">
                            Seats
                          </p>

                          <div className="mt-1 flex gap-2">

                            {booking.seats.map((seat) => (

                              <span
                                key={seat}
                                className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-bold text-violet-300"
                              >
                                {seat}
                              </span>

                            ))}

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* Bottom */}
                    <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">

                      <Link
                        to="/booking/$bookingId"
                        params={{
                          bookingId: booking.id,
                        }}
                        className="flex flex-1 items-center justify-center rounded-xl bg-violet-600 py-3 text-sm font-semibold transition hover:bg-violet-500"
                      >
                        View Ticket
                      </Link>

                      <Link
                        to="/movies"
                        className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold transition hover:bg-white/10"
                      >
                        Book Another Movie
                      </Link>

                    </div>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </main>

    </div>
  );
};

export default MyBookings;
