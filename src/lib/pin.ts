/**
 * Simple parent PIN lock — prevents kids from accidentally
 * accessing the parent settings page. Not real security,
 * just a gentle gate.
 */

const PIN_KEY = "fqs.v1.parentPin";
const SESSION_KEY = "fqs.v1.pinUnlocked";
const DEFAULT_PIN = "1234";

export function getPin(): string {
  if (typeof window === "undefined") return DEFAULT_PIN;
  return window.localStorage.getItem(PIN_KEY) ?? DEFAULT_PIN;
}

export function setPin(pin: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PIN_KEY, pin);
}

export function checkPin(input: string): boolean {
  return input === getPin();
}

/** Mark this session as unlocked (lasts until tab/window is closed) */
export function unlockSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SESSION_KEY, "1");
}

/** Check if the current session is already unlocked */
export function isSessionUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

/** Lock again (e.g., on manual re-lock) */
export function lockSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEY);
}
