import { useState } from "react";

export default function Settings() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  return (
    <section>
      <header className="page-header">
        <h2>Settings</h2>
        <p>Configure system behavior and AI assistance.</p>
      </header>

      <div className="card">
        <label className="toggle">
          <input
            type="checkbox"
            checked={aiEnabled}
            onChange={() => setAiEnabled((v) => !v)}
          />
          Enable AI discharge drafting
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={autoNotify}
            onChange={() => setAutoNotify((v) => !v)}
          />
          Auto-notify care teams on discharge
        </label>
      </div>
    </section>
  );
}
