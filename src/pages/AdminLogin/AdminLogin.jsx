import "./AdminLogin.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (
      username === "admin" &&
      password === "admin123"
    ) {
      localStorage.setItem(
        "isAdminLoggedIn",
        "true"
      );

      // Show Admin button after successful login
      localStorage.setItem(
        "showAdmin",
        "true"
      );

      navigate("/admin");
    } else {
      setError(
        "Invalid username or password. Please try again."
      );
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-container">

        {/* LEFT BRANDING SECTION */}

        <div className="admin-login-brand">

          <Link
            to="/"
            className="admin-brand-logo"
          >
            Event<span>Sphere</span>
          </Link>

          <div className="brand-content">

            <p className="brand-label">
              EVENT MANAGEMENT PLATFORM
            </p>

            <h1>
              Manage every event.
              <br />
              Create every experience.
            </h1>

            <p className="brand-description">
              Your central hub for managing events,
              registrations, and attendees — all in
              one place.
            </p>

          </div>

          <div className="brand-footer">
            © 2026 EventSphere
          </div>

        </div>

        {/* LOGIN SECTION */}

        <div className="admin-login-card-wrapper">

          <div className="admin-login-card">

            <div className="login-icon">
              🔐
            </div>

            <p className="login-label">
              ADMIN PORTAL
            </p>

            <h2>
              Welcome back
            </h2>

            <p className="login-subtitle">
              Sign in to manage your events
              and registrations.
            </p>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <form
              onSubmit={handleLogin}
              className="admin-login-form"
            >

              <div className="login-input-group">

                <label>
                  Username
                </label>

                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  required
                />

              </div>

              <div className="login-input-group">

                <label>
                  Password
                </label>

                <div className="password-wrapper">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    required
                  />

                  <button
                    type="button"
                    className="show-password-btn"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              <button
                type="submit"
                className="admin-login-button"
              >
                Sign In
                <span>→</span>
              </button>

            </form>

            <Link
              to="/"
              className="back-home-link"
            >
              ← Back to EventSphere
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;