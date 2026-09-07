import { CheckCircle2, PlayCircle, Info } from "lucide-react";

export default function AboutPage() {
  const completed = [
    { name: "Array", progress: 100 },
    { name: "Stack", progress: 100 },
    { name: "Queue", progress: 100 },
    { name: "Bubble Sort", progress: 100 },
  ];

  const inProgress = [
    { name: "Binary Search", progress: 45 },
    { name: "Merge Sort", progress: 30 },
    { name: "Binary Tree", progress: 15 },
  ];

  const stats = {
    ds: Math.round(completed.length / 11 * 100),
    alg: 3 / algorithmsCount() * 100,
  };

  function algorithmsCount() {
    return 10;
  }

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
              <h2 className="text-xl font-bold mt-0.5">Our mission</h2>
            </div>
          </div>
          <p className="text-muted leading-relaxed">
            DSA Visualizer was created with one simple idea: <strong className="text-ink">algorithms are easier to understand when you can see them work.</strong>
            Most students struggle with DSA because they read about operations but never see them happen. We bridge that gap by combining
            clear explanations with interactive, animated visualizations.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            Whether you&apos;re a CS student preparing for interviews, an IT student learning fundamentals, or a self-learning programmer,
            our goal is to make DSA feel approachable — like an interactive playground rather than a textbook.
          </p>
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
      <div className="max-w-3xl mx-auto card p-8">
        <p className="eyebrow text-center">
          <span className="register" /> tracking
        </p>
        <h3 className="text-2xl font-bold mb-6 text-center">Your progress</h3>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center font-mono text-[11px] uppercase tracking-wide mb-2">
              <span className="text-faint">data structures</span>
              <span className="font-bold text-primary">{Math.round(stats.ds)}%</span>
            </div>
            <div className="h-1.5 rounded bg-ink/[0.06] overflow-hidden">
              <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${stats.ds}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center font-mono text-[11px] uppercase tracking-wide mb-2">
              <span className="text-faint">algorithms</span>
              <span className="font-bold text-secondary">{Math.round(stats.alg)}%</span>
            </div>
            <div className="h-1.5 rounded bg-ink/[0.06] overflow-hidden">
              <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${stats.alg}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="font-mono text-[11px] uppercase tracking-wide text-faint mb-3">Completed topics</div>
          <div className="flex flex-wrap gap-2">
            {completed.map((item) => (
              <span key={item.name} className="tag tag-beginner">
                <CheckCircle2 size={12} className="mr-1" /> {item.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="font-mono text-[11px] uppercase tracking-wide text-faint mb-3">In progress</div>
          <div className="flex flex-wrap gap-2">
            {inProgress.map((item) => (
              <span key={item.name} className="tag">
                <PlayCircle size={12} className="mr-1 text-primary" /> {item.name} · {item.progress}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}