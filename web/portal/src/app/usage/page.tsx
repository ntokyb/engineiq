"use client";

import { useEffect, useState } from "react";
import { tenantGet } from "@/lib/api";
import { loadSession } from "@/lib/auth";

type Usage = {
  days: number;
  completed_reviews: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_estimated_cost_zar: number;
};

export default function UsagePage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Usage | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s) return;
    (async () => {
      const res = await tenantGet(s.tenantId, s.apiKey, `/usage?days=${days}`);
      if (!res.ok) {
        setErr(`Could not load usage (${res.status})`);
        setData(null);
        return;
      }
      setData((await res.json()) as Usage);
      setErr(null);
    })();
  }, [days]);

  return (
    <div>
      <div className="eq-pagehead">
        <div>
          <div
            className="eq-text-xs eq-text-muted"
            style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            Billing signals
          </div>
          <h1 className="eq-h2" style={{ marginTop: 10 }}>
            Usage
          </h1>
          <p className="eq-text-sm eq-text-muted" style={{ margin: "10px 0 0" }}>
            Aggregates completed reviews only — aligned with token metadata stored per job.
          </p>
        </div>
        <div>
          <label className="eq-text-xs eq-text-muted" htmlFor="usage-days">
            Period (days)
          </label>
          <select
            id="usage-days"
            className="eq-input"
            style={{ marginTop: 6, minWidth: 120 }}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            {[7, 30, 90].map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </select>
        </div>
      </div>

      {err && (
        <div className="eq-card" style={{ borderColor: "rgba(239, 68, 68, 0.35)", padding: 14 }}>
          <div className="eq-text-sm" style={{ color: "var(--eq-red)" }}>
            {err}
          </div>
        </div>
      )}

      {!data && !err && (
        <div className="eq-grid-2">
          <div className="eq-card">
            <div className="eq-skeleton" style={{ height: 12, width: 120 }} />
            <div className="eq-skeleton" style={{ height: 28, width: 80, marginTop: 12 }} />
          </div>
        </div>
      )}

      {data && (
        <>
          <div className="eq-grid-3">
            <div className="eq-card">
              <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Completed reviews
              </div>
              <div className="eq-text-2xl" style={{ marginTop: 12, fontWeight: 600 }}>
                {data.completed_reviews}
              </div>
              <p className="eq-text-xs eq-text-dim" style={{ marginTop: 8 }}>
                Last {data.days} days · UTC window on server
              </p>
            </div>
            <div className="eq-card">
              <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Tokens (in / out)
              </div>
              <div className="eq-text-lg eq-font-mono" style={{ marginTop: 12, fontWeight: 600 }}>
                {data.total_input_tokens.toLocaleString()} / {data.total_output_tokens.toLocaleString()}
              </div>
            </div>
            <div className="eq-card">
              <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Est. cost (ZAR)
              </div>
              <div className="eq-text-2xl" style={{ marginTop: 12, fontWeight: 600, color: "var(--eq-accent-light)" }}>
                {data.total_estimated_cost_zar.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="eq-card" style={{ marginTop: 16 }}>
            <p className="eq-text-sm eq-text-muted">
              Compliance-oriented audit rows (timestamp, PR, repo, counts, tokens, cost — no finding body):{" "}
              <span className="eq-font-mono eq-text-xs">{"GET /api/v1/tenant/{id}/audit"}</span> with your API key.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
