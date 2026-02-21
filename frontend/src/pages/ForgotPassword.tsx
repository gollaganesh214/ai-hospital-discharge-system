import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await api.post("/auth/forgot", { email });
    setMessage(res.data.message ?? "Reset link sent");
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Reset Password</h1>
        <p className="auth-subtitle">Demo flow only.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </label>
          <button type="submit">Send reset link</button>
        </form>

        {message && <p className="success">{message}</p>}

        <div className="auth-actions">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
