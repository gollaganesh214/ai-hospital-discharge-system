import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("NURSE");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await register(email, password, role);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Registration failed");
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Choose a role for the new account.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </label>
          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </label>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="ADMIN">Admin</option>
              <option value="DOCTOR">Doctor</option>
              <option value="NURSE">Nurse</option>
            </select>
          </label>
          <button type="submit">Register</button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="auth-actions">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
