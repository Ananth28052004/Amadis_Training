
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const token = data.token;

      if (!token) {
        setError("Login token not received");
        return;
      }

      localStorage.setItem("token", token);

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      if (payload.role === "ADMIN") {
        navigate({
          to: "/admin/movies",
        });
      } else {
        navigate({
          to: "/movies",
        });
      }
    } catch (error: any) {
      console.error(error);

      setError(
        error.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6">

      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">

        <h1 className="mb-6 text-center text-3xl font-bold">
          Login
        </h1>

        {error && (
          <p className="mb-4 text-center text-red-600">
            {error}
          </p>
        )}

        <div className="space-y-4">

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Email"
            className="w-full rounded-lg border p-3"
          />

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Password"
            className="w-full rounded-lg border p-3"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Login;
