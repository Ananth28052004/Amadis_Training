import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Film, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { api } from "../lib/api";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", { name, email, password });
      navigate({ to: "/login" });
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ??
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-violet-800 to-slate-950 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"><Film size={24} /></div>
              <span className="text-xl font-bold">Cine<span className="text-violet-300">Book</span></span>
            </div>
            <div className="mt-20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Join CineBook</p>
              <h1 className="mt-4 text-5xl font-black leading-tight">Your cinema<br />experience<br />starts here.</h1>
              <p className="mt-6 max-w-md leading-7 text-blue-100/70">
                Create your account and start discovering movies, showtimes and seats.
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-200/50">Lights. Camera. Book.</p>
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mx-auto max-w-md">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600"><Film size={21} /></div>
              <span className="text-xl font-bold">Cine<span className="text-violet-400">Book</span></span>
            </div>

            <p className="text-sm font-semibold text-violet-400">ACCOUNT</p>
            <h2 className="mt-2 text-3xl font-bold">Create account</h2>
            <p className="mt-2 text-sm text-slate-500">Your account is stored in the existing PostgreSQL users table.</p>

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
            )}

            <form onSubmit={handleRegister} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">Name</label>
                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4">
                  <User size={19} className="shrink-0 text-slate-500" />
                  <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4">
                  <Mail size={19} className="shrink-0 text-slate-500" />
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4">
                  <Lock size={19} className="shrink-0 text-slate-500" />
                  <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-500">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-300">Confirm Password</label>
                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4">
                  <Lock size={19} className="shrink-0 text-slate-500" />
                  <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none" />
                  <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="text-slate-500">{showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full rounded-xl bg-violet-600 py-3.5 font-semibold transition hover:bg-violet-500 disabled:opacity-60">
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account? <Link to="/login" className="font-semibold text-violet-400">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
