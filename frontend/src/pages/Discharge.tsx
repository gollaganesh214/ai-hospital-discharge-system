import { useEffect, useState } from "react";
import { api } from "../api/client";
import { jsPDF } from "jspdf";

type Admission = {
  id: number;
  patient: { firstName: string; lastName: string; mrn: string };
};

type Discharge = {
  id: number;
  summaryText: string;
  medications: string;
  followUp: string;
  createdAt: string;
  admission: Admission;
};

type PageResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};

export default function Discharge() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [discharges, setDischarges] = useState<Discharge[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;
  const [form, setForm] = useState({
    admissionId: 1,
    finalDiagnosis: "",
    keyFindings: "",
    medications: "",
    followUp: ""
  });
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    api.get<PageResponse<Admission>>("/admissions?page=1&limit=100").then((res) => {
      const list = res.data.data;
      setAdmissions(list);
      if (list.length > 0) {
        setForm((prev) => ({ ...prev, admissionId: list[0].id }));
      }
    });
    fetchDischarges(1);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await api.post("/discharges", form);
    setResponse(res.data.summaryText ?? "Created discharge summary.");
    await fetchDischarges(1);
  }

  async function fetchDischarges(nextPage: number) {
    setLoading(true);
    const list = await api.get<PageResponse<Discharge>>(`/discharges?page=${nextPage}&limit=${limit}`);
    setDischarges(list.data.data);
    setPage(list.data.page);
    setTotal(list.data.total);
    setLoading(false);
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  function downloadPdf(discharge: Discharge) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("AI Powered Smart Hospital Management System", 14, 20);
    doc.setFontSize(11);
    doc.text(`Patient: ${discharge.admission.patient.firstName} ${discharge.admission.patient.lastName}`, 14, 32);
    doc.text(`Date: ${new Date(discharge.createdAt).toLocaleString()}`, 14, 40);
    doc.text("Summary:", 14, 52);
    const lines = doc.splitTextToSize(discharge.summaryText, 180);
    doc.text(lines, 14, 60);
    doc.text(`Medications: ${discharge.medications}`, 14, 90);
    doc.text(`Follow-up: ${discharge.followUp}`, 14, 98);
    doc.save(`discharge-${discharge.id}.pdf`);
  }

  return (
    <section>
      <header className="page-header">
        <h2>Discharge Summary</h2>
        <p>Generate AI-assisted discharge notes.</p>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Admission
          <select
            value={form.admissionId}
            onChange={(e) => setForm({ ...form, admissionId: Number(e.target.value) })}
          >
            {admissions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.patient.mrn} - {a.patient.firstName} {a.patient.lastName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Final Diagnosis
          <input
            type="text"
            value={form.finalDiagnosis}
            onChange={(e) => setForm({ ...form, finalDiagnosis: e.target.value })}
          />
        </label>
        <label>
          Key Findings
          <input
            type="text"
            value={form.keyFindings}
            onChange={(e) => setForm({ ...form, keyFindings: e.target.value })}
          />
        </label>
        <label>
          Medications
          <input
            type="text"
            value={form.medications}
            onChange={(e) => setForm({ ...form, medications: e.target.value })}
          />
        </label>
        <label>
          Follow-up
          <input
            type="text"
            value={form.followUp}
            onChange={(e) => setForm({ ...form, followUp: e.target.value })}
          />
        </label>
        <button type="submit">Generate Summary</button>
      </form>

      {response && (
        <div className="summary">
          <h3>AI Summary</h3>
          <p>{response}</p>
        </div>
      )}

      <div className="table-actions">
        <span className="muted">Page {page} of {totalPages}</span>
        <div className="pager">
          <button className="ghost" disabled={page <= 1} onClick={() => fetchDischarges(page - 1)}>
            Prev
          </button>
          <button className="ghost" disabled={page >= totalPages} onClick={() => fetchDischarges(page + 1)}>
            Next
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Summary</th>
            <th>Medications</th>
            <th>Follow-up</th>
            <th>Date</th>
            <th>Export</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <>
              <tr className="skeleton-row">
                <td colSpan={6} />
              </tr>
              <tr className="skeleton-row">
                <td colSpan={6} />
              </tr>
              <tr className="skeleton-row">
                <td colSpan={6} />
              </tr>
            </>
          ) : (
            discharges.map((d) => (
              <tr key={d.id}>
                <td>{d.admission.patient.firstName} {d.admission.patient.lastName}</td>
                <td>{d.summaryText}</td>
                <td>{d.medications}</td>
                <td>{d.followUp}</td>
                <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="ghost" onClick={() => downloadPdf(d)}>
                    PDF
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
