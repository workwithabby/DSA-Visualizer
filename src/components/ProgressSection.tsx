"use client";

import { CheckCircle2, PlayCircle } from "lucide-react";
import { useProgress } from "./ProgressProvider";
import { dataStructures, algorithms } from "@/lib/data";

export function ProgressSection() {
  const { statuses } = useProgress();

  const dsCompleted = dataStructures.filter((ds) => statuses[ds.slug] === "completed");
  const dsInProgress = dataStructures.filter(
    (ds) => statuses[ds.slug] === "in-progress" || statuses[ds.slug] === "visited"
  );
  const algCompleted = algorithms.filter((a) => statuses[a.slug] === "completed");
  const algInProgress = algorithms.filter(
    (a) => statuses[a.slug] === "in-progress" || statuses[a.slug] === "visited"
  );

  const dsPct = Math.round((dsCompleted.length / dataStructures.length) * 100);
  const algPct = Math.round((algCompleted.length / algorithms.length) * 100);

  return (
    <div className="max-w-3xl mx-auto card p-8">
      <p className="eyebrow text-center">
        <span className="register" /> tracking
      </p>
      <h3 className="text-2xl font-bold mb-6 text-center">Your progress</h3>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center font-mono text-[11px] uppercase tracking-wide mb-2">
            <span className="text-faint">data structures</span>
            <span className="font-bold text-primary">
              {dsCompleted.length}/{dataStructures.length} · {dsPct}%
            </span>
          </div>
          <div className="h-1.5 rounded bg-ink/[0.06] overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${dsPct}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center font-mono text-[11px] uppercase tracking-wide mb-2">
            <span className="text-faint">algorithms</span>
            <span className="font-bold text-secondary">
              {algCompleted.length}/{algorithms.length} · {algPct}%
            </span>
          </div>
          <div className="h-1.5 rounded bg-ink/[0.06] overflow-hidden">
            <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${algPct}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="font-mono text-[11px] uppercase tracking-wide text-faint mb-3">Completed topics</div>
        {dsCompleted.length + algCompleted.length === 0 ? (
          <p className="text-sm text-faint">Nothing yet — open a topic page and run its visualizer.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {[...dsCompleted, ...algCompleted].map((item) => (
              <span key={item.slug} className="tag tag-beginner">
                <CheckCircle2 size={12} className="mr-1" /> {item.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="font-mono text-[11px] uppercase tracking-wide text-faint mb-3">In progress</div>
        {dsInProgress.length + algInProgress.length === 0 ? (
          <p className="text-sm text-faint">Topics you visit or start running will show up here.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {[...dsInProgress, ...algInProgress].map((item) => (
              <span key={item.slug} className="tag">
                <PlayCircle size={12} className="mr-1 text-primary" /> {item.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}