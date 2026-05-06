import { Suspense } from "react";
import { PullRequestsView } from "./PullRequestsView";

export default function PullRequestsPage() {
  return (
    <Suspense
      fallback={
        <div className="eq-card">
          <div className="eq-skeleton" style={{ height: 14, width: 220 }} />
          <div className="eq-skeleton" style={{ height: 12, width: 320, marginTop: 12 }} />
        </div>
      }
    >
      <PullRequestsView />
    </Suspense>
  );
}
