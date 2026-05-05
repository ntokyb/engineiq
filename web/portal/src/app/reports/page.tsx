"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { tenantGet } from "@/lib/api";
import { loadSession } from "@/lib/auth";

type Analytics = {
  prs_reviewed_in_period: number;
  violations_in_period: number;
  architecture_drift_score: number;
  architecture_drift_note: string;
  prs_reviewed_per_day: { date: string; count: number }[];
  violations_per_day: { date: string; count: number }[];
};

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [company, setCompany] = useState("");

  useEffect(() => {
    const s = loadSession();
    if (!s) return;
    (async () => {
      const [a, acc] = await Promise.all([
        tenantGet(s.tenantId, s.apiKey, "/analytics?days=30"),
        tenantGet(s.tenantId, s.apiKey, "/account"),
      ]);
      if (a.ok) setAnalytics((await a.json()) as Analytics);
      if (acc.ok) {
        const j = (await acc.json()) as { company_name: string };
        setCompany(j.company_name);
      }
    })();
  }, []);

  function downloadPdf() {
    if (!analytics) return;
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
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-white">Reports</h1>
      <p className="text-slate-400">
        Download a PDF built from your last 30 days of analytics (no server-side PDF engine —
        generated in your browser).
      </p>
      <button
        type="button"
        disabled={!analytics}
        onClick={downloadPdf}
        className="rounded-xl bg-teal-500 px-6 py-3 font-semibold text-slate-950 hover:bg-teal-400 disabled:opacity-40"
      >
        Download 30-day PDF
      </button>
    </div>
  );
}
