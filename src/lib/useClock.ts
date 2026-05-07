"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns the current minute timestamp. Triggers a re-render every 30 seconds
 * and whenever the tab becomes visible (so opening the iPad updates the
 * active time block immediately).
 *
 * Returns 0 on the server / first hydration tick — components should compute
 * `new Date()` inside render rather than using this value directly.
 */
export function useNowTick(): number {
  return useSyncExternalStore(
    (cb) => {
      const interval = setInterval(cb, 30_000);
      const onVisible = () => cb();
      if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("focus", onVisible);
      }
      return () => {
        clearInterval(interval);
        if (typeof document !== "undefined") {
          document.removeEventListener("visibilitychange", onVisible);
          window.removeEventListener("focus", onVisible);
        }
      };
    },
    () => Math.floor(Date.now() / 60_000),
    () => 0,
  );
}
