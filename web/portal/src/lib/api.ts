export function apiBase() {
  return process.env.NEXT_PUBLIC_ENGINEIQ_API_URL ?? "http://localhost:5056";
}

export async function tenantGet(
  tenantId: string,
  apiKey: string,
  path: string,
  init?: RequestInit,
) {
  return fetch(`${apiBase()}/api/v1/tenant/${tenantId}${path}`, {
    ...init,
    headers: {
      "X-Api-Key": apiKey,
      ...init?.headers,
    },
  });
}

export async function postConfigYaml(tenantId: string, apiKey: string, yaml: string) {
  return fetch(`${apiBase()}/api/v1/tenant/${tenantId}/config`, {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "text/yaml; charset=utf-8",
    },
    body: yaml,
  });
}
