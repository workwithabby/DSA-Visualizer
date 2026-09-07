import { algorithms } from "@/lib/data";
import { AlgorithmCard } from "@/components/AlgorithmCard";
import { Algorithm } from "@/lib/types";

function AlgorithmsPage() {
  const categories: Array<{ name: string; description: string; items: Algorithm[] }> = [
    {
      name: "Searching",
      description: "Find elements within data collections",
      items: algorithms.filter((a) => a.category === "Searching"),
    },
    {
      name: "Sorting",
      description: "Arrange elements in a specific order",
      items: algorithms.filter((a) => a.category === "Sorting"),
    },
    {
      name: "Graph Algorithms",
      description: "Solve problems on graph structures",
      items: algorithms.filter((a) => a.category === "Graph"),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-14">
        <p className="eyebrow">
          <span className="register" /> fig. 01 · index
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold">Algorithms</h1>
        <p className="mt-4 text-lg text-muted max-w-2xl">
          Follow algorithms step by step with synchronized code highlighting. Watch, interact, and truly understand how they work.
        </p>
      </header>

      {categories.map((category, ci) => (
        <section key={category.name} className="mb-16 last:mb-0">
          <div className="flex items-center gap-4 mb-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              fig. 0{ci + 2} · plate
            </span>
            <h2 className="text-2xl font-bold">{category.name}</h2>
            <div className="h-px flex-1 bg-rule" />
            <span className="font-mono text-[11px] text-faint">{category.items.length} algorithms</span>
          </div>
          <p className="text-sm text-muted mb-6">{category.description}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {category.items.map((item) => (
              <AlgorithmCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default AlgorithmsPage;