"use client";

import { useEffect } from "react";
import { useProgress } from "./ProgressProvider";

export function ProgressVisit({ slug }: { slug: string }) {
  const { markVisited } = useProgress();

  useEffect(() => {
    markVisited(slug);
  }, [slug, markVisited]);

  return null;
}