import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Play,
  Search,
  Star,
} from "lucide-react";

const movies = [
  {
    id: 1,
    title: "Midnight Echo",
    genre: "Action • Thriller",
    rating: "8.7",
    duration: "2h 18m",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "The Last Horizon",
    genre: "Sci-Fi • Adventure",
    rating: "9.1",
    duration: "2h 32m",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Silent Shadows",
    genre: "Mystery • Drama",
    rating: "8.4",
    duration: "2h 05m",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.25),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(37,99,235,0.18),transparent_30%)]" />

        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* Hero text */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
              <Play size={15} fill="currentColor" />
              Your next movie night starts here
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Movies.
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                Memories.
              </span>
              <br />
              Book it.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Discover the latest movies, choose your favorite show,
              pick your seats and book your cinematic experience in
              just a few clicks.
            </p>

            {/* Search */}
            <div className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
              <Search
                size={21}
                className="ml-3 shrink-0 text-slate-500"
              />

              <input
                type="text"
                placeholder="Search movies..."
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />

              <button
                type="button"
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
              >
                Search
              </button>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/movies"
                className="group flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold transition hover:bg-violet-500"
              >
                Explore Movies
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-10 rounded-full bg-violet-600/10 blur-3xl" />

            <div className="relative mx-auto max-w-md rotate-2 overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-violet-950/40">
              <img
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=85"
                alt="Cinema"
                className="h-[560px] w-full object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-7 pt-32">
                <p className="text-sm font-medium text-violet-300">
                  NOW SHOWING
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Midnight Echo
                </h2>

                <div className="mt-3 flex items-center gap-4 text-sm text-slate-300">
                  <span className="flex items-center gap-1">
                    <Star
                      size={15}
                      fill="currentColor"
                      className="text-yellow-400"
                    />
                    8.7
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock3 size={15} />
                    2h 18m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">

          <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
              <CalendarDays size={22} />
            </div>

            <div>
              <h3 className="font-semibold">
                Easy Booking
              </h3>
              <p className="text-sm text-slate-500">
                Book your seats in seconds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <Play size={22} />
            </div>

            <div>
              <h3 className="font-semibold">
                Latest Movies
              </h3>
              <p className="text-sm text-slate-500">
                Discover what's playing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
              <Star size={22} />
            </div>

            <div>
              <h3 className="font-semibold">
                Great Experience
              </h3>
              <p className="text-sm text-slate-500">
                Simple and secure booking
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Popular movies */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Discover
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Popular Movies
            </h2>

            <p className="mt-2 text-slate-500">
              Movies everyone is talking about.
            </p>
          </div>

          <Link
            to="/movies"
            className="hidden items-center gap-2 text-sm font-semibold text-violet-400 transition hover:text-violet-300 sm:flex"
          >
            View all
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-2 hover:border-violet-500/30 hover:bg-white/[0.05]"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-black/70 px-3 py-1.5 text-sm backdrop-blur">
                  <Star
                    size={14}
                    fill="currentColor"
                    className="text-yellow-400"
                  />
                  {movie.rating}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-sm text-violet-300">
                    {movie.genre}
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    {movie.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                    <Clock3 size={14} />
                    {movie.duration}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <Link
                  to="/movies"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-semibold transition hover:bg-violet-600"
                >
                  View Movie
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/10 to-blue-600/20 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready for your next movie?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Find a movie, choose a showtime and reserve your
            favorite seats today.
          </p>

          <Link
            to="/movies"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 font-semibold transition hover:bg-violet-500"
          >
            Browse Movies
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
