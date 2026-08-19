import { Link, useNavigate } from "@tanstack/react-router";
import { Film, LogOut, Menu, ShieldCheck, Ticket, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getStoredUser, logout } from "../lib/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    window.addEventListener("storage", sync);
    window.addEventListener("cinebook-auth-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cinebook-auth-changed", sync);
    };
  }, []);

  const signOut = () => {
    logout();
    setUser(null);
    setOpen(false);
    window.dispatchEvent(new Event("cinebook-auth-changed"));
    navigate({ to: "/" });
  };

  const navLinks = (
    <>
      <Link
        to="/"
        onClick={() => setOpen(false)}
        className="rounded-xl px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        Home
      </Link>
      <Link
        to="/movies"
        onClick={() => setOpen(false)}
        className="rounded-xl px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        Movies
      </Link>
      {user && (
        <Link
          to="/my-bookings"
          onClick={() => setOpen(false)}
          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <Ticket size={16} className="text-violet-400" />
          My Bookings
        </Link>
      )}
      {user?.role === "admin" && (
        <Link
          to="/admin"
          onClick={() => setOpen(false)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3.5 py-2 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20"
        >
          <ShieldCheck size={16} />
          Admin Portal
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-600/30 transition group-hover:scale-105">
            <Film size={19} />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Cine<span className="text-violet-400">Book</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks}

          {user ? (
            <div className="ml-3 flex items-center gap-3 border-l border-white/10 pl-4">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/30 text-xs font-bold text-violet-300">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-violet-400 capitalize leading-tight">
                    {user.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={signOut}
                title="Sign out"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div className="ml-3 flex items-center gap-2 border-l border-white/10 pl-4">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {open && (
        <nav className="border-t border-white/10 bg-slate-950 px-4 py-5 md:hidden shadow-2xl">
          <div className="flex flex-col gap-2">
            {user && (
              <div className="mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-sm font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-300 capitalize">
                    {user.role} account
                  </span>
                </div>
              </div>
            )}

            {navLinks}

            <div className="mt-3 border-t border-white/10 pt-3">
              {user ? (
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/10 py-3 text-center text-sm font-semibold text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-violet-600 py-3 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
