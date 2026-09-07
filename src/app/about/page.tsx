import { Info, PlayCircle } from "lucide-react";
import { ProgressSection } from "@/components/ProgressSection";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="text-center mb-14">
        <p className="eyebrow">
          <span className="register" /> about · the project
        </p>
        <h1 className="mt-3 text-4xl font-bold">About DSA Visualizer</h1>
        <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
          An interactive learning tool for Data Structures &amp; Algorithms.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-md border border-rule bg-ink/[0.02] flex items-center justify-center text-primary">
              <Info size={20} />
            </span>
            <div>
              <p className="eyebrow">
                <span className="register" /> why
              </p>
              <h2 className="text-xl font-bold mt-0.5">Our Mission</h2>
            </div>
          </div>
          <p className="text-muted leading-relaxed">
            DSA Visualizer was created with one simple idea: <strong className="text-ink">algorithms are easier to understand when you can see them in action.</strong>
          </p>
          <p className="text-muted leading-relaxed mt-4">
            Instead of just reading about data structures and algorithms, you can watch how they work through simple explanations and interactive visualizations.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            Whether you&apos;re a student or a beginner learning to code, our goal is to make DSA easier, clearer, and more fun to learn.          </p>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-md border border-rule bg-ink/[0.02] flex items-center justify-center text-primary">
              <PlayCircle size={20} />
            </span>
            <div>
              <p className="eyebrow">
                <span className="register" /> method
              </p>
              <h2 className="text-xl font-bold mt-0.5">The learning philosophy</h2>
            </div>
          </div>
          <ol className="space-y-4">
            {[
              { step: "Read", desc: "Start with a simple, jargon-free explanation" },
              { step: "Visualize", desc: "Watch any operation animate in real-time" },
              { step: "Interact", desc: "Contribute your own data and control each step" },
              { step: "Practice", desc: "Run the algorithms yourself and test what you learned" },
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-7 h-7 rounded-md border border-rule bg-ink/[0.02] flex items-center justify-center font-mono text-xs text-primary flex-shrink-0">
                  0{i + 1}
                </span>
                <div>
                  <div className="font-semibold">{item.step}</div>
                  <div className="text-sm text-muted">{item.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Learning progress */}
      <ProgressSection />
    </div>
  );
}