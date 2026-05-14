"use client";

import { useEffect, useRef, useState } from "react";
import { checkPin, isSessionUnlocked, unlockSession } from "@/lib/pin";

type Props = {
  children: React.ReactNode;
};

export default function PinGate({ children }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check if already unlocked this session
  useEffect(() => {
    if (isSessionUnlocked()) {
      setUnlocked(true);
    }
  }, []);

  function handleDigit(index: number, value: string) {
    // Only allow single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError(false);

    if (digit && index < 3) {
      // Auto-advance to next input
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all digits are filled
    if (digit && index === 3) {
      const pin = next.join("");
      if (checkPin(pin)) {
        unlockSession();
        setUnlocked(true);
      } else {
        setError(true);
        // Shake + clear after a moment
        setTimeout(() => {
          setDigits(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }, 600);
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1ede4] px-6">
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl mb-4" aria-hidden="true">🔒</div>
        <h1 className="text-2xl font-bold mb-2">Parent area</h1>
        <p className="text-sm text-ink-soft mb-8">
          Enter the 4-digit PIN to continue.
          <br />
          <span className="text-xs">(Default: 1234)</span>
        </p>

        <div
          className={`flex justify-center gap-3 mb-6 ${error ? "card-shake" : ""}`}
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`h-16 w-14 rounded-2xl bg-white text-center text-2xl font-bold shadow-sm outline-none ring-2 transition-all ${
                error
                  ? "ring-red-400 text-red-500"
                  : d
                    ? "ring-[#81b29a] text-ink"
                    : "ring-black/10 text-ink"
              } focus:ring-[#81b29a]`}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-500 animate-pop">
            Wrong PIN. Try again.
          </p>
        ) : null}

        <p className="mt-8 text-xs text-ink-soft">
          This keeps little fingers out of the settings.
          <br />
          You can change the PIN inside the parent page.
        </p>
      </div>
    </div>
  );
}
