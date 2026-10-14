import { ArrowLeft, CalendarDays, Clock3, MapPin, Star, Ticket } from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Movie, Show } from "../lib/api";

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours}h ${remaining.toString().padStart(2, "0")}m`;
};

const MovieDetails = () => {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [movieResponse, showResponse] = await Promise.all([
          api.get(`/movies/${movieId}`),
          api.get(`/shows/movie/${movieId}`),
        ]);
        setMovie(movieResponse.data.movie ?? null);
        setShows(showResponse.data.shows ?? []);
      } catch (requestError: any) {
        setError(requestError?.response?.data?.message ?? "Unable to load movie.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [movieId]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-10 text-center text-slate-500">Loading movie...</div>;
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-center text-white">
        <p className="text-red-300">{error || "Movie not found."}</p>
        <Link to="/movies" className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative">
        <img src={movie.image} alt="" className="absolute inset-0 h-[500px] w-full object-cover opacity-20" />
        <div className="absolute inset-0 h-[500px] bg-gradient-to-b from-slate-950/30 via-slate-950/80 to-slate-950" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <Link to="/movies" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={17} />Back to Movies</Link>

          <div className="mt-12 grid gap-10 lg:grid-cols-[280px_1fr]">
            <img src={movie.image} alt={movie.title} className="mx-auto h-[400px] w-full max-w-[280px] rounded-3xl border border-white/10 object-cover shadow-2xl" />

            <div className="self-end">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Movie Details</p>
              <h1 className="mt-3 text-4xl font-black sm:text-6xl">{movie.title}</h1>
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400">
                <span>{movie.genre}</span>
                <span className="flex items-center gap-1.5"><Star size={15} className="text-amber-300" fill="currentColor" />{Number(movie.rating).toFixed(1)}</span>
                <span className="flex items-center gap-1.5"><Clock3 size={15} />{formatDuration(movie.duration)}</span>
              </div>
              <p className="mt-6 max-w-3xl leading-7 text-slate-400">{movie.description}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Live from database</p>
            <h2 className="mt-2 text-3xl font-black">Showtimes</h2>
          </div>
        </div>

        {shows.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-slate-500">
            No showtimes have been created for this movie yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shows.map((show) => {
              const date = new Date(show.showTime);
              return (
                <div key={show.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-violet-300">
                        {date.toLocaleDateString(undefined, { dateStyle: "medium" })}
                      </p>
                      <p className="mt-1 text-2xl font-black">
                        {date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                    <Ticket size={24} className="text-violet-400" />
                  </div>
                  <div className="mt-5 space-y-2 text-sm text-slate-500">
                    <p className="flex items-center gap-2"><MapPin size={15} />{show.theater?.name ?? "Theater unavailable"}{show.theater?.location ? ` • ${show.theater.location}` : ""}</p>
                    <p className="flex items-center gap-2"><CalendarDays size={15} />Show ID {show.id}</p>
                    <p className="font-semibold text-white">₹{Number(show.price).toFixed(2)}</p>
                  </div>
                  <Link
                    to="/seats/$showId"
                    params={{ showId: String(show.id) }}
                    className="mt-5 flex w-full items-center justify-center rounded-xl bg-violet-600 py-3 text-sm font-semibold hover:bg-violet-500"
                  >
                    Select Seats
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default MovieDetails;
