"""
Scheduled reporting job. Verifies API reachability; extend to pull tenant analytics
and upload PDFs or trigger SendGrid when report endpoints exist.
"""
from __future__ import annotations

import os
import sys
from datetime import datetime, timezone

import requests

TIMEOUT_S = 60


def main() -> int:
    base = os.environ.get("ENGINEIQ_API_BASE_URL", "http://engineiq-api:5000").rstrip("/")
    url = f"{base}/health"
    print(f"[{datetime.now(timezone.utc).isoformat()}] reporting: GET {url}")
    try:
        r = requests.get(url, timeout=TIMEOUT_S)
        r.raise_for_status()
        print(f"reporting: OK {r.status_code} {r.text[:200]}")
    except requests.RequestException as e:
        print(f"reporting: ERROR {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
