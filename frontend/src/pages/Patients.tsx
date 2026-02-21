import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useSearch } from "../search/SearchContext";

type Patient = {
  id: number;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender?: string;
};

type PageResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};

export default function Patients() {
  const { user } = useAuth();
  const { query, setQuery } = useSearch();
  const canWrite = user?.role === "ADMIN";
  const [patients, setPatients] = useState<Patient[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const limit = 10;
  const [form, setForm] = useState({
    mrn: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: ""
  });

  useEffect(() => {
    fetchPatients(1, query);
  }, [query]);

  async function fetchPatients(nextPage: number, q: string) {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<PageResponse<Patient>>(
        `/patients?page=${nextPage}&limit=${limit}&q=${encodeURIComponent(q)}`
      );
      setPatients(res.data.data);
      setPage(res.data.page);
      setTotal(res.data.total);
    } catch (err: any) {
      const message = err?.response?.data?.error;
      setError(typeof message === "string" ? message : "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/patients", {
        ...form,
        dob: form.dob
      });
      setForm({ mrn: "", firstName: "", lastName: "", dob: "", gender: "" });
      setQuery("");
      await fetchPatients(1, "");
    } catch (err: any) {
      const message = err?.response?.data?.error;
      setError(typeof message === "string" ? message : "Failed to add patient");
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section>
      <header className="page-header">
        <h2>Patients</h2>
        <p>Patient registry with MRN details.</p>
      </header>

      {canWrite ? (
        <form className="form" onSubmit={handleSubmit}>
          <label>
            MRN
            <input
              value={form.mrn}
              onChange={(e) => setForm({ ...form, mrn: e.target.value })}
              required
            />
          </label>
          <label>
            First Name
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </label>
          <label>
            Last Name
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </label>
          <label>
            Date of Birth
            <input
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              required
            />
          </label>
          <label>
            Gender
            <input value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
          </label>
          <button type="submit">Add Patient</button>
        </form>
      ) : (
        <div className="card">
          <h3>Read-only access</h3>
          <p className="muted">You can view patients but cannot add or edit records.</p>
        </div>
      )}

      <div className="table-actions">
        <span className="muted">Page {page} of {totalPages}</span>
        <div className="pager">
          <button
            className="ghost"
            disabled={page <= 1}
            onClick={() => fetchPatients(page - 1, query)}
          >
            Prev
          </button>
          <button
            className="ghost"
            disabled={page >= totalPages}
            onClick={() => fetchPatients(page + 1, query)}
          >
            Next
          </button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>MRN</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <>
              <tr className="skeleton-row">
                <td colSpan={4} />
              </tr>
              <tr className="skeleton-row">
                <td colSpan={4} />
              </tr>
              <tr className="skeleton-row">
                <td colSpan={4} />
              </tr>
            </>
          ) : patients.length === 0 ? (
            <tr>
              <td colSpan={4} className="muted">
                No patients found{query ? ` for "${query}"` : ""}.
              </td>
            </tr>
          ) : (
            patients.map((p) => (
              <tr key={p.id}>
                <td>{p.mrn}</td>
                <td>{p.firstName} {p.lastName}</td>
                <td>{new Date(p.dob).toLocaleDateString()}</td>
                <td>{p.gender ?? "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
