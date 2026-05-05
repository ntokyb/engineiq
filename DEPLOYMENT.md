# EngineIQ — Production deployment handover (Hetzner + engineiq.co.za)

This document is the **single source of truth** for bringing an empty Hetzner server and an empty GitHub repo to a **working production stack**, including TLS, database migrations, Docker topology, and onboarding **four** GitHub organisations as tenants.

**Canonical code repo:** [github.com/ntokyb/engineiq](https://github.com/ntokyb/engineiq)

---

## 1. What you are deploying

| Public hostname | Purpose |
|-----------------|--------|
| `https://engineiq.co.za` | Marketing site (Next.js static) |
| `https://app.engineiq.co.za` | Client portal (Next.js static) |
| `https://api.engineiq.co.za` | EngineIQ API (webhooks, onboarding, tenant API, `GET /security`) |

**GitHub App webhook (must be this path on the API host):**

`https://api.engineiq.co.za/webhooks/github`

### 1.1 Internal topology (Docker Compose)

Nothing on the host binds PostgreSQL/RabbitMQ/Redis to the public internet. Only **Caddy** listens on **80** and **443**.

| Service | Role | Host exposure |
|---------|------|----------------|
| `caddy` | TLS (Let’s Encrypt), reverse proxy | **0.0.0.0:80, 443** |
| `engineiq-api` | .NET 8 API | Internal `:5000` only |
| `engineiq-worker` | .NET 8 queue consumer | No public port |
| `engineiq-admin` | Internal Razor admin | **127.0.0.1:8081** only |
| `engineiq-marketing` | nginx + static export | Internal `:80` |
| `engineiq-portal` | nginx + static export | Internal `:80` |
| `postgres` | PostgreSQL 16 | Volume only |
| `rabbitmq` | RabbitMQ 3 + management | Internal only |
| `redis` | Redis 7 | Internal only |
| `engineiq-reporting` | Python 3.12 + scheduled jobs | No public port |
| `engineiq-migrator` | EF migrations (profile `migration`) | Run via `deploy.sh`, not long-running |

### 1.2 Data & “seeding”

- **Schema:** applied by **`engineiq-migrator`** (Docker image from `docker/Dockerfile.migrator`).
- **Reference tenant row:** migrations seed one internal **`Billable`** tenant row (`f1111111-1111-1111-1111-111111111111`) for schema/RLS consistency — **it does not have a portal API key**. Do **not** use it for the client portal.
- **Real tenants:** created only via **`POST /api/v1/onboarding/register`** (marketing sign-up or API). Each tenant gets an API key once; GitHub App install links that tenant to an installation.

---

## 2. Prerequisites checklist (before touching the server)

Complete these **in order**; missing any item breaks “first shot” deploy.

### 2.1 Accounts & artefacts

- [ ] **GitHub organisation access** for onboarding installs: **therecord**, **billable**, **war-room**, **skillbay** (exact slugs must match [GitHub organisation URLs](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/about-organizations); confirm **`war-room`** is correct vs `war_room`).
- [ ] **Anthropic** API key ([Anthropic Console](https://console.anthropic.com/)).
- [ ] **SendGrid** (or accept that welcome/live emails are skipped until API key + template IDs are set).
- [ ] **Slack incoming webhook** (optional; `deploy.sh` notifications).
- [ ] **Hetzner** account + SSH public key.
- [ ] **Domain** `engineiq.co.za` DNS editable (cPanel zone editor or registrar DNS).

### 2.2 GitHub App (single app, multiple installs)

Create **one** GitHub App (organisation or user-owned — typically user/org that owns **ntokyb/engineiq**):

1. **GitHub → Settings → Developer settings → GitHub Apps → New GitHub App**
2. **Webhook URL:** `https://api.engineiq.co.za/webhooks/github`
3. **Webhook secret:** generate a long random string → becomes `GITHUB_WEBHOOK_SECRET` in `.env`.
4. **Permissions:** Repository permissions — **Pull requests: Read & write**, **Contents: Read**.
5. **Subscribe to events:** at minimum what your webhook handles (e.g. pull request events — align with `WebhookController` in this repo).
6. Save **App ID**, **App slug**, generate and download **Private Key (PEM)** → `GITHUB_PRIVATE_KEY_PEM`.

After deploy, each customer org installs **this same app**; EngineIQ creates **one tenant per registration** and binds **one installation ID** per tenant.

### 2.3 SendGrid dynamic templates (welcome email)

Welcome mail sends dynamic fields:

- `company_name`
- `install_url`
- `dpa_pdf_url`
- `webhook_secret`

Create templates in SendGrid and put template IDs in `.env` (`SENDGRID_TEMPLATE_*`). If templates are empty, sending is skipped (API still works).

---

## 3. DNS (cPanel or registrar)

Point these to the **Hetzner server IPv4** (and IPv6 **AAAA** if you use it):

| Host / name | Type | Value |
|-------------|------|--------|
| `@` (root) | A | `<HETZNER_SERVER_IP>` |
| `www` | A | `<HETZNER_SERVER_IP>` |
| `api` | A | `<HETZNER_SERVER_IP>` |
| `app` | A | `<HETZNER_SERVER_IP>` |

TTL: **300** seconds until stable, then increase.

**Do not** park the apex on shared hosting if the API must hit Hetzner — the **A records** must resolve to the VM that runs Caddy.

Propagation: allow up to **48 hours** globally; often **5–30 minutes**. Let’s Encrypt will fail until `api.engineiq.co.za` resolves to this server.

---

## 4. Hetzner server bootstrap (Ubuntu 22.04)

### 4.1 Create the server

- Image: **Ubuntu 22.04**
- Location: **Nuremberg** or **Johannesburg** (if available on your account) — pick closest to users.
- SSH keys only (disable password auth).
- Firewall (Hetzner Cloud): **TCP 22** (your IP or VPN), **TCP 80**, **TCP 443**.

### 4.2 Base packages

SSH in as root or sudo user, then:

```bash
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl git python3 python3-pip ufw

# Docker (official convenience script — verify Docker docs if you prefer package install)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
# log out and back in so docker group applies
```

Enable UFW if not using only Hetzner firewall:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 5. Code on the server

```bash
sudo mkdir -p /opt/engineiq && sudo chown "$USER:$USER" /opt/engineiq
cd /opt/engineiq
git clone https://github.com/ntokyb/engineiq.git .
# You must be in the repository root (directory that contains docker-compose.yml and deploy.sh).
```

Stay on **`main`** (or your release branch) for production.

---

## 6. Configure `.env`

```bash
cp .env.example .env
nano .env   # or vim
```

**Minimum critical fields:**

- `POSTGRES_PASSWORD`, `RABBITMQ_PASSWORD`, `ENGINEIQ_ADMIN_PASSWORD`
- `CADDY_ACME_EMAIL` (real mailbox for Let’s Encrypt expiry)
- `GITHUB_*`, `ANTHROPIC_API_KEY`
- `ENGINEIQ_REGISTRY`, `ENGINEIQ_TAG` **or** `SKIP_PULL=1` for build-on-server (see §7)
- `NEXT_PUBLIC_ENGINEIQ_API_URL=https://api.engineiq.co.za`
- `NEXT_PUBLIC_PORTAL_URL=https://app.engineiq.co.za`
- `ENGINEIQ_DASHBOARD_BASE_URL=https://app.engineiq.co.za`

**Never commit `.env`.**

### 6.1 PEM in `.env`

Use quoted multiline PEM **or** single line with `\n` escapes. Docker Compose must parse the file cleanly.

---

## 7. Images: registry pull vs build on server

### Option A — Pull from GHCR (recommended)

1. In GitHub: enable **Actions**, ensure workflow **Publish Docker images** has run on `main`.
2. Packages: make container images **public** or configure PAT on server:

   ```bash
   echo "<GITHUB_PAT_WITH_READ_PACKAGES>" | docker login ghcr.io -u ntokyb --password-stdin
   ```

3. In `.env`:

   ```env
   ENGINEIQ_REGISTRY=ghcr.io/ntokyb/engineiq
   ENGINEIQ_TAG=latest
   SKIP_PULL=0
   ```

### Option B — Build on server (no registry)

```env
SKIP_PULL=1
ENGINEIQ_REGISTRY=engineiq   # local image prefix
```

Then `./deploy.sh` runs `docker compose build` before `up`. Requires **more RAM/CPU** on the VM (building Node + .NET).

---

## 8. First deploy

```bash
cd /opt/engineiq   # repository root: docker-compose.yml + deploy.sh live here
chmod +x deploy.sh scripts/verify-deployment.sh 2>/dev/null || true
./deploy.sh
```

What `deploy.sh` does:

1. `docker compose pull` (unless `SKIP_PULL=1` → `build`)
2. `docker compose --profile migration run --rm engineiq-migrator` → **DB migrations**
3. `docker compose --profile platform up -d`
4. Internal health checks (API + static sites)

Optional:

```env
PUBLIC_API_HEALTH_URL=https://api.engineiq.co.za/health
```

If TLS/DNS are not ready yet:

```env
SKIP_PUBLIC_HEALTH=1
```

---

## 9. Verification (must pass)

From your laptop:

```bash
curl -fsS https://api.engineiq.co.za/health
curl -fsS https://api.engineiq.co.za/security
curl -fsSI https://engineiq.co.za | head -n 5
curl -fsSI https://app.engineiq.co.za | head -n 5
```

Use **`scripts/verify-deployment.sh`** on the server if included in the repo.

---

## 10. Internal admin (operators only)

URL on server: **`http://127.0.0.1:8081`**

From your machine:

```bash
ssh -L 8081:127.0.0.1:8081 root@<HETZNER_IP>
# browser: http://127.0.0.1:8081
```

Credentials: `ENGINEIQ_ADMIN_USERNAME` / `ENGINEIQ_ADMIN_PASSWORD` from `.env`.

---

## 11. Onboarding the four organisations

Each row is **one EngineIQ tenant** = **one GitHub App installation** on that org.

| # | GitHub org slug (`github_org` in API) | Suggested company display name | Owner email (unique per tenant in DB) |
|---|--------------------------------------|--------------------------------|----------------------------------------|
| 1 | `therecord` | The Record | ops+therecord@… |
| 2 | `billable` | Billable | ops+billable@… |
| 3 | `war-room` | War Room | ops+warroom@… |
| 4 | `skillbay` | Skillbay | ops+skillbay@… |

**Per org — repeat:**

1. Open **`https://engineiq.co.za/sign-up`** (or call API below).
2. Submit with **`dpa_accepted: true`**.
3. Copy **`tenant_id`** and **`api_key`** from the response (and email if SendGrid configured).
4. Click **Install GitHub App** in the email/page; choose **only that organisation** when GitHub prompts.
5. After redirect to portal, each team uses **`https://app.engineiq.co.za/login`** with **their** tenant UUID + API key.

**API equivalent:**

```bash
curl -sS -X POST "https://api.engineiq.co.za/api/v1/onboarding/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ops+billable@yourdomain.co.za",
    "company_name": "Billable",
    "plan": "Growth",
    "github_org": "billable",
    "dpa_accepted": true
  }'
```

Validate each org can open a test PR and receive a review comment (requires Worker + Anthropic + GitHub permissions).

---

## 12. Operations cheatsheet

| Task | Command / note |
|------|----------------|
| Logs API | `docker compose logs -f engineiq-api` |
| Logs worker | `docker compose logs -f engineiq-worker` |
| Restart stack | `docker compose --profile platform restart` |
| DB backup | `docker compose exec postgres pg_dump -U engineiq engineiq > backup.sql` |
| Update deploy | `git pull && ./deploy.sh` |

---

## 13. Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Let’s Encrypt fails | DNS not pointing to this server; port 80 blocked; rate limit — check `docker compose logs caddy` |
| Webhook 401 | Wrong `GITHUB_WEBHOOK_SECRET` vs GitHub App settings |
| Reviews never run | Worker down, RabbitMQ creds wrong, Anthropic key invalid |
| Portal CORS errors | API `Cors:AllowedOrigins` must include portal/marketing origins (compose sets prod hosts) |
| Admin PG errors | Ensure migrator ran; check `postgres` health |

---

## 14. Handover criteria (definition of done)

- [ ] DNS A records for `@`, `www`, `api`, `app` → Hetzner IP
- [ ] `curl https://api.engineiq.co.za/health` returns JSON
- [ ] GitHub App webhook delivered once (check API logs)
- [ ] All compose services healthy: `docker compose ps`
- [ ] Four tenants registered; four installs completed; test PR reviewed on at least one repo
- [ ] Operator can SSH tunnel to admin and list tenants
- [ ] `.env` backed up to a **secrets vault** (not git)

---

**Support note:** product copy still mentions legacy Azure SA North in places; production runtime for this path is **Docker on Hetzner** with disclosure strings configurable under **`Trust:`** in configuration.
