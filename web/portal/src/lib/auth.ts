const LS_TENANT = "engineiq_tenant_id";
const LS_KEY = "engineiq_api_key";

export function saveSession(tenantId: string, apiKey: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_TENANT, tenantId.trim());
  localStorage.setItem(LS_KEY, apiKey.trim());
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_TENANT);
  localStorage.removeItem(LS_KEY);
}

export function loadSession(): { tenantId: string; apiKey: string } | null {
  if (typeof window === "undefined") return null;
  const tenantId = localStorage.getItem(LS_TENANT);
  const apiKey = localStorage.getItem(LS_KEY);
  if (!tenantId || !apiKey) return null;
  return { tenantId, apiKey };
}
