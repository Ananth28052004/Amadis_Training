import { Link, useNavigate } from "@tanstack/react-router";
import { Film, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    console.log("Login:", {
      email,
      password,
    });

    // Backend login will be connected later.
    navigate({
      to: "/",
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/30 lg:grid-cols-2">

        {/* Left side */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-violet-700 via-violet-900 to-slate-950 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                <Film size={24} />
              </div>

              <span className="text-xl font-bold">
                Cine<span className="text-violet-300">Book</span>
              </span>
            </div>

            <div className="mt-20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
                Welcome back
              </p>

              <h1 className="mt-4 text-5xl font-black leading-tight">
                Your next
                <br />
                movie night
                <br />
                awaits.
              </h1>

              <p className="mt-6 max-w-md leading-7 text-violet-100/70">
                Sign in to discover movies, reserve your favorite
                seats and manage all your bookings in one place.
              </p>
            </div>
          </div>

          <p className="relative text-sm text-violet-200/50">
            Lights. Camera. Book.
          </p>
        </div>

        {/* Right side */}
        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mx-auto max-w-md">

            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                <Film size={21} />
              </div>

              <span className="text-xl font-bold">
                Cine<span className="text-violet-400">Book</span>
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-violet-400">
                ACCOUNT
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Sign in
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Welcome back! Enter your details below.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-5"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email
                </label>

                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-violet-500/60 focus-within:ring-2 focus-within:ring-violet-500/10">
                  <Mail
                    size={19}
                    className="shrink-0 text-slate-500"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-violet-500/60 focus-within:ring-2 focus-within:ring-violet-500/10">
                  <Lock
                    size={19}
                    className="shrink-0 text-slate-500"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="text-slate-500 transition hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-slate-400">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-600"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-violet-400 hover:text-violet-300"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-violet-600 py-3.5 font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 hover:shadow-violet-600/30"
              >
                Sign In
              </button>
            </form>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-violet-400 hover:text-violet-300"
              >
                Create account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
