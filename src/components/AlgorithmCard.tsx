"use client";

import Link from "next/link";
import { ArrowRight, Gauge, Search } from "lucide-react";
import { Algorithm } from "@/lib/types";

const difficultyClass: Record<string, string> = {
  Beginner: "tag tag-beginner",
  Intermediate: "tag tag-intermediate",
  Advanced: "tag tag-advanced",
};

function AlgorithmPreview({ slug }: { slug: string }) {
  const bars = [45, 70, 25, 80, 35, 50, 65, 30];

  return (
    <div className="h-20 flex items-center justify-center p-2 border border-rule rounded-md bg-ink/[0.02] overflow-hidden">
      {slug === "bubble-sort" && (
        <div className="h-full flex items-end gap-1">
          {bars.map((b, i) => (
            <div
              key={i}
              className={`w-[18px] rounded-t ${
                i === 2 || i === 3 ? "bg-accent" : i >= 6 ? "bg-primary/70 dark:bg-primary-light/70" : "bg-primary/30 dark:bg-primary-light/30"
              }`}
              style={{ height: `${b}%` }}
            />
          ))}
        </div>
      )}
      {slug === "selection-sort" && (
        <div className="h-full flex items-end gap-1">
          {bars.map((b, i) => (
            <div
              key={i}
              className={`w-[18px] rounded-t ${
                i === 3 ? "bg-accent scale-y-110" : i < 2 ? "bg-primary/70 dark:bg-primary-light/70" : "bg-primary/25 dark:bg-primary-light/25"
              }`}
              style={{ height: `${b}%` }}
            />
          ))}
        </div>
      )}
      {slug === "insertion-sort" && (
        <div className="h-full flex items-end gap-1">
          {bars.map((b, i) => (
            <div
              key={i}
              className={`w-[18px] rounded-t ${
                i === 3 ? "bg-accent" : i < 3 ? "bg-primary/70 dark:bg-primary-light/70" : "bg-primary/25 dark:bg-primary-light/25"
              }`}
              style={{ height: `${b}%` }}
            />
          ))}
        </div>
      )}
      {slug === "merge-sort" && (
        <div className="h-full flex items-stretch gap-1.5">
          <div className="flex items-end gap-1">
            {bars.slice(0, 4).map((b, i) => (
              <div key={i} className="w-[18px] bg-primary/70 dark:bg-primary-light/70 rounded-t" style={{ height: `${b}%` }} />
            ))}
          </div>
          <div className="w-px bg-rule my-2" />
          <div className="flex items-end gap-1">
            {bars.slice(4).map((b, i) => (
              <div key={i} className="w-[18px] bg-secondary/70 rounded-t" style={{ height: `${b}%` }} />
            ))}
          </div>
        </div>
      )}
      {slug === "quick-sort" && (
        <div className="h-full flex items-end gap-1">
          {bars.map((b, i) => (
            <div
              key={i}
              className={`w-[18px] rounded-t ${
                i === 4 ? "bg-accent scale-x-110" : i < 4 ? "bg-primary/25 dark:bg-primary-light/25" : "bg-secondary/35"
              }`}
              style={{ height: `${b}%` }}
            />
          ))}
        </div>
      )}
      {slug === "heap-sort" && (
        <div className="h-full flex items-end gap-1">
          {[32, 58, 72, 85, 72, 58, 32].map((b, i) => (
            <div
              key={i}
              className={`w-[18px] rounded-t ${i === 3 ? "bg-accent" : "bg-primary/60 dark:bg-primary-light/60"}`}
              style={{ height: `${b}%` }}
            />
          ))}
        </div>
      )}
      {slug === "linear-search" && (
        <div className="h-full flex flex-col items-center justify-center gap-1.5">
          <div className="flex items-end gap-1">
            {bars.map((b, i) => (
              <div
                key={i}
                className={`w-[18px] rounded-t ${i === 5 ? "bg-accent" : "bg-primary/25 dark:bg-primary-light/25"}`}
                style={{ height: `${b}%` }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 font-mono text-[7px] text-faint">
            <Search size={10} className="text-accent" />
            <span>linear scan</span>
          </div>
        </div>
      )}
      {slug === "binary-search" && (
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <div className="flex items-end gap-1">
            {bars.map((b, i) => (
              <div
                key={i}
                className={`w-[18px] rounded-t ${
                  i === 4
                    ? "bg-accent scale-y-110"
                    : i === 2 || i === 6
                      ? "bg-primary/50 dark:bg-primary-light/50"
                      : "bg-primary/15 dark:bg-primary-light/15"
                }`}
                style={{ height: `${b}%` }}
              />
            ))}
          </div>
          <div className="flex gap-1.5 font-mono text-[7px] leading-none text-white">
            <span className="px-1 py-0.5 rounded-sm bg-primary-fill/70">lo</span>
            <span className="px-1 py-0.5 rounded-sm bg-accent-fill">mid</span>
            <span className="px-1 py-0.5 rounded-sm bg-primary-fill/70">hi</span>
          </div>
        </div>
      )}
      {slug === "bfs" && (
        <div className="relative w-full h-full text-primary">
          <svg viewBox="0 0 120 70" className="w-full h-full">
            <line x1={40} y1={35} x2={80} y2={15} stroke="currentColor" strokeWidth="1.5" className="opacity-40" />
            <line x1={40} y1={35} x2={80} y2={55} stroke="currentColor" strokeWidth="1.5" className="opacity-40" />
            <line x1={40} y1={35} x2={20} y2={15} stroke="currentColor" strokeWidth="1.5" className="opacity-40" />
            <circle cx={40} cy={35} r={14} fill="none" stroke="currentColor" strokeDasharray="3 3" className="opacity-40" />
            <circle cx={40} cy={35} r={8} className="fill-primary" />
            <circle cx={80} cy={15} r={8} className="fill-secondary" />
            <circle cx={80} cy={55} r={8} className="fill-secondary" />
            <circle cx={20} cy={15} r={8} className="fill-primary/30 dark:fill-primary-light/30" />
          </svg>
        </div>
      )}
      {slug === "dfs" && (
        <div className="relative w-full h-full text-primary">
          <svg viewBox="0 0 120 70" className="w-full h-full">
            <line x1={40} y1={35} x2={80} y2={55} stroke="currentColor" strokeWidth="1.5" className="opacity-30" />
            <path d="M40 35 L80 15 L20 15" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-80" />
            <circle cx={40} cy={35} r={8} className="fill-primary" />
            <circle cx={80} cy={15} r={8} className="fill-accent" />
            <circle cx={80} cy={55} r={8} className="fill-primary/25 dark:fill-primary-light/25" />
            <circle cx={20} cy={15} r={8} className="fill-accent/70" />
          </svg>
        </div>
      )}
      {slug === "dijkstra" && (
        <div className="relative w-full h-full text-primary">
          <svg viewBox="0 0 120 70" className="w-full h-full">
            <line x1={40} y1={35} x2={80} y2={15} stroke="currentColor" strokeWidth="1.5" className="opacity-50" />
            <line x1={40} y1={35} x2={80} y2={55} stroke="currentColor" strokeWidth="1.5" className="opacity-50" />
            <line x1={40} y1={35} x2={20} y2={15} stroke="currentColor" strokeWidth="1.5" className="opacity-50" />
            <text x={56} y={22} fontSize={7} textAnchor="middle" className="fill-primary opacity-60">
              2
            </text>
            <text x={56} y={48} fontSize={7} textAnchor="middle" className="fill-primary opacity-60">
              5
            </text>
            <text x={26} y={22} fontSize={7} textAnchor="middle" className="fill-primary opacity-60">
              3
            </text>
            <circle cx={40} cy={35} r={8} className="fill-primary" />
            <circle cx={80} cy={15} r={8} className="fill-secondary" />
            <circle cx={80} cy={55} r={8} className="fill-primary/25 dark:fill-primary-light/25" />
            <circle cx={20} cy={15} r={8} className="fill-accent" />
          </svg>
        </div>
      )}
    </div>
  );
}

export function AlgorithmCard({ item }: { item: Algorithm }) {
  return (
    <Link href={`/algorithms/${item.slug}`} className="card card-hover p-6 flex flex-col gap-4 group">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{item.name}</h3>
        <span className={difficultyClass[item.difficulty]}>{item.difficulty}</span>
      </div>
      <AlgorithmPreview slug={item.slug} />
      <p className="text-sm text-muted line-clamp-2">{item.shortDescription}</p>
      <div className="mt-auto flex items-center justify-between font-mono text-[11px] text-faint">
        <span className="flex items-center gap-1">
          <Gauge size={12} />
          avg {item.timeComplexity.average}
        </span>
        <span className="flex items-center gap-1 text-primary group-hover:translate-x-0.5 transition-transform">
          open <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}