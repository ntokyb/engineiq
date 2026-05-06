#!/usr/bin/env bash
# Call tenant-authenticated endpoints for each golden-four persona (DEPLOYMENT.md §11.3).
# Requires scripts/demo-tenant-state.local.env with TENANT_* and API_KEY_* filled.
#
# Usage:
#   ./scripts/verify-golden-four-api.sh
#   ENGINEIQ_API_URL=https://api.engineiq.co.za ./scripts/verify-golden-four-api.sh /path/to/demo-tenant-state.local.env
#
set -euo pipefail

ENV_FILE="${1:-scripts/demo-tenant-state.local.env}"
API="${ENGINEIQ_API_URL:-https://api.engineiq.co.za}"
API="${API%/}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing: $ENV_FILE"
  echo "Copy scripts/demo-tenant-state.example.env → scripts/demo-tenant-state.local.env and paste tenant_id + api_key per persona."
  exit 1
fi

# shellcheck disable=SC1090
set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a

personas=(MYBILLABLE THERECORD SKILLBAY WARROOM)
failed=0

for p in "${personas[@]}"; do
  tid_var="TENANT_${p}"
  key_var="API_KEY_${p}"
  tid="${!tid_var:-}"
  key="${!key_var:-}"
  label="${p//_/ }"

  if [[ -z "$tid" || -z "$key" ]]; then
    echo "[SKIP] $label — empty TENANT_${p} or API_KEY_${p}"
    continue
  fi

  echo "=== $label ($tid) ==="
  for path in "/status" "/account" "/jobs?take=5"; do
    if ! code="$(curl -sS -o /dev/null -w "%{http_code}" \
      -H "X-Api-Key: $key" \
      "$API/api/v1/tenant/$tid${path}")"; then
      echo "  FAIL $path → curl error (offline / TLS / DNS)"
      failed=1
      continue
    fi
    if [[ "$code" != "200" ]]; then
      echo "  FAIL $path → HTTP $code"
      failed=1
    else
      echo "  OK   $path → HTTP $code"
    fi
  done
  echo ""
done

if [[ "$failed" -ne 0 ]]; then
  echo "Some checks failed."
  exit 1
fi
echo "Golden-four API smoke completed."
