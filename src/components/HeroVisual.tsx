"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function HeroVisual() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  const sortingPhases = [
    [30, 55, 42, 70, 38, 60, 26],
    [30, 42, 55, 38, 60, 26, 70],
    [30, 42, 38, 55, 26, 60, 70],
    [26, 30, 38, 42, 55, 60, 70],
  ];

  const current = sortingPhases[phase];

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="plate p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-faint">
            <span className="inline-block w-1.5 h-1.5 bg-primary mr-2" />
            trace · bubble_sort
          </span>
          <span className="font-mono text-[11px] text-faint">
            step {String(phase + 1).padStart(2, "0")} / 04
          </span>
        </div>

        <div className="flex items-end justify-center gap-2 h-36 border-b border-rule pb-0 bg-ink/[0.02] px-3 pt-4 rounded-md overflow-hidden">
          {current.map((height, i) => (
            <motion.div
              key={`${i}-${height}`}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className={`w-8 ${i === phase || i === phase + 1 ? "bg-accent" : "bg-primary/60"} rounded-t-sm`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-3 font-mono text-[11px] text-muted">
          <span>
            {phase === 3 ? "sorted — done" : `comparing idx ${phase + 1} ↔ ${phase + 2}`}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
            rendering
          </span>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-3 sm:-left-5 bg-paper border border-rule rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-muted shadow-sm">
        @ O(n²) worst case
      </div>
    </div>
  );
}