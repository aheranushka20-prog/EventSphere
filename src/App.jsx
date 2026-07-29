import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

import Home from "./pages/Home/Home";
import EventList from "./pages/EventList/EventList";
import EventDetails from "./pages/EventDetails/EventDetails";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminLogin from "./pages/AdminLogin/AdminLogin";

function ProtectedAdminRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("isAdminLoggedIn") ===
    "true";

  return isLoggedIn ? (
    children
  ) : (
    <Navigate
      to="/admin-login"
      replace
    />
  );
}

function AppContent() {
  const location = useLocation();

  const isAdminPage =
    location.pathname === "/admin";

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/events"
          element={<EventList />}
        />

        <Route
          path="/event/:id"
          element={<EventDetails />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;