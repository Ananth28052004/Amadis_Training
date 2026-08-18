import {
  CalendarDays,
  Clock3,
  Edit3,
  Film,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

type Show = {
  id: number;
  movie: string;
  date: string;
  time: string;
  screen: string;
  price: number;
};

const initialShows: Show[] = [
  {
    id: 1,
    movie: "Midnight Echo",
    date: "2026-08-20",
    time: "10:30 AM",
    screen: "Screen 1",
    price: 180,
  },
  {
    id: 2,
    movie: "Midnight Echo",
    date: "2026-08-20",
    time: "7:30 PM",
    screen: "Screen 2",
    price: 250,
  },
  {
    id: 3,
    movie: "The Last Horizon",
    date: "2026-08-22",
    time: "4:30 PM",
    screen: "Screen 1",
    price: 220,
  },
];

const movieOptions = [
  "Midnight Echo",
  "The Last Horizon",
  "Silent Shadows",
  "Neon City",
  "Beyond the Stars",
  "Lost Memories",
];

const screenOptions = [
  "Screen 1",
  "Screen 2",
  "Screen 3",
];

const AdminShows = () => {
  const [shows, setShows] =
    useState<Show[]>(initialShows);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingShow, setEditingShow] =
    useState<Show | null>(null);

  const [movie, setMovie] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [screen, setScreen] = useState("");
  const [price, setPrice] = useState("");

  const filteredShows = shows.filter((show) =>
    show.movie
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setMovie("");
    setDate("");
    setTime("");
    setScreen("");
    setPrice("");
    setEditingShow(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (show: Show) => {
    setEditingShow(show);

    setMovie(show.movie);
    setDate(show.date);
    setTime(show.time);
    setScreen(show.screen);
    setPrice(String(show.price));

    setShowForm(true);
  };

  const handleSubmit = () => {
    if (
      !movie ||
      !date ||
      !time ||
      !screen ||
      !price
    ) {
      alert("All show fields are required");
      return;
    }

    const numericPrice = Number(price);

    if (
      Number.isNaN(numericPrice) ||
      numericPrice <= 0
    ) {
      alert("Please enter a valid ticket price");
      return;
    }

    if (editingShow) {
      setShows((currentShows) =>
        currentShows.map((show) =>
          show.id === editingShow.id
            ? {
                ...show,
                movie,
                date,
                time,
                screen,
                price: numericPrice,
              }
            : show
        )
      );
    } else {
      const newShow: Show = {
        id: Date.now(),
        movie,
        date,
        time,
        screen,
        price: numericPrice,
      };

      setShows((currentShows) => [
        ...currentShows,
        newShow,
      ]);
    }

    resetForm();
  };

  const deleteShow = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this show?"
    );

    if (!confirmed) {
      return;
    }

    setShows((currentShows) =>
      currentShows.filter(
        (show) => show.id !== id
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

                <CalendarDays size={20} />

                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Admin Panel
                </span>

              </div>

              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                Manage Shows
              </h1>

              <p className="mt-3 text-sm text-slate-400">
                Create and manage movie showtimes,
                screens and ticket prices.
              </p>

            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
            >
              <Plus size={18} />
              Add Show
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
            placeholder="Search shows by movie..."
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-600"
          />

        </div>

        {/* Shows */}
        {filteredShows.length === 0 ? (

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center">

            <CalendarDays
              size={40}
              className="mx-auto text-slate-700"
            />

            <h2 className="mt-4 text-xl font-bold">
              No shows found
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Add a new show or search for another movie.
            </p>

          </div>

        ) : (

          <div className="grid gap-5 lg:grid-cols-2">

            {filteredShows.map((show) => (

              <article
                key={show.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/30 sm:p-6"
              >

                {/* Movie */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                      <Film size={22} />
                    </div>

                    <div>

                      <p className="text-xs text-slate-600">
                        Movie
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        {show.movie}
                      </h2>

                    </div>

                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                    Active
                  </span>

                </div>

                {/* Details */}
                <div className="mt-6 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">

                    <CalendarDays
                      size={17}
                      className="text-violet-400"
                    />

                    <p className="mt-3 text-xs text-slate-600">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {show.date}
                    </p>

                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">

                    <Clock3
                      size={17}
                      className="text-blue-400"
                    />

                    <p className="mt-3 text-xs text-slate-600">
                      Showtime
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {show.time}
                    </p>

                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">

                    <p className="text-xs text-slate-600">
                      Screen
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {show.screen}
                    </p>

                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">

                    <p className="text-xs text-slate-600">
                      Ticket Price
                    </p>

                    <p className="mt-1 text-sm font-bold text-violet-300">
                      ₹{show.price}
                    </p>

                  </div>

                </div>

                {/* Actions */}
                <div className="mt-5 grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(show)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold transition hover:bg-white/10"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteShow(show.id)
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

            {/* Header */}
            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                  Show Management
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {editingShow
                    ? "Edit Show"
                    : "Add Show"}
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

              {/* Movie */}
              <div>

                <label className="text-sm font-medium text-slate-300">
                  Movie
                </label>

                <select
                  value={movie}
                  onChange={(event) =>
                    setMovie(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                >

                  <option value="">
                    Select movie
                  </option>

                  {movieOptions.map(
                    (movieName) => (
                      <option
                        key={movieName}
                        value={movieName}
                      >
                        {movieName}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* Date */}
              <div>

                <label className="text-sm font-medium text-slate-300">
                  Show Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                />

              </div>

              {/* Time + Screen */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="text-sm font-medium text-slate-300">
                    Showtime
                  </label>

                  <input
                    type="time"
                    value={time}
                    onChange={(event) =>
                      setTime(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                  />

                </div>

                <div>

                  <label className="text-sm font-medium text-slate-300">
                    Screen
                  </label>

                  <select
                    value={screen}
                    onChange={(event) =>
                      setScreen(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                  >

                    <option value="">
                      Select screen
                    </option>

                    {screenOptions.map(
                      (screenName) => (
                        <option
                          key={screenName}
                          value={screenName}
                        >
                          {screenName}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

              {/* Price */}
              <div>

                <label className="text-sm font-medium text-slate-300">
                  Ticket Price
                </label>

                <input
                  type="number"
                  min="1"
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                  placeholder="180"
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
                  {editingShow
                    ? "Update Show"
                    : "Add Show"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminShows;
