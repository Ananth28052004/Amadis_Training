import {
  Edit3,
  Film,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

type Movie = {
  id: number;
  title: string;
  genre: string;
  rating: number;
  duration: string;
  image: string;
};

const initialMovies: Movie[] = [
  {
    id: 1,
    title: "Midnight Echo",
    genre: "Action • Thriller",
    rating: 8.7,
    duration: "2h 18m",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    title: "The Last Horizon",
    genre: "Sci-Fi • Adventure",
    rating: 9.1,
    duration: "2h 32m",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    title: "Silent Shadows",
    genre: "Mystery • Drama",
    rating: 8.4,
    duration: "2h 05m",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
  },
];

const AdminMovies = () => {
  const [movies, setMovies] =
    useState<Movie[]>(initialMovies);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingMovie, setEditingMovie] =
    useState<Movie | null>(null);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");

  const filteredMovies = movies.filter((movie) =>
    movie.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setTitle("");
    setGenre("");
    setRating("");
    setDuration("");
    setImage("");
    setEditingMovie(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (movie: Movie) => {
    setEditingMovie(movie);

    setTitle(movie.title);
    setGenre(movie.genre);
    setRating(String(movie.rating));
    setDuration(movie.duration);
    setImage(movie.image);

    setShowForm(true);
  };

  const handleSubmit = () => {
    if (
      !title ||
      !genre ||
      !rating ||
      !duration ||
      !image
    ) {
      alert("All movie fields are required");
      return;
    }

    if (editingMovie) {
      setMovies((currentMovies) =>
        currentMovies.map((movie) =>
          movie.id === editingMovie.id
            ? {
                ...movie,
                title,
                genre,
                rating: Number(rating),
                duration,
                image,
              }
            : movie
        )
      );
    } else {
      const newMovie: Movie = {
        id: Date.now(),
        title,
        genre,
        rating: Number(rating),
        duration,
        image,
      };

      setMovies((currentMovies) => [
        ...currentMovies,
        newMovie,
      ]);
    }

    resetForm();
  };

  const deleteMovie = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this movie?"
    );

    if (!confirmed) {
      return;
    }

    setMovies((currentMovies) =>
      currentMovies.filter(
        (movie) => movie.id !== id
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <section className="border-b border-white/10 bg-white/[0.02]">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>

              <div className="flex items-center gap-2 text-violet-400">

                <Film size={20} />

                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Admin Panel
                </span>

              </div>

              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                Manage Movies
              </h1>

              <p className="mt-3 text-sm text-slate-400">
                Add, edit and remove movies from CineBook.
              </p>

            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
            >
              <Plus size={18} />
              Add Movie
            </button>

          </div>

        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Search */}
        <div className="mb-8 flex items-center rounded-2xl border border-white/10 bg-white/[0.03] p-2">

          <Search
            size={19}
            className="ml-3 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search movies..."
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-600"
          />

        </div>

        {/* Movie count */}
        <div className="mb-5 flex items-center justify-between">

          <p className="text-sm text-slate-500">
            {filteredMovies.length} movie
            {filteredMovies.length !== 1
              ? "s"
              : ""}
          </p>

        </div>

        {/* Movies */}
        {filteredMovies.length === 0 ? (

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center">

            <Film
              size={40}
              className="mx-auto text-slate-700"
            />

            <h2 className="mt-4 text-xl font-bold">
              No movies found
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Try another movie name.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredMovies.map((movie) => (

              <article
                key={movie.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
              >

                {/* Image */}
                <div className="relative aspect-[2/3]">

                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-black/70 px-3 py-2 text-sm">

                    <Star
                      size={14}
                      fill="currentColor"
                      className="text-yellow-400"
                    />

                    {movie.rating}

                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">

                    <p className="text-xs text-violet-300">
                      {movie.genre}
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      {movie.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      {movie.duration}
                    </p>

                  </div>

                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 p-4">

                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(movie)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold transition hover:bg-white/10"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteMovie(movie.id)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </main>

      {/* Add/Edit Modal */}
      {showForm && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">

            {/* Modal header */}
            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                  Movie Management
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {editingMovie
                    ? "Edit Movie"
                    : "Add Movie"}
                </h2>

              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}
            <div className="mt-7 space-y-5">

              {/* Title */}
              <div>

                <label className="text-sm font-medium text-slate-300">
                  Movie Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Enter movie title"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                />

              </div>

              {/* Genre */}
              <div>

                <label className="text-sm font-medium text-slate-300">
                  Genre
                </label>

                <input
                  type="text"
                  value={genre}
                  onChange={(event) =>
                    setGenre(event.target.value)
                  }
                  placeholder="Action • Thriller"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                />

              </div>

              {/* Rating + Duration */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="text-sm font-medium text-slate-300">
                    Rating
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={rating}
                    onChange={(event) =>
                      setRating(event.target.value)
                    }
                    placeholder="8.5"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                  />

                </div>

                <div>

                  <label className="text-sm font-medium text-slate-300">
                    Duration
                  </label>

                  <input
                    type="text"
                    value={duration}
                    onChange={(event) =>
                      setDuration(event.target.value)
                    }
                    placeholder="2h 15m"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                  />

                </div>

              </div>

              {/* Image */}
              <div>

                <label className="text-sm font-medium text-slate-300">
                  Image URL
                </label>

                <input
                  type="url"
                  value={image}
                  onChange={(event) =>
                    setImage(event.target.value)
                  }
                  placeholder="https://..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                />

              </div>

              {/* Buttons */}
              <div className="grid gap-3 pt-3 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="rounded-xl bg-violet-600 py-3 text-sm font-semibold transition hover:bg-violet-500"
                >
                  {editingMovie
                    ? "Update Movie"
                    : "Add Movie"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminMovies;
