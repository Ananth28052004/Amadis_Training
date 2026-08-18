import { useEffect, useState } from "react";
import { api } from "../services/api";

const AdminShows = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [shows, setShows] = useState<any[]>([]);

  const [movieId, setMovieId] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [price, setPrice] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadMovies = async () => {
    try {
      const data = await api("/movies");

      setMovies(data.movies || data || []);
    } catch (error: any) {
      console.error(error);
      setError(
        error.message || "Failed to load movies"
      );
    }
  };

  const loadShows = async () => {
    try {
      const data = await api("/shows");

      setShows(data.shows || data || []);
    } catch (error: any) {
      console.error(error);
      setError(
        error.message || "Failed to load shows"
      );
    }
  };

  useEffect(() => {
    loadMovies();
    loadShows();
  }, []);

  const addShow = async () => {
    setError("");
    setMessage("");

    if (
      !movieId ||
      !showDate ||
      !showTime ||
      !price
    ) {
      setError("Please fill all fields");
      return;
    }

    try {
      await api("/shows", {
        method: "POST",
        body: JSON.stringify({
          movieId: Number(movieId),
          showDate,
          showTime,
          price: Number(price),
        }),
      });

      setMessage("Show created successfully");

      setMovieId("");
      setShowDate("");
      setShowTime("");
      setPrice("");

      await loadShows();
    } catch (error: any) {
      console.error(error);
      setError(
        error.message || "Failed to create show"
      );
    }
  };

  const deleteShow = async (showId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this show?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await api(`/shows/${showId}`, {
        method: "DELETE",
      });

      setShows((currentShows) =>
        currentShows.filter(
          (show) => show.id !== showId
        )
      );

      setMessage("Show deleted successfully");
    } catch (error: any) {
      console.error(error);
      setError(
        error.message || "Failed to delete show"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        <h1 className="mb-8 text-3xl font-bold">
          Admin Shows
        </h1>

        {error && (
          <p className="mb-4 text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p className="mb-4 text-green-600">
            {message}
          </p>
        )}

        {/* ADD SHOW */}

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-bold">
            Add Show
          </h2>

          <div className="space-y-4">

            <select
              value={movieId}
              onChange={(e) =>
                setMovieId(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            >
              <option value="">
                Select Movie
              </option>

              {movies.map((movie) => (
                <option
                  key={movie.id}
                  value={movie.id}
                >
                  {movie.title}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={showDate}
              onChange={(e) =>
                setShowDate(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

            <input
              type="time"
              value={showTime}
              onChange={(e) =>
                setShowTime(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              placeholder="Ticket price"
              className="w-full rounded-lg border p-3"
            />

            <button
              onClick={addShow}
              className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
            >
              Add Show
            </button>

          </div>
        </div>

        {/* EXISTING SHOWS */}

        <div className="mt-8">

          <h2 className="mb-5 text-2xl font-bold">
            Existing Shows
          </h2>

          {shows.length === 0 ? (
            <p className="text-gray-500">
              No shows available.
            </p>
          ) : (
            <div className="space-y-4">

              {shows.map((show) => {

                const movieTitle =
                  show.Movie?.title ||
                  movies.find(
                    (movie) =>
                      movie.id === show.movieId
                  )?.title ||
                  `Movie ID: ${show.movieId}`;

                return (
                  <div
                    key={show.id}
                    className="rounded-xl bg-white p-5 shadow"
                  >

                    <h3 className="text-xl font-bold">
                      {movieTitle}
                    </h3>

                    <p className="mt-2">
                      Date: {show.showDate}
                    </p>

                    <p>
                      Time:{" "}
                      {show.showTime?.slice(0, 5)}
                    </p>

                    <p>
                      Price: ₹{show.price}
                    </p>

                    <button
                      onClick={() =>
                        deleteShow(show.id)
                      }
                      className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Delete Show
                    </button>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminShows;
