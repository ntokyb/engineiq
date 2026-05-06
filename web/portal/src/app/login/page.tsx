import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="eq-section">
          <div className="eq-container" style={{ maxWidth: 520 }}>
            <div className="eq-card">
              <div className="eq-skeleton" style={{ height: 14, width: 160 }} />
              <div className="eq-skeleton" style={{ height: 12, width: 280, marginTop: 10 }} />
            </div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
