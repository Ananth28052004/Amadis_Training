import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Play,
  Star,
  Ticket,
} from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";

const movies = [
  {
    id: "1",
    title: "Midnight Echo",
    genre: "Action • Thriller",
    rating: 8.7,
    duration: "2h 18m",
    language: "English",
    description:
      "A mysterious signal from the past pulls a former agent into a dangerous mission where every secret has a price.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "2",
    title: "The Last Horizon",
    genre: "Sci-Fi • Adventure",
    rating: 9.1,
    duration: "2h 32m",
    language: "English",
    description:
      "A group of explorers travels beyond the known galaxy searching for a new home for humanity.",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "3",
    title: "Silent Shadows",
    genre: "Mystery • Drama",
    rating: 8.4,
    duration: "2h 05m",
    language: "English",
    description:
      "A detective investigates a series of unexplained events that slowly reveal a much darker truth.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "4",
    title: "Neon City",
    genre: "Crime • Action",
    rating: 8.8,
    duration: "2h 21m",
    language: "English",
    description:
      "In a city ruled by criminals, one detective risks everything to expose a powerful underground network.",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "5",
    title: "Beyond the Stars",
    genre: "Sci-Fi • Drama",
    rating: 9.0,
    duration: "2h 40m",
    language: "English",
    description:
      "A scientist discovers something beyond the stars that changes humanity's understanding of the universe.",
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "6",
    title: "Lost Memories",
    genre: "Romance • Drama",
    rating: 8.2,
    duration: "1h 58m",
    language: "English",
    description:
      "Two people meet again after years apart and discover that some memories never really disappear.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85",
  },
];

const showtimes = [
  {
    id: "1",
    time: "10:30 AM",
    screen: "Screen 1",
    price: 180,
  },
  {
    id: "2",
    time: "1:30 PM",
    screen: "Screen 2",
    price: 200,
  },
  {
    id: "3",
    time: "4:30 PM",
    screen: "Screen 1",
    price: 220,
  },
  {
    id: "4",
    time: "7:30 PM",
    screen: "Screen 2",
    price: 250,
  },
  {
    id: "5",
    time: "10:30 PM",
    screen: "Screen 3",
    price: 220,
  },
];

const MovieDetails = () => {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  const movie =
    movies.find((item) => item.id === movieId) ?? movies[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0">
          <img
            src={movie.image}
            alt=""
            className="h-full w-full object-cover opacity-20 blur-sm"
          />

          <div className="absolute inset-0 bg-slate-950/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <Link
            to="/movies"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Movies
          </Link>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[300px_1fr]">

            {/* Poster */}
            <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/50">
              <img
                src={movie.image}
                alt={movie.title}
                className="aspect-[2/3] w-full object-cover"
              />
            </div>

            {/* Information */}
            <div className="max-w-3xl">

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
                  {movie.genre}
                </span>

                <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                  {movie.language}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-black sm:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-400">

                <span className="flex items-center gap-2">
                  <Star
                    size={17}
                    fill="currentColor"
                    className="text-yellow-400"
                  />
                  <strong className="text-white">
                    {movie.rating}
                  </strong>
                  / 10
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={17} />
                  {movie.duration}
                </span>

              </div>

              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400">
                {movie.description}
              </p>

              <button
                type="button"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/15"
              >
                <Play size={17} fill="currentColor" />
                Watch Trailer
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Showtimes */}
      <section className="border-t border-white/10">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                Book Tickets
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Choose a Showtime
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Select a showtime to continue to seat selection.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
              <CalendarDays
                size={17}
                className="text-violet-400"
              />
              August 20, 2026
            </div>

          </div>

          {/* Location */}
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

            <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
              <MapPin size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold">
                CineBook Cinemas
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Madurai
              </p>
            </div>

          </div>

          {/* Showtimes */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

            {showtimes.map((show) => (
              <Link
                key={show.id}
                to="/seats/$showId"
                params={{
                  showId: show.id,
                }}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-violet-500/[0.05]"
              >

                <div className="flex items-center justify-between">

                  <Clock3
                    size={19}
                    className="text-violet-400"
                  />

                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                    Available
                  </span>

                </div>

                <p className="mt-5 text-xl font-bold">
                  {show.time}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {show.screen}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">

                  <span className="text-xs text-slate-500">
                    From
                  </span>

                  <span className="font-bold text-violet-300">
                    ₹{show.price}
                  </span>

                </div>

                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold transition group-hover:bg-violet-500">
                  <Ticket size={16} />
                  Select Seats
                </div>

              </Link>
            ))}

          </div>

        </div>
      </section>

    </div>
  );
};

export default MovieDetails;
