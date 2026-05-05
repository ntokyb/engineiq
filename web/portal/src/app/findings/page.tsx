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

  const load = useCallback(async () => {
    const s = loadSession();
    if (!s) return;
    const q = new URLSearchParams();
    if (severity) q.set("severity", severity);
    if (file) q.set("file", file);
    if (rule) q.set("rule_id", rule);
    q.set("take", "100");
    const res = await tenantGet(s.tenantId, s.apiKey, `/findings?${q.toString()}`);
    if (!res.ok) {
      setErr(`Failed (${res.status})`);
      return;
    }
    setData((await res.json()) as Page);
    setErr(null);
  }, [severity, file, rule]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Findings</h1>
        <p className="text-slate-400">Filter by severity, file path fragment, or rule id.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Severity (e.g. error)"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
        />
        <input
          placeholder="File contains"
          value={file}
          onChange={(e) => setFile(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
        />
        <input
          placeholder="Rule id"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
        />
        <button
          type="button"
          onClick={() => load()}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500"
        >
          Apply
        </button>
      </div>
      {err && <p className="text-red-400">{err}</p>}
      {data && (
        <p className="text-sm text-slate-500">
          {data.total_count} total · showing {data.items.length}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
            <tr>
              <th className="p-3">When</th>
              <th className="p-3">Severity</th>
              <th className="p-3">Rule</th>
              <th className="p-3">File</th>
              <th className="p-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((r) => (
              <tr key={r.id} className="border-b border-slate-800/80 hover:bg-slate-900/40">
                <td className="whitespace-nowrap p-3 text-slate-500">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="p-3 text-teal-300">{r.severity}</td>
                <td className="p-3 text-slate-400">{r.rule_id ?? "—"}</td>
                <td className="max-w-xs truncate p-3 font-mono text-xs text-slate-300">
                  {r.file_path}
                </td>
                <td className="max-w-md p-3 text-slate-300">{r.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
