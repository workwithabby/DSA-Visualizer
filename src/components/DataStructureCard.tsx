"use client";

import Link from "next/link";
import { ArrowRight, Clock, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { DataStructure } from "@/lib/types";

const difficultyClass: Record<string, string> = {
  Beginner: "tag tag-beginner",
  Intermediate: "tag tag-intermediate",
  Advanced: "tag tag-advanced",
};

function StructurePreview({ slug }: { slug: string }) {
  return (
    <div className="h-20 flex items-center justify-center gap-2 p-2 border border-rule rounded-md bg-ink/[0.02] overflow-hidden">
      {slug === "array" && (
        <div className="h-full flex items-end gap-1.5">
          {[10, 25, 15, 30, 20].map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-8 bg-primary/70 dark:bg-primary-light/70 rounded-sm text-white text-[10px] flex items-center justify-center font-bold">
                {v}
              </div>
              <span className="font-mono text-[7px] text-faint leading-none">{i}</span>
            </div>
          ))}
        </div>
      )}
      {slug === "linked-list" && (
        <div className="h-full flex items-center gap-1">
          {["A", "B", "C", "D"].map((v, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-8 h-8 bg-primary/70 dark:bg-primary-light/70 rounded-sm text-white text-[10px] flex items-center justify-center font-bold">
                {v}
              </div>
              {i < 3 && <ChevronRight size={14} className="text-primary" />}
            </div>
          ))}
          <span className="font-mono text-[8px] text-faint ml-0.5">null</span>
        </div>
      )}
      {slug === "stack" && (
        <div className="h-full flex flex-col items-center justify-end gap-1">
          <span className="font-mono text-[7px] text-faint leading-none">top</span>
          <div className="flex flex-col-reverse gap-1">
            {["D", "C", "B", "A"].map((v, i) => (
              <div
                key={i}
                className="w-12 h-[15px] bg-primary/70 dark:bg-primary-light/70 rounded-sm text-white text-[8px] flex items-center justify-center font-bold"
              >
                {v}
              </div>
            ))}
          </div>
        </div>
      )}
      {slug === "queue" && (
        <div className="h-full flex flex-col justify-center gap-1">
          <div className="flex w-48 justify-between font-mono text-[7px] text-faint leading-none px-1">
            <span>front</span>
            <span>back</span>
          </div>
          <div className="flex gap-1">
            {["a", "b", "c", "d", "e"].map((v) => (
              <div
                key={v}
                className="w-9 h-6 bg-secondary/70 rounded-sm text-white text-[9px] flex items-center justify-center font-bold"
              >
                {v}
              </div>
            ))}
          </div>
          <div className="flex items-center text-secondary">
            <span className="h-px bg-secondary/70 flex-1" />
            <ArrowRight size={10} />
          </div>
        </div>
      )}
      {slug === "deque" && (
        <div className="h-full flex items-center gap-1">
          <ChevronsLeft size={15} className="text-secondary" />
          <div className="flex gap-1">
            {["a", "b", "c", "d"].map((v) => (
              <div
                key={v}
                className="w-9 h-7 bg-secondary/70 rounded-sm text-white text-[9px] flex items-center justify-center font-bold"
              >
                {v}
              </div>
            ))}
          </div>
          <ChevronsRight size={15} className="text-secondary" />
        </div>
      )}
      {slug === "binary-tree" && (
        <div className="relative w-full h-full text-primary">
          <svg viewBox="0 0 120 68" className="w-full h-full">
            <line x1={60} y1={20} x2={36} y2={42} stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            <line x1={60} y1={20} x2={84} y2={42} stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            <line x1={36} y1={42} x2={20} y2={60} stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            <line x1={36} y1={42} x2={52} y2={60} stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            <circle cx={60} cy={18} r={8} className="fill-primary" />
            <circle cx={36} cy={42} r={7} className="fill-secondary" />
            <circle cx={84} cy={42} r={7} className="fill-accent" />
            <circle cx={20} cy={60} r={6} className="fill-primary/70 dark:fill-primary-light/70" />
            <circle cx={52} cy={60} r={6} className="fill-primary/70 dark:fill-primary-light/70" />
          </svg>
        </div>
      )}
      {slug === "binary-search-tree" && (
        <div className="relative w-full h-full text-primary">
          <svg viewBox="0 0 120 68" className="w-full h-full">
            <line x1={60} y1={20} x2={36} y2={42} stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            <line x1={60} y1={20} x2={84} y2={42} stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            <line x1={36} y1={42} x2={20} y2={60} stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            <line x1={36} y1={42} x2={52} y2={60} stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            {[
              [60, 18, "12", "fill-primary"],
              [36, 42, "5", "fill-secondary"],
              [84, 42, "18", "fill-accent"],
              [20, 60, "3", "fill-primary"],
              [52, 60, "8", "fill-secondary"],
            ].map(([cx, cy, label, fill], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={8} className={fill as string} />
                <text x={cx} y={cy} textAnchor="middle" dy="0.3em" fontSize="7" fill="#fff" fontWeight="bold">
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
      {slug === "heap" && (
        <div className="relative w-full h-full text-accent">
          <svg viewBox="0 0 120 68" className="w-full h-full">
            <line x1={60} y1={20} x2={44} y2={44} stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            <line x1={60} y1={20} x2={76} y2={44} stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            <line x1={44} y1={44} x2={28} y2={60} stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            <line x1={44} y1={44} x2={60} y2={60} stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            <text x={52} y={25} fontSize="7" className="fill-accent opacity-60" textAnchor="middle">
              ≤
            </text>
            <text x={60} y={45} fontSize="7" className="fill-accent opacity-60" textAnchor="middle">
              ≤
            </text>
            <text x={52} y={52} fontSize="7" className="fill-accent opacity-60" textAnchor="middle">
              ≤
            </text>
            <circle cx={60} cy={18} r={8} className="fill-accent" />
            <circle cx={44} cy={44} r={7} className="fill-secondary" />
            <circle cx={76} cy={44} r={7} className="fill-primary/80 dark:fill-primary-light/80" />
            <circle cx={28} cy={60} r={6} className="fill-accent/60" />
            <circle cx={60} cy={60} r={6} className="fill-primary/60 dark:fill-primary-light/60" />
          </svg>
        </div>
      )}
      {slug === "graph" && (
        <div className="relative w-full h-full text-primary">
          <svg viewBox="0 0 120 70" className="w-full h-full">
            <line x1={40} y1={35} x2={80} y2={15} stroke="currentColor" strokeWidth="1.5" className="opacity-50" />
            <line x1={40} y1={35} x2={80} y2={55} stroke="currentColor" strokeWidth="1.5" className="opacity-50" />
            <line x1={40} y1={35} x2={20} y2={15} stroke="currentColor" strokeWidth="1.5" className="opacity-50" />
            <line x1={80} y1={15} x2={80} y2={55} stroke="currentColor" strokeWidth="1.5" className="opacity-30" />
            <circle cx={40} cy={35} r={8} className="fill-primary" />
            <circle cx={80} cy={15} r={7} className="fill-secondary" />
            <circle cx={80} cy={55} r={7} className="fill-accent" />
            <circle cx={20} cy={15} r={7} className="fill-success" />
          </svg>
        </div>
      )}
      {slug === "trie" && (
        <div className="h-full flex items-center gap-1.5 font-mono font-bold text-primary">
          <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-current text-[9px]">R</span>
          <ArrowRight size={12} className="text-faint" />
          <div className="flex flex-col gap-[5px]">
            {[
              ["c", "a", "t"],
              ["c", "o", "w"],
            ].map((word, wi) => (
              <div key={wi} className="flex items-center gap-[3px]">
                {word.map((ch, i) => (
                  <span
                    key={i}
                    className={`flex items-center justify-center w-4 h-4 rounded-sm text-[8px] ${
                      i === word.length - 1 ? "bg-primary text-white dark:bg-primary-light" : "bg-primary/15 text-primary dark:text-primary-light"
                    }`}
                  >
                    {ch}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {slug === "hash-table" && (
        <div className="h-full flex flex-col justify-center gap-1 font-mono text-[8px]">
          {[
            ["1", "alice"],
            ["2", "bob"],
            ["3", "carol"],
          ].map(([k, v], i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="flex items-center justify-center w-4 h-4 bg-primary/70 dark:bg-primary-light/70 rounded-sm text-white font-bold">
                {k}
              </span>
              <span className="text-faint">→</span>
              <span className="flex items-center justify-center w-14 h-[15px] bg-primary/10 dark:bg-primary-light/10 border border-primary/30 dark:border-primary-light/30 rounded-sm text-primary dark:text-primary-light">
                {v}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DataStructureCard({ item }: { item: DataStructure }) {
  return (
    <Link href={`/data-structures/${item.slug}`} className="card card-hover p-6 flex flex-col gap-4 group">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{item.name}</h3>
        <span className={difficultyClass[item.difficulty]}>{item.difficulty}</span>
      </div>
      <StructurePreview slug={item.slug} />
      <p className="text-sm text-muted line-clamp-2">{item.shortDescription}</p>
      <div className="flex flex-wrap gap-1.5">
        {item.operations.map((op) => (
          <span key={op} className="font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border border-rule text-muted">
            {op}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between font-mono text-[11px] text-faint">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          search {item.timeComplexity.search}
        </span>
        <span className="flex items-center gap-1 text-primary group-hover:translate-x-0.5 transition-transform">
          open <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}