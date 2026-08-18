import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../services/api";

const Movies = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await api("/movies");

        setMovies(data.movies || data || []);
      } catch (error: any) {
        console.error(error);

        setError(
          error.message || "Failed to load movies"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const openMovie = (movieId: number) => {
    navigate({
      to: "/movies/$movieId",
      params: {
        movieId: String(movieId),
      },
    });
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading movies...
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

      <div className="mx-auto max-w-6xl">

        <h1 className="mb-8 text-3xl font-bold">
          Movies
        </h1>

        {movies.length === 0 ? (
          <p className="text-gray-500">
            No movies available.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {movies.map((movie) => (
              <div
                key={movie.id}
                className="overflow-hidden rounded-xl bg-white shadow"
              >

                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center bg-gray-200 text-gray-500">
                    No Poster
                  </div>
                )}

                <div className="p-5">

                  <h2 className="text-xl font-bold">
                    {movie.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-gray-600">
                    {movie.description}
                  </p>

                  <div className="mt-3 text-sm text-gray-500">
                    <p>
                      Language: {movie.language}
                    </p>

                    <p>
                      Duration: {movie.duration} minutes
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      openMovie(movie.id)
                    }
                    className="mt-5 w-full rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
                  >
                    View Details
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Movies;
