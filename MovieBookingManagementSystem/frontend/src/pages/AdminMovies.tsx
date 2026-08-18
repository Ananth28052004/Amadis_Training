
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../services/api";

const AdminMovies = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [language, setLanguage] = useState("");
  const [posterUrl, setPosterUrl] = useState("");

  const [editingMovieId, setEditingMovieId] =
    useState<number | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] =
    useState("");
  const [editDuration, setEditDuration] =
    useState("");
  const [editLanguage, setEditLanguage] =
    useState("");
  const [editPosterUrl, setEditPosterUrl] =
    useState("");

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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate({
        to: "/login",
      });

      return;
    }

    loadMovies();
  }, [navigate]);

  const addMovie = async () => {
    setError("");
    setMessage("");

    if (
      !title ||
      !description ||
      !duration ||
      !language
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await api("/movies", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          duration: Number(duration),
          language,
          posterUrl,
        }),
      });

      setMessage("Movie added successfully");

      setTitle("");
      setDescription("");
      setDuration("");
      setLanguage("");
      setPosterUrl("");

      await loadMovies();
    } catch (error: any) {
      console.error(error);

      setError(
        error.message || "Failed to add movie"
      );
    }
  };

  const startEdit = (movie: any) => {
    setEditingMovieId(movie.id);

    setEditTitle(movie.title || "");
    setEditDescription(movie.description || "");
    setEditDuration(
      String(movie.duration || "")
    );
    setEditLanguage(movie.language || "");
    setEditPosterUrl(movie.posterUrl || "");

    setError("");
    setMessage("");
  };

  const updateMovie = async () => {
    if (editingMovieId === null) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await api(`/movies/${editingMovieId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          duration: Number(editDuration),
          language: editLanguage,
          posterUrl: editPosterUrl,
        }),
      });

      setMessage("Movie updated successfully");

      setEditingMovieId(null);

      await loadMovies();
    } catch (error: any) {
      console.error(error);

      setError(
        error.message || "Failed to update movie"
      );
    }
  };

  const deleteMovie = async (movieId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this movie?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await api(`/movies/${movieId}`, {
        method: "DELETE",
      });

      setMovies((currentMovies) =>
        currentMovies.filter(
          (movie) => movie.id !== movieId
        )
      );

      setMessage("Movie deleted successfully");
    } catch (error: any) {
      console.error(error);

      setError(
        error.message || "Failed to delete movie"
      );
    }
  };

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-3xl font-bold">
          Admin Movies
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

        {/* ADD MOVIE */}

        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-bold">
            Add Movie
          </h2>

          <div className="space-y-4">

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Movie title"
              className="w-full rounded-lg border p-3"
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Movie description"
              className="w-full rounded-lg border p-3"
            />

            <input
              type="number"
              value={duration}
              onChange={(e) =>
                setDuration(e.target.value)
              }
              placeholder="Duration in minutes"
              className="w-full rounded-lg border p-3"
            />

            <input
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              placeholder="Language"
              className="w-full rounded-lg border p-3"
            />

            <input
              value={posterUrl}
              onChange={(e) =>
                setPosterUrl(e.target.value)
              }
              placeholder="Poster URL"
              className="w-full rounded-lg border p-3"
            />

            <button
              onClick={addMovie}
              className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
            >
              Add Movie
            </button>

          </div>
        </div>

        {/* SEARCH */}

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search movie..."
          className="mb-6 w-full rounded-lg border p-3"
        />

        {/* EDIT */}

        {editingMovieId !== null && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-bold">
              Edit Movie
            </h2>

            <div className="space-y-4">

              <input
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(e.target.value)
                }
                placeholder="Movie title"
                className="w-full rounded-lg border p-3"
              />

              <textarea
                value={editDescription}
                onChange={(e) =>
                  setEditDescription(
                    e.target.value
                  )
                }
                placeholder="Description"
                className="w-full rounded-lg border p-3"
              />

              <input
                type="number"
                value={editDuration}
                onChange={(e) =>
                  setEditDuration(
                    e.target.value
                  )
                }
                placeholder="Duration"
                className="w-full rounded-lg border p-3"
              />

              <input
                value={editLanguage}
                onChange={(e) =>
                  setEditLanguage(
                    e.target.value
                  )
                }
                placeholder="Language"
                className="w-full rounded-lg border p-3"
              />

              <input
                value={editPosterUrl}
                onChange={(e) =>
                  setEditPosterUrl(
                    e.target.value
                  )
                }
                placeholder="Poster URL"
                className="w-full rounded-lg border p-3"
              />

              <div className="flex gap-3">

                <button
                  onClick={updateMovie}
                  className="rounded-lg bg-green-600 px-5 py-2 text-white"
                >
                  Save Changes
                </button>

                <button
                  onClick={() =>
                    setEditingMovieId(null)
                  }
                  className="rounded-lg border px-5 py-2"
                >
                  Cancel
                </button>

              </div>

            </div>
          </div>
        )}

        {/* MOVIE LIST */}

        <div className="space-y-4">

          {filteredMovies.length === 0 ? (
            <p className="text-gray-500">
              No movies found.
            </p>
          ) : (
            filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="rounded-xl bg-white p-5 shadow"
              >

                <h3 className="text-xl font-bold">
                  {movie.title}
                </h3>

                <p className="mt-2 text-gray-600">
                  {movie.description}
                </p>

                <p className="mt-2 text-sm">
                  {movie.language} •{" "}
                  {movie.duration} minutes
                </p>

                <div className="mt-4 flex gap-3">

                  <button
                    onClick={() =>
                      startEdit(movie)
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteMovie(movie.id)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminMovies;
