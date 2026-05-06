"use client";

import { useEffect, useState } from "react";
import { postConfigYaml, tenantGet } from "@/lib/api";
import { loadSession } from "@/lib/auth";
import { useToasts } from "@/components/Toasts";

type Account = {
  tenant_id: string;
  company_name: string;
  plan: string;
  status: string;
  github_org: string | null;
  github_app_connected: boolean;
  github_app_installation_id: number | null;
  has_config_yaml: boolean;
};

export default function SettingsPage() {
  const { pushToast } = useToasts();
  const [account, setAccount] = useState<Account | null>(null);
  const [yaml, setYaml] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (!s) return;
    (async () => {
      const [aRes, cRes] = await Promise.all([
        tenantGet(s.tenantId, s.apiKey, "/account"),
        tenantGet(s.tenantId, s.apiKey, "/config"),
      ]);
      if (aRes.ok) setAccount((await aRes.json()) as Account);
      if (cRes.ok) {
        const j = (await cRes.json()) as { config_yaml: string };
        setYaml(j.config_yaml ?? "");
      }
      setLoading(false);
    })();
  }, []);

  async function saveYaml() {
    const s = loadSession();
    if (!s) return;
    setMsg(null);
    setErr(null);
    setSaving(true);
    try {
      const res = await postConfigYaml(s.tenantId, s.apiKey, yaml);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(JSON.stringify(body));
        pushToast({ kind: "error", title: "Save failed", message: "YAML validation failed. Review errors and try again." });
        return;
      }
      setMsg("Config saved.");
      pushToast({ kind: "success", title: "Config saved", message: "Your YAML config was validated and saved." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="eq-pagehead">
        <div>
          <div
            className="eq-text-xs eq-text-muted"
            style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            Settings
          </div>
          <h1 className="eq-h2" style={{ marginTop: 10 }}>
            Account &amp; configuration
          </h1>
          <p className="eq-text-sm eq-text-muted" style={{ margin: "10px 0 0" }}>
            Billing, GitHub App status, and your standards YAML.
          </p>
        </div>
      </div>

      {loading && (
        <div className="eq-grid-2">
          <div className="eq-card">
            <div className="eq-skeleton" style={{ height: 12, width: 160 }} />
            <div className="eq-skeleton" style={{ height: 12, width: 280, marginTop: 10 }} />
            <div className="eq-skeleton" style={{ height: 12, width: 220, marginTop: 10 }} />
          </div>
          <div className="eq-card">
            <div className="eq-skeleton" style={{ height: 12, width: 180 }} />
            <div className="eq-skeleton" style={{ height: 220, width: "100%", marginTop: 14 }} />
          </div>
        </div>
      )}

      {!loading && (
        <div className="eq-grid-2">
          <div style={{ display: "grid", gap: 16 }}>
            {account && (
              <section className="eq-card">
                <div className="eq-row">
                  <h2 className="eq-h3">Account</h2>
                  <span className="eq-badge eq-badge--grey">{account.plan}</span>
                </div>

                <table className="eq-table" style={{ marginTop: 14 }}>
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: 16 }}>Field</th>
                      <th style={{ paddingRight: 16 }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Company", account.company_name],
                      ["Status", account.status],
                      ["GitHub org", account.github_org ?? "—"],
                      ["Tenant ID", account.tenant_id],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ paddingLeft: 16 }} className="eq-text-sm eq-text-muted">
                          {k}
                        </td>
                        <td style={{ paddingRight: 16 }} className="eq-text-sm eq-font-mono">
                          {v}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            <section className="eq-card">
              <div className="eq-row">
                <h2 className="eq-h3">GitHub App</h2>
                {account?.github_app_connected ? (
                  <span className="eq-badge eq-badge--green">Connected</span>
                ) : (
                  <span className="eq-badge eq-badge--amber">Pending</span>
                )}
              </div>

              <p className="eq-text-sm eq-text-muted" style={{ margin: "12px 0 0" }}>
                {account?.github_app_connected ? (
                  <>
                    Installation active{" "}
                    {account.github_app_installation_id != null ? (
                      <span className="eq-font-mono">({account.github_app_installation_id})</span>
                    ) : null}
                    .
                  </>
                ) : (
                  "Not connected — complete the GitHub App install from your onboarding step."
                )}
              </p>
            </section>
          </div>

          <section className="eq-card">
            <div className="eq-row">
              <h2 className="eq-h3">Standards config (YAML)</h2>
              {account?.has_config_yaml ? <span className="eq-badge eq-badge--grey">Saved</span> : null}
            </div>

            <p className="eq-text-sm eq-text-muted" style={{ margin: "12px 0 0" }}>
              Update your architecture rules and standards. The API validates YAML before saving.
            </p>

            <textarea
              value={yaml}
              onChange={(e) => setYaml(e.target.value)}
              rows={16}
              className="eq-input eq-font-mono"
              style={{ marginTop: 14, height: "auto", padding: 12, minHeight: 360, resize: "vertical" }}
              placeholder={`version: 1\nrules:\n  - id: example\n    severity: error\n`}
            />

            {msg && (
              <div className="eq-card" style={{ marginTop: 12, padding: 12, borderColor: "rgba(16, 185, 129, 0.25)" }}>
                <div className="eq-text-sm" style={{ color: "var(--eq-green)" }}>
                  {msg}
                </div>
              </div>
            )}
            {err && (
              <div className="eq-card" style={{ marginTop: 12, padding: 12, borderColor: "rgba(239, 68, 68, 0.35)" }}>
                <div className="eq-text-sm" style={{ color: "var(--eq-red)" }}>
                  {err}
                </div>
              </div>
            )}

            <div className="eq-row" style={{ justifyContent: "flex-end", marginTop: 12 }}>
              <button
                type="button"
                onClick={() => saveYaml()}
                className="eq-btn eq-btn--primary"
                disabled={saving}
                style={{ opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Saving…" : "Validate & save"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
