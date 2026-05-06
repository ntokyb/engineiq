"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { tenantGet } from "@/lib/api";
import { loadSession } from "@/lib/auth";
import { useToasts } from "@/components/Toasts";

type Analytics = {
  prs_reviewed_in_period: number;
  violations_in_period: number;
  architecture_drift_score: number;
  architecture_drift_note: string;
  prs_reviewed_per_day: { date: string; count: number }[];
  violations_per_day: { date: string; count: number }[];
};

export default function ReportsPage() {
  const { pushToast } = useToasts();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [company, setCompany] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (!s) return;
    (async () => {
      const [a, acc] = await Promise.all([
        tenantGet(s.tenantId, s.apiKey, "/analytics?days=30"),
        tenantGet(s.tenantId, s.apiKey, "/account"),
      ]);
      if (a.ok) setAnalytics((await a.json()) as Analytics);
      else setErr(`Failed to load analytics (${a.status})`);
      if (acc.ok) {
        const j = (await acc.json()) as { company_name: string };
        setCompany(j.company_name);
      }
    })();
  }, []);

  function downloadPdf() {
    if (!analytics) return;
    setBusy(true);
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("EngineIQ — 30-day summary", 14, 20);
    doc.setFontSize(11);
    doc.text(`Organisation: ${company || "—"}`, 14, 30);
    doc.text(`Generated: ${new Date().toISOString().slice(0, 10)} (UTC)`, 14, 37);
    doc.text(`PRs reviewed: ${analytics.prs_reviewed_in_period}`, 14, 48);
    doc.text(`Violations logged: ${analytics.violations_in_period}`, 14, 55);
    doc.text(`Architecture drift score: ${analytics.architecture_drift_score}`, 14, 62);
    const lines = doc.splitTextToSize(analytics.architecture_drift_note, 180);
    doc.text(lines, 14, 69);

    const rows = analytics.prs_reviewed_per_day.map((p, i) => [
      p.date,
      String(p.count),
      String(analytics.violations_per_day[i]?.count ?? 0),
    ]);
    autoTable(doc, {
      startY: 82,
      head: [["Date", "PRs reviewed", "Violations"]],
      body: rows,
      theme: "striped",
      headStyles: { fillColor: [20, 184, 166] },
    });

    doc.save(`engineiq-report-30d-${new Date().toISOString().slice(0, 10)}.pdf`);
    setBusy(false);
    pushToast({ kind: "success", title: "Report downloaded", message: "Your 30-day PDF was generated in the browser." });
  }

  return (
    <div>
      <div className="eq-pagehead">
        <div>
          <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Reports
          </div>
          <h1 className="eq-h2" style={{ marginTop: 10 }}>
            30-day PDF summary
          </h1>
          <p className="eq-text-sm eq-text-muted" style={{ margin: "10px 0 0", maxWidth: 720 }}>
            Generated in your browser (no server-side PDF engine). Contains analytics only — no source code.
          </p>
        </div>
      </div>

      {err && (
        <div className="eq-card" style={{ borderColor: "rgba(239, 68, 68, 0.35)", padding: 14, marginBottom: 16 }}>
          <div className="eq-text-sm" style={{ color: "var(--eq-red)" }}>
            {err}
          </div>
        </div>
      )}

      <div className="eq-grid-2">
        <div className="eq-card">
          <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Included
          </div>
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            <div className="eq-row">
              <span className="eq-badge eq-badge--grey">Organisation</span>
              <span className="eq-font-mono eq-text-sm">{company || "—"}</span>
            </div>
            <div className="eq-row">
              <span className="eq-badge eq-badge--grey">PRs reviewed</span>
              <span className="eq-font-mono eq-text-sm">{analytics?.prs_reviewed_in_period ?? "—"}</span>
            </div>
            <div className="eq-row">
              <span className="eq-badge eq-badge--grey">Findings</span>
              <span className="eq-font-mono eq-text-sm">{analytics?.violations_in_period ?? "—"}</span>
            </div>
            <div className="eq-row">
              <span className="eq-badge eq-badge--grey">Drift score</span>
              <span className="eq-font-mono eq-text-sm">{analytics?.architecture_drift_score ?? "—"}</span>
            </div>
          </div>
          <p className="eq-text-xs eq-text-dim" style={{ marginTop: 14 }}>
            {analytics?.architecture_drift_note ?? "—"}
          </p>
        </div>

        <div className="eq-card">
          <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Download
          </div>
          <p className="eq-text-sm eq-text-muted" style={{ marginTop: 12 }}>
            Generates a PDF with daily PR + finding counts for the last 30 days.
          </p>
          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              disabled={!analytics || busy}
              onClick={downloadPdf}
              className="eq-btn eq-btn--primary"
              style={{ width: "100%", opacity: !analytics || busy ? 0.6 : 1 }}
            >
              {busy ? "Generating…" : "Download 30-day PDF"}
            </button>
          </div>
          <div className="eq-text-xs eq-text-dim" style={{ marginTop: 12 }}>
            File name: <span className="eq-font-mono">engineiq-report-30d-YYYY-MM-DD.pdf</span>
          </div>
        </div>
      </div>
    </div>
  );
}
