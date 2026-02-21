import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useSearch } from "../search/SearchContext";

type Admission = {
  id: number;
  diagnosis: string;
  attendingPhysician: string;
  admittedAt: string;
  patient: { firstName: string; lastName: string; mrn: string };
};

type Patient = { id: number; firstName: string; lastName: string; mrn: string };

type PageResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};

export default function Admissions() {
  const { user } = useAuth();
  const { query } = useSearch();
  const canWrite = user?.role === "ADMIN" || user?.role === "DOCTOR";
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const limit = 10;
  const [form, setForm] = useState({
    patientId: 1,
    diagnosis: "",
    attendingPhysician: ""
  });

  useEffect(() => {
    fetchAdmissions(1, query);
  }, [query]);

  useEffect(() => {
    if (!canWrite) {
      return;
    }
    api.get<PageResponse<Patient>>(`/patients?page=1&limit=100`).then((res) => {
      const list = res.data.data;
      setPatients(list);
      if (list.length > 0) {
        setForm((prev) => ({ ...prev, patientId: list[0].id }));
      }
    });
  }, [canWrite]);

  async function fetchAdmissions(nextPage: number, q: string) {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<PageResponse<Admission>>(
        `/admissions?page=${nextPage}&limit=${limit}&q=${encodeURIComponent(q)}`
      );
      setAdmissions(res.data.data);
      setPage(res.data.page);
      setTotal(res.data.total);
    } catch (err: any) {
      const message = err?.response?.data?.error;
      setError(typeof message === "string" ? message : "Failed to load admissions");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/admissions", form);
      await fetchAdmissions(1, query);
    } catch (err: any) {
      const message = err?.response?.data?.error;
      setError(typeof message === "string" ? message : "Failed to create admission");
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section>
      <header className="page-header">
        <h2>Admissions</h2>
        <p>Track patient admissions for discharge workflow.</p>
      </header>

      {canWrite ? (
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Patient
            <select
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: Number(e.target.value) })}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.mrn} - {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Diagnosis
            <input
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
            />
          </label>
          <label>
            Attending Physician
            <input
              value={form.attendingPhysician}
              onChange={(e) => setForm({ ...form, attendingPhysician: e.target.value })}
            />
          </label>
          <button type="submit">Create Admission</button>
        </form>
      ) : (
        <div className="card">
          <h3>Read-only access</h3>
          <p className="muted">You can view admissions but cannot create or edit them.</p>
        </div>
      )}

      <div className="table-actions">
        <span className="muted">Page {page} of {totalPages}</span>
        <div className="pager">
          <button
            className="ghost"
            disabled={page <= 1}
            onClick={() => fetchAdmissions(page - 1, query)}
          >
            Prev
          </button>
          <button
            className="ghost"
            disabled={page >= totalPages}
            onClick={() => fetchAdmissions(page + 1, query)}
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
            <th>Patient</th>
            <th>Diagnosis</th>
            <th>Physician</th>
            <th>Admitted</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <>
              <tr className="skeleton-row">
                <td colSpan={5} />
              </tr>
              <tr className="skeleton-row">
                <td colSpan={5} />
              </tr>
              <tr className="skeleton-row">
                <td colSpan={5} />
              </tr>
            </>
          ) : admissions.length === 0 ? (
            <tr>
              <td colSpan={5} className="muted">
                No admissions found{query ? ` for "${query}"` : ""}.
              </td>
            </tr>
          ) : (
            admissions.map((a) => (
              <tr key={a.id}>
                <td>{a.patient.mrn}</td>
                <td>{a.patient.firstName} {a.patient.lastName}</td>
                <td>{a.diagnosis}</td>
                <td>{a.attendingPhysician}</td>
                <td>{new Date(a.admittedAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
