import { useEffect, useState } from "react";
import { api } from "../api/client";

type User = {
  id: number;
  email: string;
  role: string;
  createdAt: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get<User[]>("/users").then((res) => setUsers(res.data));
  }, []);

  async function updateRole(id: number, role: string) {
    await api.patch(`/users/${id}/role`, { role });
    const res = await api.get<User[]>("/users");
    setUsers(res.data);
  }

  return (
    <section>
      <header className="page-header">
        <h2>Users</h2>
        <p>Admin-only user management.</p>
      </header>

      <table className="table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u.id, e.target.value)}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="DOCTOR">DOCTOR</option>
                  <option value="PATIENT">PATIENT</option>
                  <option value="NURSE">NURSE</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
