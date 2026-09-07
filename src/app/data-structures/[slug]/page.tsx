import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { dataStructures } from "@/lib/data";
import { DataStructure } from "@/lib/types";
import { ComplexityCard } from "@/components/ComplexityCard";
import { GenericStructureVisualizer } from "@/visualizers/GenericStructureVisualizer";

const difficultyClass: Record<string, string> = {
  Beginner: "tag tag-beginner",
  Intermediate: "tag tag-intermediate",
  Advanced: "tag tag-advanced",
};

export async function generateStaticParams() {
  return dataStructures.map((ds) => ({ slug: ds.slug }));
}

function renderVisualizer(slug: string) {
  switch (slug) {
    case "array":
      return <GenericStructureVisualizer structure="array" />;
    case "linked-list":
      return <GenericStructureVisualizer structure="linked-list" />;
    case "stack":
      return <GenericStructureVisualizer structure="stack" />;
    case "queue":
      return <GenericStructureVisualizer structure="queue" />;
    case "deque":
      return <GenericStructureVisualizer structure="deque" />;
    case "hash-table":
      return <GenericStructureVisualizer structure="hash-table" />;
    default:
      return null;
  }
}

const VISUALIZABLE = ["array", "linked-list", "stack", "queue", "deque", "hash-table"];

export default async function DataStructureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ds = dataStructures.find((d) => d.slug === slug);

  if (!ds) {
    notFound();
  }

  const dsData: DataStructure = ds;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/data-structures"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-faint hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={14} /> back to data structures
      </Link>

      {/* Header */}
      <div className="mb-10">
        <p className="eyebrow">
          <span className="register" /> structure · {dsData.category.toLowerCase()}
        </p>
        <div className="flex items-center gap-3 flex-wrap mt-3">
          <h1 className="text-4xl sm:text-5xl font-bold">{dsData.name}</h1>
          <span className={difficultyClass[dsData.difficulty]}>{dsData.difficulty}</span>
        </div>
        <p className="mt-3 text-lg text-primary font-medium">{dsData.shortDescription}</p>
      </div>

      {/* Explanation section */}
      <section className="grid lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <p className="eyebrow">
                <span className="register" /> anatomy
              </p>
              <h2 className="text-xl font-bold">What is it?</h2>
            </div>
            <p className="text-ink/80 leading-relaxed">{dsData.description}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <p className="eyebrow">
                <span className="register" /> operations
              </p>
              <h2 className="text-xl font-bold">Common Operations</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {dsData.operations.map((op) => (
                <span key={op} className="tag tag-primary">{op}</span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-success">
                <CheckCircle2 size={18} /> Advantages
              </h3>
              <ul className="space-y-2">
                {dsData.advantages.map((adv) => (
                  <li key={adv} className="text-sm text-muted flex gap-2">
                    <span className="text-success">✓</span> {adv}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-error">
                <XCircle size={18} /> Disadvantages
              </h3>
              <ul className="space-y-2">
                {dsData.disadvantages.map((dis) => (
                  <li key={dis} className="text-sm text-muted flex gap-2">
                    <span className="text-error">✗</span> {dis}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <p className="eyebrow">
                <span className="register" /> applications
              </p>
              <h3 className="font-bold flex items-center gap-2 text-accent">
                <Lightbulb size={18} /> Where is it used?
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {dsData.useCases.map((use) => (
                <span key={use} className="tag">{use}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ComplexityCard
            title="Time Complexity"
            rows={[
              { label: "Access", value: dsData.timeComplexity.access },
              { label: "Search", value: dsData.timeComplexity.search },
              { label: "Insert", value: dsData.timeComplexity.insert },
              { label: "Delete", value: dsData.timeComplexity.delete },
            ]}
          />
          {(["array", "linked-list", "stack", "queue", "deque"].includes(slug)) && (
            <ComplexityCard
              title="Operation Complexities"
              rows={[
                { label: "Access", value: dsData.timeComplexity.access },
                { label: "Search", value: dsData.timeComplexity.search },
                { label: "Insert", value: dsData.timeComplexity.insert },
                { label: "Delete", value: dsData.timeComplexity.delete },
              ]}
            />
          )}
        </div>
      </section>

      {VISUALIZABLE.includes(slug) && (
        <section className="mb-12">
          <div className="mb-6">
            <p className="eyebrow">
              <span className="register" /> interactive demo
            </p>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-2xl font-bold">Visualizer</h2>
              <div className="h-px flex-1 bg-rule" />
              <span className="font-mono text-[11px] uppercase tracking-wide text-success">run it</span>
            </div>
          </div>
          {renderVisualizer(slug)}
        </section>
      )}
    </div>
  );
}
