import { Edit3, Plus, Search, Star, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminNav from "../components/AdminNav";
import { api } from "../lib/api";
import type { Movie } from "../lib/api";

const emptyForm = { title: "", description: "", genre: "", duration: "", rating: "", image: "" };

const AdminMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Movie | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const response = await api.get("/movies");
    setMovies(response.data.movies ?? []);
  };

  useEffect(() => {
    void load().catch((requestError: any) => {
      setError(requestError?.response?.data?.message ?? "Unable to load movies.");
    });
  }, []);

  const filtered = useMemo(
    () => movies.filter((movie) => movie.title.toLowerCase().includes(search.toLowerCase())),
    [movies, search]
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (movie: Movie) => {
    setEditing(movie);
    setForm({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      duration: String(movie.duration),
      rating: String(movie.rating),
      image: movie.image,
    });
    setFormOpen(true);
  };

  const save = async () => {
    setError("");

    if (!form.title || !form.description || !form.genre || !form.duration || !form.rating || !form.image) {
      setError("All movie fields are required.");
      return;
    }

    const duration = Number(form.duration);
    const rating = Number(form.rating);

    if (!Number.isInteger(duration) || duration <= 0 || Number.isNaN(rating) || rating < 0 || rating > 10) {
      setError("Duration must be positive minutes and rating must be between 0 and 10.");
      return;
    }

    try {
      setSaving(true);
      const payload = { ...form, duration, rating };

      if (editing) {
        await api.put(`/movies/${editing.id}`, payload);
      } else {
        await api.post("/movies", payload);
      }

      await load();
      setFormOpen(false);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "Unable to save movie.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this movie from the database?")) return;

    try {
      await api.delete(`/movies/${id}`);
      await load();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "Unable to delete movie.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav current="movies" />
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Admin Panel</p>
              <h1 className="mt-3 text-4xl font-black">Manage Movies</h1>
              <p className="mt-3 text-sm text-slate-400">No local movie array or seed data is used here.</p>
            </div>
            <button onClick={openCreate} type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"><Plus size={18} />Add Movie</button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}

        <div className="mb-8 flex items-center rounded-2xl border border-white/10 bg-white/[0.03] p-2">
          <Search size={19} className="ml-3 text-slate-500" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search movies..." className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center text-slate-500">No movie records found.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((movie) => (
              <article key={movie.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                <img src={movie.image} alt={movie.title} className="h-64 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold">{movie.title}</h2>
                      <p className="mt-1 text-sm text-violet-300">{movie.genre}</p>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-amber-300"><Star size={14} fill="currentColor" />{Number(movie.rating).toFixed(1)}</span>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-500">{movie.description}</p>
                  <p className="mt-3 text-xs text-slate-600">{movie.duration} minutes • ID {movie.id}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button onClick={() => openEdit(movie)} type="button" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold hover:bg-white/10"><Edit3 size={16} />Edit</button>
                    <button onClick={() => void remove(movie.id)} type="button" className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20"><Trash2 size={16} />Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-xs uppercase tracking-wider text-violet-400">Movie Management</p><h2 className="mt-1 text-2xl font-black">{editing ? "Edit Movie" : "Add Movie"}</h2></div>
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-xl p-2 text-slate-500 hover:bg-white/10 hover:text-white"><X size={20} /></button>
            </div>

            <div className="mt-7 space-y-4">
              {[
                ["title", "Title", "text"],
                ["genre", "Genre", "text"],
                ["duration", "Duration (minutes)", "number"],
                ["rating", "Rating (0-10)", "number"],
                ["image", "Image URL", "url"],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-300">{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-violet-500"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={4} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-violet-500" />
              </div>

              <button disabled={saving} type="button" onClick={() => void save()} className="w-full rounded-xl bg-violet-600 py-3.5 text-sm font-semibold hover:bg-violet-500 disabled:opacity-60">
                {saving ? "Saving..." : editing ? "Update Movie" : "Create Movie"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
