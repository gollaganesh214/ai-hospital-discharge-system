import { Routes, Route, NavLink } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Discharge from "./pages/Discharge";
import Admissions from "./pages/Admissions";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Labs from "./pages/Labs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleGate from "./auth/RoleGate";
import { useAuth } from "./auth/AuthContext";
import { useSearch } from "./search/SearchContext";

export default function App() {
  const { user, logout } = useAuth();
  const { query, setQuery } = useSearch();
  const isAdmin = user?.role === "ADMIN";
  const canViewReports = user?.role === "ADMIN";
  const canViewDischarge = user?.role === "ADMIN" || user?.role === "DOCTOR";
  const canViewPatients = user?.role === "ADMIN" || user?.role === "NURSE";

  useEffect(() => {
    const root = document.documentElement;
    function handleMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      root.style.setProperty("--tilt-x", `${(-y * 6).toFixed(2)}deg`);
      root.style.setProperty("--tilt-y", `${(x * 6).toFixed(2)}deg`);
    }
    function resetTilt() {
      root.style.setProperty("--tilt-x", "0deg");
      root.style.setProperty("--tilt-y", "0deg");
    }
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", resetTilt);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", resetTilt);
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="app">
              <div className="floating-orb orb-a" />
              <div className="floating-orb orb-b" />
              <div className="glow-ring" />
              <div className="particles">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <aside className="sidebar">
                <div className="brand">
                  <div className="logo">AH</div>
                  <div>
                    <h1>AI Powered Smart Hospital</h1>
                    <p className="subtitle">Management System</p>
                  </div>
                </div>
                <nav>
                  <NavLink to="/">Dashboard</NavLink>
                  {canViewPatients && <NavLink to="/patients">Patients</NavLink>}
                  <NavLink to="/admissions">Admissions</NavLink>
                  <NavLink to="/labs">Labs</NavLink>
                  {canViewDischarge && <NavLink to="/discharge">Discharge</NavLink>}
                  {canViewReports && <NavLink to="/reports">Reports</NavLink>}
                  {isAdmin && <NavLink to="/users">Users</NavLink>}
                  <NavLink to="/settings">Settings</NavLink>
                  <NavLink to="/profile">Profile</NavLink>
                </nav>
                <div className="sidebar-footer">
                  <div className="user-chip">
                    <div className="avatar">{user?.email?.[0]?.toUpperCase() ?? "U"}</div>
                    <div>
                      <p className="user-email">{user?.email}</p>
                      <p className="user-role">{user?.role}</p>
                    </div>
                  </div>
                </div>
              </aside>
              <main className="content">
                <header className="topbar">
                  <div className="topbar-left">
                    <h2>Welcome back</h2>
                    <p>Here is today's overview for your unit.</p>
                  </div>
                  <div className="topbar-actions">
                    <div className="search">
                      <input
                        placeholder="Search patients, MRN, doctor..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                    <button className="ghost" onClick={logout}>
                      Sign out
                    </button>
                  </div>
                </header>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route
                    path="/patients"
                    element={
                      <RoleGate roles={["ADMIN", "NURSE"]}>
                        <Patients />
                      </RoleGate>
                    }
                  />
                  <Route
                    path="/admissions"
                    element={
                      <RoleGate roles={["ADMIN", "DOCTOR", "NURSE"]}>
                        <Admissions />
                      </RoleGate>
                    }
                  />
                  <Route
                    path="/labs"
                    element={
                      <RoleGate roles={["ADMIN", "DOCTOR", "NURSE"]}>
                        <Labs />
                      </RoleGate>
                    }
                  />
                  <Route
                    path="/discharge"
                    element={
                      <RoleGate roles={["ADMIN", "DOCTOR"]}>
                        <Discharge />
                      </RoleGate>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <RoleGate roles={["ADMIN"]}>
                        <Reports />
                      </RoleGate>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <RoleGate roles={["ADMIN"]}>
                        <Users />
                      </RoleGate>
                    }
                  />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
