
import {
  Clock3,
  Search,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

const movies = [
  {
    id: 1,
    title: "Midnight Echo",
    genre: "Action • Thriller",
    rating: 8.7,
    duration: "2h 18m",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "The Last Horizon",
    genre: "Sci-Fi • Adventure",
    rating: 9.1,
    duration: "2h 32m",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Silent Shadows",
    genre: "Mystery • Drama",
    rating: 8.4,
    duration: "2h 05m",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Neon City",
    genre: "Crime • Action",
    rating: 8.8,
    duration: "2h 21m",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    title: "Beyond the Stars",
    genre: "Sci-Fi • Drama",
    rating: 9.0,
    duration: "2h 40m",
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    title: "Lost Memories",
    genre: "Romance • Drama",
    rating: 8.2,
    duration: "1h 58m",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
  },
];

const Movies = () => {
  const [search, setSearch] = useState("");

  const filteredMovies = movies.filter((movie) =>
    movie.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <section className="border-b border-white/10 bg-white/[0.02]">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400 sm:text-sm">
            Explore Cinema
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            All Movies
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Discover the latest movies, explore showtimes,
            choose your favorite seats and book your perfect
            cinema experience.
          </p>

          {/* Search */}
          <div className="mt-8 flex w-full max-w-2xl items-center rounded-2xl border border-white/10 bg-white/[0.05] p-2 transition focus-within:border-violet-500/50">

            <Search
              size={20}
              className="ml-3 shrink-0 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search movies..."
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 sm:text-base"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mr-2 rounded-lg px-3 py-2 text-xs text-slate-500 transition hover:bg-white/10 hover:text-white"
              >
                Clear
              </button>
            )}

          </div>

          {/* Result count */}
          <p className="mt-4 text-xs text-slate-600">
            {filteredMovies.length} movie
            {filteredMovies.length !== 1 ? "s" : ""} found
          </p>

        </div>
      </section>

      {/* Movies */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

        {filteredMovies.length === 0 ? (

          /* Empty state */
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <Search size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold sm:text-2xl">
              No movies found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try searching with another movie name.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
            >
              Show All Movies
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredMovies.map((movie) => (

              <article
                key={movie.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-2 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-950/20"
              >

                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">

                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                  {/* Rating */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm font-semibold backdrop-blur-md">

                    <Star
                      size={14}
                      fill="currentColor"
                      className="text-yellow-400"
                    />

                    {movie.rating}

                  </div>

                  {/* Movie info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">

                    <p className="text-xs font-semibold text-violet-300">
                      {movie.genre}
                    </p>

                    <h2 className="mt-1 text-xl font-bold leading-tight">
                      {movie.title}
                    </h2>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">

                      <Clock3 size={14} />

                      {movie.duration}

                    </div>

                  </div>

                </div>

                {/* Button */}
                <div className="p-4">

                  <Link
                    to="/movies/$movieId"
                    params={{
                      movieId: String(movie.id),
                    }}
                    className="block w-full rounded-xl bg-violet-600 py-3 text-center text-sm font-semibold transition hover:bg-violet-500"
                  >
                    View Details
                  </Link>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>
  );
};

export default Movies;
