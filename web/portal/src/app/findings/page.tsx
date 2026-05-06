"use client";

import { useCallback, useEffect, useState } from "react";
import { tenantGet } from "@/lib/api";
import { loadSession } from "@/lib/auth";

type Row = {
  id: string;
  severity: string;
  category: string;
  rule_id: string | null;
  source: string;
  file_path: string;
  line_number: number | null;
  message: string;
  was_actioned: boolean;
  pr_merge_status: string;
  created_at: string;
};

type Page = {
  total_count: number;
  items: Row[];
};

export default function FindingsPage() {
  const [severity, setSeverity] = useState("");
  const [file, setFile] = useState("");
  const [rule, setRule] = useState("");
  const [data, setData] = useState<Page | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const s = loadSession();
    if (!s) return;
    setLoading(true);
    const q = new URLSearchParams();
    if (severity) q.set("severity", severity);
    if (file) q.set("file", file);
    if (rule) q.set("rule_id", rule);
    q.set("take", "100");
    const res = await tenantGet(s.tenantId, s.apiKey, `/findings?${q.toString()}`);
    if (!res.ok) {
      setErr(`Failed (${res.status})`);
      setLoading(false);
      return;
    }
    setData((await res.json()) as Page);
    setErr(null);
    setLoading(false);
  }, [severity, file, rule]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="eq-pagehead">
        <div>
          <div
            className="eq-text-xs eq-text-muted"
            style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            Findings
          </div>
          <h1 className="eq-h2" style={{ marginTop: 10 }}>
            All findings
          </h1>
          <p className="eq-text-sm eq-text-muted" style={{ margin: "10px 0 0" }}>
            Filter by severity, file path fragment, or rule ID.
          </p>
        </div>
      </div>

      <div className="eq-card" style={{ marginBottom: 16 }}>
        <div className="eq-grid-3">
          <div>
            <label className="eq-text-sm eq-text-muted">Severity</label>
            <input
              placeholder="e.g. error"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="eq-input"
              style={{ marginTop: 8 }}
            />
          </div>
          <div>
            <label className="eq-text-sm eq-text-muted">File contains</label>
            <input
              placeholder="e.g. Controllers/"
              value={file}
              onChange={(e) => setFile(e.target.value)}
              className="eq-input"
              style={{ marginTop: 8 }}
            />
          </div>
          <div>
            <label className="eq-text-sm eq-text-muted">Rule ID</label>
            <input
              placeholder="e.g. CA001"
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              className="eq-input"
              style={{ marginTop: 8 }}
            />
          </div>
        </div>

        <div className="eq-row" style={{ justifyContent: "space-between", marginTop: 14, flexWrap: "wrap" }}>
          <div className="eq-text-sm eq-text-dim">
            {data ? (
              <>
                <span className="eq-font-mono">{data.total_count}</span> total · showing{" "}
                <span className="eq-font-mono">{data.items.length}</span>
              </>
            ) : (
              <span className="eq-text-dim">—</span>
            )}
          </div>

          <button type="button" onClick={() => load()} className="eq-btn eq-btn--primary" disabled={loading}>
            {loading ? "Loading…" : "Apply"}
          </button>
        </div>
      </div>

      {err && (
        <div className="eq-card" style={{ borderColor: "rgba(239, 68, 68, 0.35)", padding: 14, marginBottom: 16 }}>
          <div className="eq-text-sm" style={{ color: "var(--eq-red)" }}>
            {err}
          </div>
        </div>
      )}

      {loading && (
        <div className="eq-card">
          <div className="eq-skeleton" style={{ height: 12, width: 240 }} />
          <div className="eq-skeleton" style={{ height: 12, width: 520, marginTop: 10 }} />
          <div className="eq-skeleton" style={{ height: 12, width: 380, marginTop: 10 }} />
        </div>
      )}

      {!loading && data && data.items.length === 0 && (
        <div className="eq-card" style={{ textAlign: "center", padding: 36 }}>
          <div className="eq-text-md" style={{ fontWeight: 600 }}>
            No findings match your filters
          </div>
          <div className="eq-text-sm eq-text-muted" style={{ marginTop: 10 }}>
            Try clearing severity, file, and rule filters.
          </div>
        </div>
      )}

      {!loading && data && data.items.length > 0 && (
        <div className="eq-card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="eq-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 16 }}>When</th>
                <th>Severity</th>
                <th>Rule</th>
                <th>File</th>
                <th style={{ paddingRight: 16 }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((r) => {
                const sev = r.severity.toLowerCase();
                const badge =
                  sev.includes("error") || sev.includes("critical") || sev.includes("high")
                    ? "eq-badge--red"
                    : sev.includes("warn") || sev.includes("medium")
                      ? "eq-badge--amber"
                      : "eq-badge--grey";
                return (
                  <tr key={r.id}>
                    <td style={{ paddingLeft: 16 }} className="eq-text-sm eq-text-dim">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td>
                      <span className={`eq-badge ${badge}`}>{r.severity}</span>
                    </td>
                    <td className="eq-text-sm eq-text-muted">{r.rule_id ?? "—"}</td>
                    <td className="eq-text-sm eq-font-mono" style={{ maxWidth: 420, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.file_path}
                    </td>
                    <td style={{ paddingRight: 16 }} className="eq-text-sm eq-text-muted">
                      {r.message}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
