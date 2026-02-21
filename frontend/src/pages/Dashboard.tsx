import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

type Summary = {
  patients: number;
  admissions: number;
  discharges: number;
  users: number;
};

type Discharge = {
  id: number;
  createdAt: string;
  admission: {
    patient: { firstName: string; lastName: string };
  };
  summaryText: string;
};

type PageResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recent, setRecent] = useState<Discharge[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    setLoadingSummary(true);
    setLoadingRecent(true);
    if (user?.role === "ADMIN") {
      api
        .get<Summary>("/reports/summary")
        .then((res) => setSummary(res.data))
        .finally(() => setLoadingSummary(false));
    } else {
      setSummary(null);
      setLoadingSummary(false);
    }

    if (user?.role === "ADMIN" || user?.role === "DOCTOR") {
      api
        .get<PageResponse<Discharge>>("/discharges?page=1&limit=5")
        .then((res) => setRecent(res.data.data))
        .finally(() => setLoadingRecent(false));
    } else {
      setRecent([]);
      setLoadingRecent(false);
    }
  }, [user?.role]);

  const barData = [18, 32, 24, 40, 28, 35, 22, 30, 26, 38, 29, 33];
  const lineData = [14, 18, 15, 22, 21, 24, 19, 26, 23, 28, 25, 30];

  return (
    <section>
      <header className="page-header">
        <h2>Dashboard</h2>
        <p>Quick overview of current activity.</p>
      </header>

      <div className="cards">
        {loadingSummary ? (
          <>
            <div className="card stat-card stat-primary skeleton-card" />
            <div className="card stat-card stat-accent skeleton-card" />
            <div className="card stat-card stat-soft skeleton-card" />
            <div className="card stat-card skeleton-card" />
          </>
        ) : (
          <>
            <div className="card stat-card stat-primary">
              <div>
                <h3>Total Patients</h3>
                <p className="metric">{summary?.patients ?? "-"}</p>
              </div>
              <span className="pill">+8.2%</span>
            </div>
            <div className="card stat-card stat-accent">
              <div>
                <h3>Admissions</h3>
                <p className="metric">{summary?.admissions ?? "-"}</p>
              </div>
              <span className="pill">Today</span>
            </div>
            <div className="card stat-card stat-soft">
              <div>
                <h3>Discharge Summaries</h3>
                <p className="metric">{summary?.discharges ?? "-"}</p>
              </div>
              <span className="pill">AI assisted</span>
            </div>
            <div className="card stat-card">
              <div>
                <h3>Active Users</h3>
                <p className="metric">{summary?.users ?? "-"}</p>
              </div>
              <span className="pill">+3</span>
            </div>
          </>
        )}
      </div>

      <div className="chart-grid">
        <div className="card chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Admissions vs Discharges</h3>
              <p className="muted">Last 12 weeks</p>
            </div>
            <span className="badge">Weekly</span>
          </div>
          <div className="bar-chart">
            {barData.map((v, i) => (
              <div key={i} className="bar" style={{ height: `${v * 2.2}px` }} />
            ))}
          </div>
        </div>

        <div className="card chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">AI Summary Utilization</h3>
              <p className="muted">Last 12 weeks</p>
            </div>
            <span className="badge">Trend</span>
          </div>
          <svg className="line-chart" viewBox="0 0 300 120">
            <polyline
              fill="none"
              stroke="#6b63ff"
              strokeWidth="3"
              points={lineData
                .map((v, i) => `${i * 25},${110 - v * 3}`)
                .join(" ")}
            />
            <circle cx="275" cy={110 - lineData[lineData.length - 1] * 3} r="4" fill="#6b63ff" />
          </svg>
          <div className="chart-legend">
            <span className="legend-dot" />
            <span className="muted">AI summaries per week</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Recent Discharges</h3>
            <p className="muted">Latest 5 summaries</p>
          </div>
          <span className="badge">Live</span>
        </div>
        <div className="activity-list">
          {loadingRecent ? (
            <>
              <div className="activity-item skeleton-line" />
              <div className="activity-item skeleton-line" />
              <div className="activity-item skeleton-line" />
            </>
          ) : (
            recent.map((d) => (
              <div key={d.id} className="activity-item">
                <div className="activity-meta">
                  <strong>{d.admission.patient.firstName} {d.admission.patient.lastName}</strong>
                  <span className="muted">{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="muted">{d.summaryText.slice(0, 90)}...</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
