#!/usr/bin/env bash
# Bootstrap Codist "golden four" tenants (fixed emails in DEPLOYMENT.md §11.3).
#
# Long-lived environments: KEEP existing tenant rows — this script only for greenfield DBs.
# Re-running fails if contact_email already exists.
#
# IMPORTANT: git_hub_app_installation_id is UNIQUE per tenant. One GitHub App installation maps to
# at most one tenant row. See DEPLOYMENT.md §11.
#
# Usage:
#   chmod +x scripts/register-internal-demo-tenants.sh
#   ENGINEIQ_API_URL=https://api.engineiq.co.za ./scripts/register-internal-demo-tenants.sh
#
set -euo pipefail

API="${ENGINEIQ_API_URL:-https://api.engineiq.co.za}"
endpoint="${API%/}/api/v1/onboarding/register"

echo "Posting to: ${endpoint}"
echo ""

post() {
  local body="$1"
  curl -sS -X POST "${endpoint}" \
    -H "Content-Type: application/json" \
    -d "${body}"
  printf '\n\n'
}

post '{"email":"hello@mybillable.co.za","company_name":"Mybillable","plan":"Growth","github_org":"mybillable","dpa_accepted":true}'
post '{"email":"hello@therecord.co.za","company_name":"Therecord","plan":"Growth","github_org":"therecord","dpa_accepted":true}'
post '{"email":"hello@skillbay.co.za","company_name":"Skillbay","plan":"Growth","github_org":"skillbay","dpa_accepted":true}'
post '{"email":"technical@codist.co.za","company_name":"War Room","plan":"Growth","github_org":"warroom","dpa_accepted":true}'

cat <<'EOM'
Done.

Next steps for operators:
  1. Copy each JSON `tenant_id` and `api_key` into scripts/demo-tenant-state.local.env (see demo-tenant-state.example.env).
  2. If all repos currently live under ONE GitHub user/account with ONE installation ID, only ONE tenant can be webhook-linked to live PR reviews — pick which persona keeps installs (often one consolidated “Codist” tenant); others remain useful for portal/admin demos.

See DEPLOYMENT.md §11 for architecture detail (customers vs internal testing).
EOM
