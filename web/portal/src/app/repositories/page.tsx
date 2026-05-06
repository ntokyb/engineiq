"use client";

import { useEffect, useState } from "react";
import { tenantGet } from "@/lib/api";
import { loadSession } from "@/lib/auth";

type RepoRow = {
  id: string;
  full_name: string;
  job_count: number;
};

export default function RepositoriesPage() {
  const [rows, setRows] = useState<RepoRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s) return;
    (async () => {
      const res = await tenantGet(s.tenantId, s.apiKey, "/repositories");
      if (!res.ok) {
        setErr(`Could not load repositories (${res.status})`);
        return;
      }
      setRows((await res.json()) as RepoRow[]);
    })();
  }, []);

  return (
    <div>
      <div className="eq-pagehead">
        <div>
          <div
            className="eq-text-xs eq-text-muted"
            style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            Code hosts
          </div>
          <h1 className="eq-h2" style={{ marginTop: 10 }}>
            Repositories
          </h1>
          <p className="eq-text-sm eq-text-muted" style={{ margin: "10px 0 0" }}>
            Repositories seen through GitHub App webhooks (job counts are tenant-scoped).
          </p>
        </div>
      </div>

      {err && (
        <div className="eq-card" style={{ borderColor: "rgba(239, 68, 68, 0.35)", padding: 14 }}>
          <div className="eq-text-sm" style={{ color: "var(--eq-red)" }}>
            {err}
          </div>
        </div>
      )}

      {!rows && !err && (
        <div className="eq-card">
          <div className="eq-skeleton" style={{ height: 14, width: "60%" }} />
        </div>
      )}

      {rows && (
        <div className="eq-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="eq-table">
              <thead>
                <tr>
                  <th>Full name</th>
                  <th>Jobs</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="eq-text-sm eq-text-muted" style={{ padding: 24 }}>
                      No repositories yet — complete GitHub App installation and open a PR.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id}>
                      <td className="eq-font-mono eq-text-sm">{r.full_name}</td>
                      <td className="eq-text-sm">{r.job_count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
