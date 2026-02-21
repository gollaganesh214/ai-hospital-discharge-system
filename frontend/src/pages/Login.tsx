import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Login failed");
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">AH</div>
          <div>
            <h2>AI Powered Smart Hospital</h2>
            <p className="auth-subtitle">Management System</p>
          </div>
        </div>
        <p className="auth-lead">Sign in to your account.</p>

        <form className="form clean" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="admin@hospital.local"
              required
            />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
            />
          </label>
          <button type="submit">Sign in</button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="auth-actions">
          <Link to="/forgot">Forgot password?</Link>
          <Link to="/register">Create a new account</Link>
        </div>
      </section>
    </div>
  );
}
