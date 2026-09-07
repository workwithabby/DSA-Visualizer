"use client";

import { createContext, useContext, useCallback, useMemo, useSyncExternalStore, ReactNode } from "react";

export type TopicStatus = "visited" | "in-progress" | "completed";

interface ProgressContextValue {
  statuses: Record<string, TopicStatus>;
  markVisited: (slug: string) => void;
  markStarted: (slug: string) => void;
  markCompleted: (slug: string) => void;
}

const STORAGE_KEY = "dsa-progress-v1";
const RANK: Record<TopicStatus, number> = { visited: 1, "in-progress": 2, completed: 3 };

const listeners = new Set<() => void>();
const EMPTY_STATUSES: Record<string, TopicStatus> = {};
let statuses: Record<string, TopicStatus> = EMPTY_STATUSES;

function readStoredProgress(): Record<string, TopicStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, TopicStatus>) : {};
  } catch {
    return {};
  }
}

if (typeof window !== "undefined") {
  statuses = readStoredProgress();
}

function updateProgress(slug: string, to: TopicStatus) {
  const current = statuses[slug];
  if (current && RANK[current] >= RANK[to]) return;
  const next = { ...statuses, [slug]: to };
  statuses = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((listener) => listener());
}

const progressStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot(): Record<string, TopicStatus> {
    return statuses;
  },
  getServerSnapshot(): Record<string, TopicStatus> {
    return EMPTY_STATUSES;
  },
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const currentStatuses = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getServerSnapshot
  );

  const markVisited = useCallback((slug: string) => updateProgress(slug, "visited"), []);
  const markStarted = useCallback((slug: string) => updateProgress(slug, "in-progress"), []);
  const markCompleted = useCallback((slug: string) => updateProgress(slug, "completed"), []);

  const value = useMemo<ProgressContextValue>(
    () => ({ statuses: currentStatuses, markVisited, markStarted, markCompleted }),
    [currentStatuses, markVisited, markStarted, markCompleted]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}