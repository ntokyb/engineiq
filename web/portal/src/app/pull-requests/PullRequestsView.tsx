"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { tenantGet } from "@/lib/api";
import { loadSession } from "@/lib/auth";

type JobRow = {
  job_id: string;
  repository_full_name: string;
  pr_number: number;
  status: string;
  created_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  findings_count: number;
  input_tokens: number;
  output_tokens: number;
  estimated_cost_zar: number | null;
};

type JobsPage = {
  total_count: number;
  items: JobRow[];
};

function statusBadgeClass(status: string) {
  switch (status) {
    case "Completed":
      return "eq-badge eq-badge--green";
    case "Processing":
      return "eq-badge eq-badge--purple";
    case "Queued":
      return "eq-badge eq-badge--grey";
    case "Failed":
      return "eq-badge eq-badge--red";
    default:
      return "eq-badge eq-badge--grey";
  }
}

export function PullRequestsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedJobId = searchParams.get("job");

  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState<JobsPage | null>(null);
  const [detail, setDetail] = useState<JobRow | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailErr, setDetailErr] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    const s = loadSession();
    if (!s) return;
    setLoading(true);
    const q = new URLSearchParams();
    q.set("take", "50");
    q.set("skip", "0");
    if (statusFilter) q.set("status", statusFilter);
    const res = await tenantGet(s.tenantId, s.apiKey, `/jobs?${q.toString()}`);
    if (!res.ok) {
      setErr(`Could not load jobs (${res.status})`);
      setLoading(false);
      return;
    }
    setPage((await res.json()) as JobsPage);
    setErr(null);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    if (!selectedJobId) {
      setDetail(null);
      setDetailErr(null);
      return;
    }
    const s = loadSession();
    if (!s) return;
    (async () => {
      const res = await tenantGet(s.tenantId, s.apiKey, `/jobs/${selectedJobId}`);
      if (!res.ok) {
        setDetail(null);
        setDetailErr(`Job not found or inaccessible (${res.status})`);
        return;
      }
      setDetail((await res.json()) as JobRow);
      setDetailErr(null);
    })();
  }, [selectedJobId]);

  function openJob(id: string) {
    router.push(`/pull-requests?job=${encodeURIComponent(id)}`);
  }

  function closeDetail() {
    router.push("/pull-requests");
  }

  return (
    <div>
      <div className="eq-pagehead">
        <div>
          <div
            className="eq-text-xs eq-text-muted"
            style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            Reviews
          </div>
          <h1 className="eq-h2" style={{ marginTop: 10 }}>
            Pull requests
          </h1>
          <p className="eq-text-sm eq-text-muted" style={{ margin: "10px 0 0" }}>
            Review jobs queued from GitHub webhooks — metadata only (no diff content).
          </p>
        </div>
      </div>

      <div className="eq-card" style={{ marginBottom: 16 }}>
        <label className="eq-text-sm eq-text-muted">Status</label>
        <select
          className="eq-input"
          style={{ marginTop: 8, maxWidth: 280 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by job status"
        >
          <option value="">All</option>
          <option value="Queued">Queued</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {err && (
        <div className="eq-card" style={{ borderColor: "rgba(239, 68, 68, 0.35)", padding: 14, marginBottom: 16 }}>
          <div className="eq-text-sm" style={{ color: "var(--eq-red)" }}>
            {err}
          </div>
        </div>
      )}

      {loading && !page && (
        <div className="eq-card">
          <div className="eq-skeleton" style={{ height: 14, width: "100%" }} />
        </div>
      )}

      {page && (
        <div className="eq-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="eq-table">
              <thead>
                <tr>
                  <th>Repo</th>
                  <th>PR</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Findings</th>
                </tr>
              </thead>
              <tbody>
                {page.items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="eq-text-sm eq-text-muted" style={{ padding: 24 }}>
                      No jobs yet — open a PR after installing the GitHub App.
                    </td>
                  </tr>
                ) : (
                  page.items.map((j) => (
                    <tr
                      key={j.job_id}
                      style={{ cursor: "pointer" }}
                      onClick={() => openJob(j.job_id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openJob(j.job_id);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Job ${j.job_id} for PR ${j.pr_number}`}
                    >
                      <td className="eq-font-mono eq-text-sm">{j.repository_full_name}</td>
                      <td className="eq-text-sm">{j.pr_number}</td>
                      <td>
                        <span className={statusBadgeClass(j.status)}>{j.status}</span>
                      </td>
                      <td className="eq-text-xs eq-text-dim">{new Date(j.created_at).toLocaleString()}</td>
                      <td className="eq-text-sm">{j.findings_count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="eq-text-xs eq-text-dim" style={{ padding: "12px 16px", borderTop: "1px solid var(--eq-border)" }}>
            Showing {page.items.length} of {page.total_count}
          </div>
        </div>
      )}

      {(selectedJobId || detail || detailErr) && (
        <div className="eq-card" style={{ marginTop: 16 }}>
          <div className="eq-row" style={{ alignItems: "center", marginBottom: 16 }}>
            <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Job detail
            </div>
            <button type="button" className="eq-btn eq-btn--secondary" onClick={closeDetail}>
              Close
            </button>
          </div>

          {detailErr && (
            <div className="eq-text-sm" style={{ color: "var(--eq-red)" }}>
              {detailErr}
            </div>
          )}

          {detail && (
            <div style={{ display: "grid", gap: 12 }}>
              <div className="eq-row">
                <span className="eq-text-sm eq-text-muted">Job ID</span>
                <span className="eq-font-mono eq-text-sm">{detail.job_id}</span>
              </div>
              <div className="eq-row">
                <span className="eq-text-sm eq-text-muted">Repository</span>
                <span className="eq-font-mono eq-text-sm">{detail.repository_full_name}</span>
              </div>
              <div className="eq-row">
                <span className="eq-text-sm eq-text-muted">PR</span>
                <span className="eq-text-sm">{detail.pr_number}</span>
              </div>
              <div className="eq-row">
                <span className="eq-text-sm eq-text-muted">Status</span>
                <span className={statusBadgeClass(detail.status)}>{detail.status}</span>
              </div>
              <div className="eq-row">
                <span className="eq-text-sm eq-text-muted">Created</span>
                <span className="eq-text-sm">{new Date(detail.created_at).toLocaleString()}</span>
              </div>
              <div className="eq-row">
                <span className="eq-text-sm eq-text-muted">Completed</span>
                <span className="eq-text-sm">
                  {detail.completed_at ? new Date(detail.completed_at).toLocaleString() : "—"}
                </span>
              </div>
              <div className="eq-row">
                <span className="eq-text-sm eq-text-muted">Duration</span>
                <span className="eq-text-sm">{detail.duration_ms != null ? `${detail.duration_ms} ms` : "—"}</span>
              </div>
              <div className="eq-row">
                <span className="eq-text-sm eq-text-muted">Findings (metadata)</span>
                <span className="eq-text-sm">{detail.findings_count}</span>
              </div>
              <div className="eq-row">
                <span className="eq-text-sm eq-text-muted">Tokens in / out</span>
                <span className="eq-font-mono eq-text-sm">
                  {detail.input_tokens} / {detail.output_tokens}
                </span>
              </div>
              <div className="eq-row">
                <span className="eq-text-sm eq-text-muted">Est. cost (ZAR)</span>
                <span className="eq-text-sm">
                  {detail.estimated_cost_zar != null ? detail.estimated_cost_zar.toFixed(4) : "—"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
