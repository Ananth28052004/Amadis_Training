import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, Play, Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Movie } from "../lib/api";

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/movies");
        setMovies(response.data.movies ?? []);
      } catch {
        setMovies([]);
      }
    };
    void load();
  }, []);

  const shownMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.25),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(37,99,235,0.18),transparent_30%)]" />
        <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
              <Play size={15} fill="currentColor" /> Your next movie night starts here
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Movies.<br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">Memories.</span><br />
              Book it.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Browse real movies and showtimes stored in your existing database, select available seats and book them.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
              }}
              className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2"
            >
              <Search size={21} className="ml-3 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search movies..."
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none"
              />
              <Link to="/movies" className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500">
                Search
              </Link>
            </form>

            <div className="mt-8">
              <Link to="/movies" className="group inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold hover:bg-violet-500">
                Explore Movies <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {shownMovies[0] ? (
            <div className="relative hidden lg:block">
              <img src={shownMovies[0].image} alt={shownMovies[0].title} className="h-[470px] w-full rounded-3xl border border-white/10 object-cover shadow-2xl" />
              <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur">
                <p className="text-sm text-violet-300">From your database</p>
                <h2 className="mt-1 text-2xl font-black">{shownMovies[0].title}</h2>
                <div className="mt-2 flex items-center gap-4 text-sm text-slate-300">
                  <span className="flex items-center gap-1"><Star size={14} fill="currentColor" />{Number(shownMovies[0].rating).toFixed(1)}</span>
                  <span className="flex items-center gap-1"><Clock3 size={14} />{shownMovies[0].duration} min</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-slate-500 lg:block">
              Add movies in the admin panel to see them here.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Now in your database</p>
            <h2 className="mt-2 text-3xl font-black">Movies</h2>
          </div>
          <Link to="/movies" className="text-sm font-semibold text-violet-300 hover:text-violet-200">View all</Link>
        </div>

        {movies.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-slate-500">No movies found.</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {movies.slice(0, 6).map((movie) => (
              <Link key={movie.id} to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-violet-500/30">
                <img src={movie.image} alt={movie.title} className="h-64 w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-bold">{movie.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{movie.genre}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
