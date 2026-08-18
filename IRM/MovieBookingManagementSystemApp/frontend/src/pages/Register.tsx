import { Link, useNavigate } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  Film,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Register:", {
      name,
      email,
      password,
    });

    // Backend registration will be connected later.
    navigate({
      to: "/login",
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/30 lg:grid-cols-2">

        {/* Left side */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-violet-800 to-slate-950 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

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
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Join CineBook
              </p>

              <h1 className="mt-4 text-5xl font-black leading-tight">
                Your cinema
                <br />
                experience
                <br />
                starts here.
              </h1>

              <p className="mt-6 max-w-md leading-7 text-blue-100/70">
                Create your account and start discovering
                movies, showtimes and the perfect seats.
              </p>
            </div>
          </div>

          <p className="relative text-sm text-blue-200/50">
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
                CREATE ACCOUNT
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Register
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create your CineBook account.
              </p>
            </div>

            <form
              onSubmit={handleRegister}
              className="mt-8 space-y-5"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full Name
                </label>

                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-violet-500/60"
                >
                  <User
                    size={19}
                    className="shrink-0 text-slate-500"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email
                </label>

                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-violet-500/60"
                >
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

                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-violet-500/60"
                >
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
                    placeholder="Create a password"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="text-slate-500 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Confirm Password
                </label>

                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-violet-500/60"
                >
                  <Lock
                    size={19}
                    className="shrink-0 text-slate-500"
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm your password"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="text-slate-500 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-violet-600 py-3.5 font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
              >
                Create Account
              </button>
            </form>

            {/* Login */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-violet-400 hover:text-violet-300"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;