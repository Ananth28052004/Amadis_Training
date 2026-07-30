import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./index.css"; // Tailwind entry point (@import "tailwindcss")
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode><App></App></StrictMode>
);