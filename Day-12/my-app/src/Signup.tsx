import React, { useState } from "react";

type Props = {
  onSignup: (username: string, password: string) => string;
  onGoToLogin: () => void;
};

function Signup({ onSignup, onGoToLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errorMessage = onSignup(username, password);
    setError(errorMessage);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="w-80 bg-slate-800 rounded-xl p-6 text-white">
        <h1 className="text-xl font-semibold text-center mb-4">
          Create account
        </h1>

        <label className="block text-sm text-slate-300 mt-3 mb-1">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          className="w-full p-2.5 rounded-md border border-slate-600 bg-slate-900 text-white text-sm"
        />

        <label className="block text-sm text-slate-300 mt-3 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a password"
          className="w-full p-2.5 rounded-md border border-slate-600 bg-slate-900 text-white text-sm"
        />

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="w-full mt-4 p-2.5 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium"
        >
          Create account
        </button>

        <p className="text-slate-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={onGoToLogin}
            className="text-blue-400 underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
