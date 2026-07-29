import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [showAdmin, setShowAdmin] = useState(
    localStorage.getItem("showAdmin") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const checkAdmin = () => {
      setShowAdmin(localStorage.getItem("showAdmin") === "true");
    };

    window.addEventListener("storage", checkAdmin);
    window.addEventListener("focus", checkAdmin);

    return () => {
      window.removeEventListener("storage", checkAdmin);
      window.removeEventListener("focus", checkAdmin);
    };
  }, []);

  return (
    <nav className="main-navbar">
      <Link to="/" className="navbar-logo">
        Event<span>Sphere</span>
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        <Link to="/events">Events</Link>

        {showAdmin && (
          <Link to="/admin">
            Admin
          </Link>
        )}

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle Theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;