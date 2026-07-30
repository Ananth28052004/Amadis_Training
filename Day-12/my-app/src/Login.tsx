import React, { useState } from "react";
type Props = {
  onLogin: (username: string, password: string) => string;
  onGoToSignup: () => void;
};

function Login({ onLogin, onGoToSignup }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errorMessage = onLogin(username, password);
    setError(errorMessage);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="w-80 bg-slate-800 rounded-xl p-6 text-white">
        <h1 className="text-xl font-semibold text-center mb-1">Log in</h1>
        <p className="text-slate-400 text-sm text-center mb-4">
          Default account: ananth / 1234
        </p>

        <label className="block text-sm text-slate-300 mt-3 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full p-2.5 rounded-md border border-slate-600 bg-slate-900 text-white text-sm"/>

        <label className="block text-sm text-slate-300 mt-3 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full p-2.5 rounded-md border border-slate-600 bg-slate-900 text-white text-sm"/>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="w-full mt-4 p-2.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium">
          Log in
        </button>

        <p className="text-slate-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <span
            onClick={onGoToSignup}
            className="text-blue-400 underline cursor-pointer">
            Create one
          </span>
        </p>
      </form>
    </div>


  );
}

export default Login;