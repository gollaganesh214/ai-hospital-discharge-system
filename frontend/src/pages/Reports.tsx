import { useEffect, useState } from "react";
import { api } from "../api/client";

type ReportSummary = {
  patients: number;
  admissions: number;
  discharges: number;
  users: number;
  generatedAt: string;
};

export default function Reports() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);

  useEffect(() => {
    api.get<ReportSummary>("/reports/summary").then((res) => setSummary(res.data));
  }, []);

  return (
    <section>
      <header className="page-header">
        <h2>Reports</h2>
        <p>Operational metrics for leadership review.</p>
      </header>

      <div className="cards">
        <div className="card">
          <h3>Patients</h3>
          <p className="metric">{summary?.patients ?? "-"}</p>
        </div>
        <div className="card">
          <h3>Admissions</h3>
          <p className="metric">{summary?.admissions ?? "-"}</p>
        </div>
        <div className="card">
          <h3>Discharge Summaries</h3>
          <p className="metric">{summary?.discharges ?? "-"}</p>
        </div>
        <div className="card">
          <h3>Users</h3>
          <p className="metric">{summary?.users ?? "-"}</p>
        </div>
      </div>

      <p className="muted">Generated at: {summary?.generatedAt ?? "loading..."}</p>
    </section>
  );
}
