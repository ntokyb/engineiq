"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Legacy path — static export friendly redirect to `/overview`. */
export default function DashboardRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/overview");
  }, [router]);
  return (
    <div className="eq-card" style={{ padding: 24 }}>
      <div className="eq-skeleton" style={{ height: 14, width: 200 }} />
      <div className="eq-text-xs eq-text-dim" style={{ marginTop: 12 }}>
        Redirecting…
      </div>
    </div>
  );
}
