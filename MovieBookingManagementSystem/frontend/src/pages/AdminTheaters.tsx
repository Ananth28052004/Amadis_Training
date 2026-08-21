import { Edit3, MapPin, Plus, Search, Ticket, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminNav from "../components/AdminNav";
import { api } from "../lib/api";
import type { Theater } from "../lib/api";
const emptyForm = {
  name: "",
  location: "",
  totalSeats: "",
};
  
const AdminTheaters = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Theater | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const response = await api.get("/theaters");
    setTheaters(response.data.theaters ?? []);
  };

  useEffect(() => {
    void load().catch((requestError: any) => {
      setError(requestError?.response?.data?.message ?? "Unable to load theaters.");
    });
  }, []);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return theaters;

    return theaters.filter((theater) =>
      `${theater.name} ${theater.location}`.toLowerCase().includes(value)
    );
  }, [theaters, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
  };

  const openEdit = (theater: Theater) => {
    setEditing(theater);
    setForm({
      name: theater.name,
      location: theater.location,
      totalSeats: String(theater.totalSeats),
    });
    setError("");
    setFormOpen(true);
  };

  const save = async () => {
    setError("");

    const name = form.name.trim();
    const location = form.location.trim();
    const totalSeats = Number(form.totalSeats);

    if (!name || !location || !form.totalSeats) {
      setError("Name, location and total seats are required.");
      return;
    }

    if (!Number.isInteger(totalSeats) || totalSeats <= 0) {
      setError("Total seats must be a positive whole number.");
      return;
    }

    try {
      setSaving(true);
      const payload = { name, location, totalSeats };

      if (editing) {
        await api.put(`/theaters/${editing.id}`, payload);
      } else {
        await api.post("/theaters", payload);
      }

      await load();
      setFormOpen(false);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "Unable to save theater.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this theater? Existing shows or bookings may prevent deletion.")) return;

    try {
      setError("");
      await api.delete(`/theaters/${id}`);
      await load();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "Unable to delete theater.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav current="theaters" />
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Admin Panel</p>
              <h1 className="mt-3 text-4xl font-black">Manage Theaters</h1>
              <p className="mt-3 text-sm text-slate-400">Create and manage theaters using the existing PostgreSQL database.</p>
            </div>
            <button onClick={openCreate} type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500">
              <Plus size={18} /> Add Theater
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}

        <div className="mb-8 flex items-center rounded-2xl border border-white/10 bg-white/[0.03] p-2">
          <Search size={19} className="ml-3 text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search theater or location..."
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center text-slate-500">
            {theaters.length === 0 ? "No theaters found. Add your first theater." : "No theaters match your search."}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((theater) => (
              <article key={theater.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                    <MapPin size={22} />
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">ID {theater.id}</span>
                </div>

                <h2 className="mt-6 text-xl font-bold">{theater.name}</h2>
                <p className="mt-2 flex items-start gap-2 text-sm text-slate-400">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-violet-400" />
                  {theater.location}
                </p>

                <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/10 p-4">
                  <Ticket size={18} className="text-blue-400" />
                  <div>
                    <p className="text-xs text-slate-600">Total seats</p>
                    <p className="mt-1 text-lg font-bold">{theater.totalSeats}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button onClick={() => openEdit(theater)} type="button" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold hover:bg-white/10">
                    <Edit3 size={16} /> Edit
                  </button>
                  <button onClick={() => void remove(theater.id)} type="button" className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-violet-400">Theater Management</p>
                <h2 className="mt-1 text-2xl font-black">{editing ? "Edit Theater" : "Add Theater"}</h2>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-xl p-2 text-slate-500 hover:bg-white/10 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="mt-7 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Theater name</label>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Example: PVR Cinemas"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">Location</label>
                <input
                  value={form.location}
                  onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                  placeholder="Example: Coimbatore"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">Total seats</label>
                <input
                  type="number"
                  min="1"
                  value={form.totalSeats}
                  onChange={(event) => setForm((current) => ({ ...current, totalSeats: event.target.value }))}
                  placeholder="Example: 120"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <button disabled={saving} type="button" onClick={() => void save()} className="w-full rounded-xl bg-violet-600 py-3.5 text-sm font-semibold hover:bg-violet-500 disabled:opacity-60">
                {saving ? "Saving..." : editing ? "Update Theater" : "Create Theater"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTheaters;
