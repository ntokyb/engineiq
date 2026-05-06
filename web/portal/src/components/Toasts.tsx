"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastKind = "success" | "error" | "info";

export type ToastInput = {
  kind: ToastKind;
  title: string;
  message?: string;
};

type Toast = ToastInput & {
  id: string;
};

type ToastContextValue = {
  pushToast: (t: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToasts() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToasts must be used within <ToastsProvider />");
  return ctx;
}

function toastClass(kind: ToastKind) {
  switch (kind) {
    case "success":
      return "eq-toast eq-toast--success";
    case "error":
      return "eq-toast eq-toast--error";
    case "info":
      return "eq-toast eq-toast--info";
  }
}

export function ToastsProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (t: ToastInput) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `t_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      setToasts((prev) => [{ ...t, id }, ...prev].slice(0, 3));
      window.setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="eq-toasts" role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <div key={t.id} className={toastClass(t.kind)} role="status" aria-live="polite">
            <div className="eq-toast__title">
              <span>{t.title}</span>
              <button type="button" className="eq-iconbtn" aria-label="Dismiss" onClick={() => remove(t.id)}>
                ×
              </button>
            </div>
            {t.message ? <div className="eq-toast__body">{t.message}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

