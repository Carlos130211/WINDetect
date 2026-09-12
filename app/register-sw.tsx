"use client";

import { useEffect } from "react";

export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}