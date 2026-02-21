import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

type Patient = { id: number; firstName: string; lastName: string; mrn: string };
type Lab = {
  id: number;
  testName: string;
  result: string;
  unit?: string;
  normalRange?: string;
  status: string;
  collectedAt: string;
  reportedAt?: string;
  patient: Patient;
};

type PageResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};

export default function Labs() {
  const { user } = useAuth();
  const canWrite = user?.role === "ADMIN" || user?.role === "DOCTOR";
  const [labs, setLabs] = useState<Lab[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;
  const [form, setForm] = useState({
    patientId: 1,
    testName: "",
    result: "",
    unit: "",
    normalRange: "",
    status: "PENDING"
  });

  useEffect(() => {
    fetchLabs(1);
    if (canWrite) {
      api.get<PageResponse<Patient>>("/patients?page=1&limit=100").then((res) => {
        const list = res.data.data;
        setPatients(list);
        if (list.length > 0) {
          setForm((prev) => ({ ...prev, patientId: list[0].id }));
        }
      });
    }
  }, [canWrite]);

  async function fetchLabs(nextPage: number) {
    setLoading(true);
    const res = await api.get<PageResponse<Lab>>(`/labs?page=${nextPage}&limit=${limit}`);
    setLabs(res.data.data);
    setPage(res.data.page);
    setTotal(res.data.total);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/labs", form);
    await fetchLabs(1);
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section>
      <header className="page-header">
        <h2>Laboratory</h2>
        <p>Track lab tests and results.</p>
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
            Test Name
            <input value={form.testName} onChange={(e) => setForm({ ...form, testName: e.target.value })} />
          </label>
          <label>
            Result
            <input value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} />
          </label>
          <label>
            Unit
            <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </label>
          <label>
            Normal Range
            <input value={form.normalRange} onChange={(e) => setForm({ ...form, normalRange: e.target.value })} />
          </label>
          <label>
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="ABNORMAL">ABNORMAL</option>
            </select>
          </label>
          <button type="submit">Create Lab</button>
        </form>
      ) : (
        <div className="card">
          <h3>Read-only access</h3>
          <p className="muted">You can view lab reports but cannot create or edit them.</p>
        </div>
      )}

      <div className="table-actions">
        <span className="muted">Page {page} of {totalPages}</span>
        <div className="pager">
          <button className="ghost" disabled={page <= 1} onClick={() => fetchLabs(page - 1)}>
            Prev
          </button>
          <button className="ghost" disabled={page >= totalPages} onClick={() => fetchLabs(page + 1)}>
            Next
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Test</th>
            <th>Result</th>
            <th>Unit</th>
            <th>Range</th>
            <th>Status</th>
            <th>Collected</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <>
              <tr className="skeleton-row">
                <td colSpan={7} />
              </tr>
              <tr className="skeleton-row">
                <td colSpan={7} />
              </tr>
              <tr className="skeleton-row">
                <td colSpan={7} />
              </tr>
            </>
          ) : (
            labs.map((lab) => (
              <tr key={lab.id}>
                <td>{lab.patient.firstName} {lab.patient.lastName}</td>
                <td>{lab.testName}</td>
                <td>{lab.result}</td>
                <td>{lab.unit ?? "-"}</td>
                <td>{lab.normalRange ?? "-"}</td>
                <td>{lab.status}</td>
                <td>{new Date(lab.collectedAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
