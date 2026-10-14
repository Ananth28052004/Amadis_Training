import {
  ArrowUpDown,
  Clock3,
  Film,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { api } from "../lib/api";
import type { Movie } from "../lib/api";

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours}h ${remaining.toString().padStart(2, "0")}m`;
};

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"rating" | "duration" | "title" | "latest">("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const response = await api.get("/movies");
        setMovies(response.data.movies ?? []);
      } catch (requestError: any) {
        setError(
          requestError?.response?.data?.message ?? "Unable to load movies."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadMovies();
  }, []);

  const genres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => {
      if (m.genre) {
        m.genre
          .split(/[\/,|]/)
          .map((g) => g.trim())
          .filter(Boolean)
          .forEach((g) => set.add(g));
      }
    });
    return ["All", ...Array.from(set)];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let list = movies.filter((movie) => {
      const matchesSearch = `${movie.title} ${movie.genre} ${movie.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesGenre =
        selectedGenre === "All" ||
        (movie.genre ?? "").toLowerCase().includes(selectedGenre.toLowerCase());

      return matchesSearch && matchesGenre;
    });

    if (sortBy === "rating") {
      list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortBy === "duration") {
      list = [...list].sort((a, b) => Number(b.duration) - Number(a.duration));
    } else if (sortBy === "title") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "latest") {
      list = [...list].sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
    }

    return list;
  }, [movies, search, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-white/[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.15),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3.5 py-1.5 text-xs font-semibold text-violet-300">
            <Sparkles size={14} /> Cinema Catalog
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Explore All Movies
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Discover blockbuster movies, timeless classics, and current showtimes.
          </p>

          {/* Search & Sort Toolbar */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-2xl">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search movies by title, genre, synopsis..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500 focus:bg-white/[0.08]"
              />
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort movies"
                className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-xs font-semibold text-slate-300 outline-none focus:border-violet-500"
              >
                <option value="latest">Sort: Latest Added</option>
                <option value="rating">Sort: Top Rated</option>
                <option value="duration">Sort: Duration</option>
                <option value="title">Sort: Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Genre Filter Chips */}
          {genres.length > 1 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Genres:
              </span>
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelectedGenre(genre)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                    selectedGenre === genre
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                      : "border border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading && (
          <div className="py-24 text-center text-slate-500">
            <Film size={36} className="mx-auto text-slate-600 animate-pulse" />
            <p className="mt-4">Loading movie library...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && filteredMovies.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center text-slate-500">
            <Film size={40} className="mx-auto text-slate-600" />
            <p className="mt-4 text-base font-semibold text-slate-300">
              No movies match your criteria
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try searching with another keyword or resetting the genre filter.
            </p>
            {(search || selectedGenre !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedGenre("All");
                }}
                className="mt-5 inline-flex rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((movie) => (
            <Link
              key={movie.id}
              to="/movies/$movieId"
              params={{ movieId: String(movie.id) }}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1.5 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-600/10"
            >
              <div className="relative h-80 overflow-hidden bg-slate-900">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md">
                  <Star size={13} fill="currentColor" />
                  {Number(movie.rating).toFixed(1)}
                </div>

                <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md">
                  {formatDuration(movie.duration)}
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-black text-white group-hover:text-violet-300 transition">
                  {movie.title}
                </h2>
                <p className="mt-2 text-xs font-medium text-violet-400">
                  {movie.genre}
                </p>
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-400">
                  {movie.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {movie.duration} mins
                  </span>
                  <span className="font-semibold text-violet-300 group-hover:underline">
                    View Showtimes →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Movies;
