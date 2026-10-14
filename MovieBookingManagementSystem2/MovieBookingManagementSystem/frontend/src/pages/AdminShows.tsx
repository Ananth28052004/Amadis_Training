import { CalendarDays, Clock3, Film, Plus, Search, Trash2, X, Armchair } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminNav from "../components/AdminNav";
import { api } from "../lib/api";
import type { Movie, Show, Theater } from "../lib/api";

const emptyForm = { movieId: "", theaterId: "", date: "", time: "", price: "" };

const AdminShows = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Show | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [seatLoading, setSeatLoading] = useState<number | null>(null);

  const load = async () => {
    const [showResponse, movieResponse, theaterResponse] = await Promise.all([
      api.get("/shows"),
      api.get("/movies"),
      api.get("/theaters"),
    ]);

    setShows(showResponse.data.shows ?? []);
    setMovies(movieResponse.data.movies ?? []);
    setTheaters(theaterResponse.data.theaters ?? []);
  };

  useEffect(() => {
    void load().catch((requestError: any) => {
      setError(requestError?.response?.data?.message ?? "Unable to load show data.");
    });
  }, []);

  const filtered = useMemo(
    () =>
      shows.filter((show) =>
        (show.movie?.title ?? "").toLowerCase().includes(search.toLowerCase())
      ),
    [shows, search]
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (show: Show) => {
    const date = new Date(show.showTime);
    const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const localTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    setEditing(show);
    setForm({
      movieId: String(show.movieId),
      theaterId: String(show.theaterId),
      date: localDate,
      time: localTime,
      price: String(show.price),
    });
    setFormOpen(true);
  };

  const save = async () => {
    setError("");

    if (!form.movieId || !form.theaterId || !form.date || !form.time || !form.price) {
      setError("All show fields are required.");
      return;
    }

    const date = new Date(`${form.date}T${form.time}`);
    const price = Number(form.price);

    if (Number.isNaN(date.getTime()) || !Number.isFinite(price) || price <= 0) {
      setError("Enter a valid show date/time and ticket price.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        movieId: Number(form.movieId),
        theaterId: Number(form.theaterId),
        showTime: date.toISOString(),
        price,
      };

      if (editing) {
        await api.put(`/shows/${editing.id}`, payload);
      } else {
        await api.post("/shows", payload);
      }

      await load();
      setFormOpen(false);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "Unable to save show.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this show? The backend will reject deletion if bookings already exist.")) return;

    try {
      await api.delete(`/shows/${id}`);
      await load();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "Unable to delete show.");
    }
  };

  const createSeats = async (showId: number) => {
    try {
      setSeatLoading(showId);
      const response = await api.post(`/seats/show/${showId}`);
      setError("");
      const totalSeats = Number(response.data?.totalSeats ?? 0);
      const createdSeats = Number(response.data?.createdSeats ?? 0);
      const theaterId = response.data?.theaterId;

      if (!Number.isInteger(totalSeats) || totalSeats <= 0) {
        setError(`Backend returned an invalid seat count for show ${showId}. theaterId=${theaterId ?? "unknown"}. Restart the backend from this fixed project and try again.`);
        return;
      }

      alert(
        createdSeats > 0
          ? `${createdSeats} seats created. Total seats: ${totalSeats}.`
          : `Seats are ready. Total seats: ${totalSeats}.`
      );
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "Unable to create seats.");
    } finally {
      setSeatLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav current="shows" />
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Admin Panel</p>
              <h1 className="mt-3 text-4xl font-black">Manage Shows</h1>
              <p className="mt-3 text-sm text-slate-400">Movies and theaters in the form are loaded from PostgreSQL.</p>
            </div>
            <button onClick={openCreate} type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"><Plus size={18} />Add Show</button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}

        <div className="mb-8 flex items-center rounded-2xl border border-white/10 bg-white/[0.03] p-2">
          <Search size={19} className="ml-3 text-slate-500" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by movie..." className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center text-slate-500">No show records found.</div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filtered.map((show) => {
              const date = new Date(show.showTime);
              return (
                <article key={show.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400"><Film size={22} /></div>
                      <div>
                        <p className="text-xs text-slate-600">Movie</p>
                        <h2 className="mt-1 text-xl font-bold">{show.movie?.title ?? `Movie #${show.movieId}`}</h2>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">ID {show.id}</span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <CalendarDays size={17} className="text-violet-400" />
                      <p className="mt-3 text-xs text-slate-600">Date</p>
                      <p className="mt-1 text-sm font-semibold">{date.toLocaleDateString(undefined, { dateStyle: "medium" })}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <Clock3 size={17} className="text-blue-400" />
                      <p className="mt-3 text-xs text-slate-600">Time</p>
                      <p className="mt-1 text-sm font-semibold">{date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <p className="text-xs text-slate-600">Theater</p>
                      <p className="mt-1 text-sm font-semibold">{show.theater?.name ?? `Theater #${show.theaterId}`}</p>
                      <p className="mt-1 text-xs text-slate-500">{show.theater?.location ?? ""}</p>
                      <p className="mt-2 text-xs text-slate-500">Capacity: {show.theater?.totalSeats ?? "unknown"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <p className="text-xs text-slate-600">Price</p>
                      <p className="mt-1 text-sm font-bold text-violet-300">₹{Number(show.price).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <button onClick={() => openEdit(show)} type="button" className="rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold hover:bg-white/10">Edit</button>
                    <button onClick={() => void remove(show.id)} type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20"><Trash2 size={16} />Delete</button>
                    <button onClick={() => void createSeats(show.id)} type="button" disabled={seatLoading === show.id} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500/10 py-3 text-sm font-semibold text-blue-300 hover:bg-blue-500/20 disabled:opacity-60"><Armchair size={16} />{seatLoading === show.id ? "Creating..." : "Create Seats"}</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-xs uppercase tracking-wider text-violet-400">Show Management</p><h2 className="mt-1 text-2xl font-black">{editing ? "Edit Show" : "Add Show"}</h2></div>
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-xl p-2 text-slate-500 hover:bg-white/10 hover:text-white"><X size={20} /></button>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-300">Movie</label>
                <select value={form.movieId} onChange={(event) => setForm((current) => ({ ...current, movieId: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm outline-none">
                  <option value="">Select a movie</option>
                  {movies.map((movie) => <option key={movie.id} value={movie.id}>{movie.title}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">Theater</label>
                <select value={form.theaterId} onChange={(event) => setForm((current) => ({ ...current, theaterId: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm outline-none">
                  <option value="">Select a theater</option>
                  {theaters.map((theater) => <option key={theater.id} value={theater.id}>{theater.name} — {theater.location}</option>)}
                </select>
                {theaters.length === 0 && <p className="mt-2 text-xs text-amber-300">No theaters exist in the database. Add one before creating a show.</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-300">Date</label>
                  <input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Time</label>
                  <input type="time" value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">Ticket Price</label>
                <input type="number" min="1" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none" />
              </div>

              <button disabled={saving || movies.length === 0 || theaters.length === 0} type="button" onClick={() => void save()} className="w-full rounded-xl bg-violet-600 py-3.5 text-sm font-semibold hover:bg-violet-500 disabled:opacity-60">
                {saving ? "Saving..." : editing ? "Update Show" : "Create Show"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShows;
