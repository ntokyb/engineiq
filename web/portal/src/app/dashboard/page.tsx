"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { tenantGet } from "@/lib/api";
import { loadSession } from "@/lib/auth";

type Analytics = {
  days: number;
  prs_reviewed_in_period: number;
  violations_in_period: number;
  prs_reviewed_per_day: { date: string; count: number }[];
  violations_per_day: { date: string; count: number }[];
  architecture_drift_score: number;
  architecture_drift_note: string;
};

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s) return;
    (async () => {
      const res = await tenantGet(s.tenantId, s.apiKey, "/analytics?days=30");
      if (!res.ok) {
        setErr(`Could not load analytics (${res.status})`);
        return;
      }
      setData((await res.json()) as Analytics);
    })();
  }, []);

  const chartData =
    data?.prs_reviewed_per_day.map((p, i) => ({
      date: p.date.slice(5),
      prs: p.count,
      violations: data.violations_per_day[i]?.count ?? 0,
    })) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Last 30 days · UTC</p>
      </div>
      {err && <p className="text-red-400">{err}</p>}
      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-sm text-slate-500">PRs reviewed</p>
              <p className="text-2xl font-semibold text-teal-400">{data.prs_reviewed_in_period}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-sm text-slate-500">Violations logged</p>
              <p className="text-2xl font-semibold text-amber-300">{data.violations_in_period}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-sm text-slate-500">Architecture drift score</p>
              <p className="text-2xl font-semibold text-white">{data.architecture_drift_score}</p>
              <p className="mt-1 text-xs text-slate-500">{data.architecture_drift_note}</p>
            </div>
          </div>
          <div className="h-80 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
            <h2 className="mb-4 text-sm font-medium text-slate-400">Trend</h2>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend />
                <Line type="monotone" dataKey="prs" name="PRs" stroke="#14b8a6" dot={false} />
                <Line
                  type="monotone"
                  dataKey="violations"
                  name="Violations"
                  stroke="#fbbf24"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
