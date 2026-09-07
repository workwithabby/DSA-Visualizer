import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { algorithms } from "@/lib/data";
import { Algorithm } from "@/lib/types";
import { ComplexityCard } from "@/components/ComplexityCard";
import { SortingVisualizer } from "@/visualizers/SortingVisualizer";
import { SearchingVisualizer } from "@/visualizers/SearchingVisualizer";
import { CodeViewer } from "@/components/CodeViewer";
import { ProgressVisit } from "@/components/ProgressVisit";
import {
  bubbleSortCode,
  linearSearchCode,
  binarySearchCode,
} from "@/lib/codeSnippets";

const difficultyClass: Record<string, string> = {
  Beginner: "tag tag-beginner",
  Intermediate: "tag tag-intermediate",
  Advanced: "tag tag-advanced",
};

export async function generateStaticParams() {
  return algorithms.map((a) => ({ slug: a.slug }));
}

const SORTING_ALGOS = ["bubble-sort", "selection-sort", "insertion-sort", "merge-sort", "quick-sort", "heap-sort"];
const SEARCHING_ALGOS = ["linear-search", "binary-search"];

function renderVisualizer(slug: string) {
  if (SORTING_ALGOS.includes(slug)) {
    const algoMap: Record<string, "bubble" | "selection" | "insertion" | "merge" | "quick"> = {
      "bubble-sort": "bubble",
      "selection-sort": "selection",
      "insertion-sort": "insertion",
      "merge-sort": "merge",
      "quick-sort": "quick",
      "heap-sort": "bubble",
    };
    return <SortingVisualizer algorithm={algoMap[slug]} topicSlug={slug} />;
  }
  if (SEARCHING_ALGOS.includes(slug)) {
    return <SearchingVisualizer algo={slug === "binary-search" ? "binary" : "linear"} topicSlug={slug} />;
  }
  return <SearchingVisualizer algo="linear" topicSlug={slug} />;
}

function renderCodeViewer(slug: string, activeLine: number | undefined) {
  if (slug === "bubble-sort") return <CodeViewer codeBlocks={bubbleSortCode} activeLine={activeLine} />;
  if (slug === "linear-search") return <CodeViewer codeBlocks={linearSearchCode} activeLine={activeLine} />;
  if (slug === "binary-search") return <CodeViewer codeBlocks={binarySearchCode} activeLine={activeLine} />;
  return <CodeViewer codeBlocks={bubbleSortCode} activeLine={activeLine} />;
}

export default async function AlgorithmDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const algorithm = algorithms.find((a) => a.slug === slug);

  if (!algorithm) {
    notFound();
  }

  const algoData: Algorithm = algorithm;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProgressVisit slug={slug} />
      <Link
        href="/algorithms"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-faint hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={14} /> back to algorithms
      </Link>

      {/* Header */}
      <div className="mb-10">
        <p className="eyebrow">
          <span className="register" /> algorithm · {algoData.category.toLowerCase()}
        </p>
        <div className="flex items-center gap-3 flex-wrap mt-3">
          <h1 className="text-4xl sm:text-5xl font-bold">{algoData.name}</h1>
          <span className={difficultyClass[algoData.difficulty]}>{algoData.difficulty}</span>
        </div>
        <p className="mt-3 text-lg text-primary font-medium">{algoData.shortDescription}</p>
      </div>

      {/* Description + complexity */}
      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <p className="eyebrow">
                <span className="register" /> anatomy
              </p>
              <h2 className="text-xl font-bold">What is it?</h2>
            </div>
            <p className="text-ink/80 leading-relaxed">{algoData.description}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <p className="eyebrow">
                <span className="register" /> procedure
              </p>
              <h2 className="text-xl font-bold">How does it work?</h2>
            </div>
            <ol className="space-y-3">
              {algoData.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-0 w-6 h-6 rounded-md border border-rule bg-ink/[0.02] font-mono text-[11px] text-primary font-semibold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted">{step.description}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <p className="eyebrow">
                <span className="register" /> applications
              </p>
              <h3 className="font-bold flex items-center gap-2 text-accent">
                <Lightbulb size={18} /> Real-world use
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {algoData.useCases.map((use) => (
                <span key={use} className="tag">{use}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ComplexityCard
            title="Time Complexity"
            rows={[
              { label: "Best Case", value: algoData.timeComplexity.best, color: "text-success" },
              { label: "Average Case", value: algoData.timeComplexity.average, color: "text-accent" },
              { label: "Worst Case", value: algoData.timeComplexity.worst, color: "text-error" },
            ]}
          />
          <ComplexityCard
            title="Space Complexity"
            rows={[{ label: "Space", value: algoData.spaceComplexity, color: "text-primary" }]}
          />
        </div>
      </div>

      {/* Visualization */}
      <section className="mb-12">
        <p className="eyebrow">
          <span className="register" /> interactive demo
        </p>
        <h2 className="text-2xl font-bold mb-6">Visualizer</h2>
        {renderVisualizer(slug)}
      </section>

      {/* Code */}
      <section className="mb-12">
        <p className="eyebrow">
          <span className="register" /> reference
        </p>
        <h2 className="text-2xl font-bold mb-4">Code</h2>
        {renderCodeViewer(slug, undefined)}
      </section>
    </div>
  );
}
