

import type { Session } from "./types";

const KEY = "win-home-check:session";

export function saveSession(session: Session): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // sessionStorage no disponible: se ignora
  }
}

export function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // se ignora
  }
}