import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { api } from "../services/api";

const MovieDetails = () => {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  const navigate = useNavigate();

  const [movie, setMovie] = useState<any>(null);
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const movieData = await api(`/movies/${movieId}`);

        setMovie(movieData.movie || movieData);

        const showData = await api(`/shows/movie/${movieId}`);

        setShows(showData.shows || []);
      } catch (error: any) {
        console.error(error);
        setError(error.message || "Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [movieId]);

  const bookShow = (showId: number) => {
    navigate({
      to: "/seats/$showId",
      params: {
        showId: String(showId),
      },
    });
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading movie...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <div className="rounded-xl bg-white p-6 shadow">

          <h1 className="text-3xl font-bold">
            {movie?.title}
          </h1>

          <p className="mt-2 text-gray-600">
            {movie?.description}
          </p>

          <p className="mt-3 text-sm text-gray-500">
            Language: {movie?.language}
          </p>

          <p className="text-sm text-gray-500">
            Duration: {movie?.duration} minutes
          </p>

        </div>

        <div className="mt-8">

          <h2 className="mb-4 text-2xl font-bold">
            Available Shows
          </h2>

          {shows.length === 0 ? (
            <p className="text-gray-500">
              No shows available.
            </p>
          ) : (
            <div className="grid gap-4">

              {shows.map((show) => (
                <div
                  key={show.id}
                  className="flex items-center justify-between rounded-xl bg-white p-5 shadow"
                >

                  <div>

                    <p className="font-semibold">
                      Date: {show.showDate}
                    </p>

                    <p className="text-gray-600">
                      Time: {show.showTime?.slice(0, 5)}
                    </p>

                    <p className="text-gray-600">
                      Price: ₹{show.price}
                    </p>

                  </div>

                  <button
                    onClick={() => bookShow(show.id)}
                    className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
                  >
                    Book Now
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default MovieDetails;
