import { useEffect, useState } from "react";
import { api } from "../api/client";

type Profile = {
  id: number;
  email: string;
  role: string;
  createdAt: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    api.get<Profile>("/auth/me").then((res) => setProfile(res.data));
  }, []);

  return (
    <section>
      <header className="page-header">
        <h2>Profile</h2>
        <p>Account details and access level.</p>
      </header>

      <div className="card">
        <p><strong>Email:</strong> {profile?.email ?? "-"}</p>
        <p><strong>Role:</strong> {profile?.role ?? "-"}</p>
        <p><strong>Created:</strong> {profile ? new Date(profile.createdAt).toLocaleString() : "-"}</p>
      </div>
    </section>
  );
}
