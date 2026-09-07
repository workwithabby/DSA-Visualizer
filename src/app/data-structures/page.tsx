import { dataStructures } from "@/lib/data";
import { DataStructureCard } from "@/components/DataStructureCard";
import { DataStructure } from "@/lib/types";

function DataStructuresPage() {
  const categories: Array<{ name: string; description: string; items: DataStructure[] }> = [
    {
      name: "Linear",
      description: "Elements arranged in a sequential order",
      items: dataStructures.filter((d) => d.category === "Linear"),
    },
    {
      name: "Non-Linear",
      description: "Elements arranged hierarchically",
      items: dataStructures.filter((d) => d.category === "Non-Linear"),
    },
    {
      name: "Hash-Based",
      description: "Key-value storage with fast access",
      items: dataStructures.filter((d) => d.category === "Hash-Based"),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-14">
        <p className="eyebrow">
          <span className="register" /> fig. 01 · index
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold">Data Structures</h1>
        <p className="mt-4 text-lg text-muted max-w-2xl">
          Explore interactive visualizations of common data structures. Click a card to see how it works, interact with it, and understand it.
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
            <span className="font-mono text-[11px] text-faint">{category.items.length} items</span>
          </div>
          <p className="text-sm text-muted mb-6">{category.description}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {category.items.map((item) => (
              <DataStructureCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default DataStructuresPage;