import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Hide admin navigation by default
if (localStorage.getItem("showAdmin") === null) {
  localStorage.setItem("showAdmin", "false");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);