#!/usr/bin/env bash
# EngineIQ — full stack deploy for Ubuntu 22.04+ (Docker Compose v2).
# Usage: copy .env.example → .env, fill secrets, then: chmod +x deploy.sh && ./deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env in $ROOT — copy .env.example to .env and configure."
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

notify_slack() {
  local text=$1
  if [[ -z "${SLACK_WEBHOOK_URL:-}" ]]; then
    return 0
  fi
  payload=$(printf '%s' "$text" | python3 -c 'import json,sys; print(json.dumps({"text": sys.stdin.read()}))' 2>/dev/null) \
    || payload="{\"text\":\"$(printf '%s' "$text" | sed 's/\\/\\\\/g; s/"/\\"/g')\"}"
  curl -sS -X POST -H 'Content-type: application/json' --data "$payload" "$SLACK_WEBHOOK_URL" >/dev/null || true
}

HOST_LABEL="$(hostname -f 2>/dev/null || hostname || echo unknown)"

on_fail() {
  local step=$1
  notify_slack "❌ EngineIQ deploy failed at: ${step} (host: ${HOST_LABEL})"
  exit 1
}

if [[ "${SKIP_PULL:-0}" == "1" ]]; then
  docker compose build || on_fail "docker compose build"
else
  docker compose pull || on_fail "docker compose pull"
fi

docker compose --profile migration run --rm engineiq-migrator || on_fail "database migrations"

docker compose --profile platform up -d --remove-orphans || on_fail "docker compose --profile platform up -d"

echo "Waiting for API container health…"
for _ in $(seq 1 40); do
  if docker compose exec -T engineiq-api curl -fsS http://127.0.0.1:5000/health >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

docker compose exec -T engineiq-api curl -fsS http://127.0.0.1:5000/health || on_fail "engineiq-api internal /health"

docker compose exec -T engineiq-marketing wget -qO- http://127.0.0.1/ >/dev/null || on_fail "engineiq-marketing nginx"

docker compose exec -T engineiq-portal wget -qO- http://127.0.0.1/ >/dev/null || on_fail "engineiq-portal nginx"

docker compose ps

if [[ "${SKIP_PUBLIC_HEALTH:-0}" != "1" ]] && [[ -n "${PUBLIC_API_HEALTH_URL:-}" ]]; then
  if curl -fsS --max-time 20 "$PUBLIC_API_HEALTH_URL"; then
    echo "Public health OK: $PUBLIC_API_HEALTH_URL"
  else
    notify_slack "⚠️ EngineIQ deploy finished but public check failed: ${PUBLIC_API_HEALTH_URL} (host: ${HOST_LABEL}) — DNS/TLS may still be settling."
  fi
fi

notify_slack "✅ EngineIQ deploy succeeded (host: ${HOST_LABEL})"
echo "Done."
