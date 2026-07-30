import React, {  useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import Weather from "./Weather";
function App() {
  const [page, setPage] = useState<"login" | "signup" | "weather">("login");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  function handleLogin(username: string, password: string): string {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find((u: any) => u.username === username);

    if (!found) return "No account found with that username.";
    if (found.password !== password) return "Wrong password.";
    localStorage.setItem("currentUser", username);
    setCurrentUser(username);
    setPage("weather");
    return "";
  }
  function handleSignup(username: string, password: string): string {
    if (!username || !password) return "Please fill in both fields.";
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const alreadyExists = users.some((u: any) => u.username === username);
    if (alreadyExists) return "That username is already taken.";


    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));


    localStorage.setItem("currentUser", username);
    setCurrentUser(username);
    setPage("weather");
    return "";
  }

  function handleLogout() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setPage("login");
  }

  if (page === "login") {
    return <Login onLogin={handleLogin} onGoToSignup={() => setPage("signup")} />;
  }
  if (page === "signup") {
    return <Signup onSignup={handleSignup} onGoToLogin={() => setPage("login")} />;
  }
  return <Weather username={currentUser!} onLogout={handleLogout} />;
}

export default App;