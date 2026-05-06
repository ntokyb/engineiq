#!/usr/bin/env bash
# Run on your laptop or CI after DNS + TLS — expects public URLs for engineiq.co.za.
set -euo pipefail

API="${VERIFY_API_URL:-https://api.engineiq.co.za}"
SITE="${VERIFY_MARKETING_URL:-https://engineiq.co.za}"
PORTAL="${VERIFY_PORTAL_URL:-https://app.engineiq.co.za}"

echo "Checking API health: $API/health"
curl -fsS "$API/health" | head -c 500 || true
echo ""
echo "Checking API security JSON: $API/security"
curl -fsS "$API/security" | head -c 800 || true
echo ""
echo "Checking marketing (HEAD): $SITE"
curl -fsSI "$SITE" | head -n 8
echo "Checking portal (HEAD): $PORTAL"
curl -fsSI "$PORTAL" | head -n 8
echo "Checking portal /overview (HEAD): $PORTAL/overview"
curl -fsSI "$PORTAL/overview" | head -n 8
echo "Checking portal /login (HEAD): $PORTAL/login"
curl -fsSI "$PORTAL/login" | head -n 8
echo "OK — basic checks completed."
echo "Optional: TENANT_ID + TENANT_API_KEY from demo-tenant-state.local.env → scripts/verify-golden-four-api.sh"
