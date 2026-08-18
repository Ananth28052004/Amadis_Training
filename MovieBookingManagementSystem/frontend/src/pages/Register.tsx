import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setMessage("");

    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      setMessage("Registration successful");

      setTimeout(() => {
        navigate({
          to: "/login",
        });
      }, 1000);
    } catch (error: any) {
      console.error(error);

      setError(
        error.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6">

      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">

        <h1 className="mb-6 text-center text-3xl font-bold">
          Register
        </h1>

        {error && (
          <p className="mb-4 text-center text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p className="mb-4 text-center text-green-600">
            {message}
          </p>
        )}

        <div className="space-y-4">

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Name"
            className="w-full rounded-lg border p-3"
          />

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
            onClick={handleRegister}
            disabled={loading}
            className="w-full rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Register;
