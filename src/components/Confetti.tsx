"use client";

import { useMemo } from "react";

const COLORS = [
  "#e07a5f",
  "#f4a261",
  "#81b29a",
  "#b48ead",
  "#6c5ce7",
  "#f7d6e0",
  "#fde4cf",
];

type Piece = {
  left: string;
  size: number;
  delay: string;
  duration: string;
  color: string;
  rotate: string;
};

function generate(seed: number, count: number): Piece[] {
  const pieces: Piece[] = [];
  for (let i = 0; i < count; i++) {
    const r = (Math.sin(seed * 9.13 + i * 2.71) + 1) / 2;
    const r2 = (Math.cos(seed * 4.57 + i * 1.91) + 1) / 2;
    const r3 = (Math.sin(seed * 1.31 + i * 3.07) + 1) / 2;
    pieces.push({
      left: `${Math.round(r * 100)}%`,
      size: 8 + Math.round(r2 * 10),
      delay: `${Math.round(r3 * 800)}ms`,
      duration: `${1800 + Math.round(r * 1400)}ms`,
      color: COLORS[i % COLORS.length],
      rotate: `${Math.round(r2 * 360)}deg`,
    });
  }
  return pieces;
}

type Props = {
  active: boolean;
  count?: number;
  seed?: number;
};

export default function Confetti({ active, count = 36, seed = 1 }: Props) {
  const pieces = useMemo(() => generate(seed, count), [seed, count]);
  if (!active) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block rounded-[2px]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            transform: `rotate(${p.rotate})`,
            animation: `confetti-fall ${p.duration} ease-in ${p.delay} forwards`,
          }}
        />
      ))}
    </div>
  );
}
