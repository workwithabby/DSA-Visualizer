type ComplexityRow = { label: string; value: string; color?: string };

export function ComplexityCard({
  title,
  rows,
}: {
  title: string;
  rows: ComplexityRow[];
}) {
  return (
    <div className="card p-6">
      <p className="eyebrow">
        <span className="register" /> complexity
      </p>
      <h3 className="font-bold text-lg mb-4 mt-1">{title}</h3>
      <div className="divide-y divide-rule">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
            <span className="font-mono text-[11px] uppercase tracking-wide text-faint">{row.label}</span>
            <code className={`font-mono font-semibold ${row.color || "text-primary"}`}>{row.value}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

export function timeComplexityRows(best: string, average: string, worst: string) {
  return [
    { label: "Best Case", value: best, color: "text-success" },
    { label: "Average Case", value: average, color: "text-accent" },
    { label: "Worst Case", value: worst, color: "text-error" },
  ];
}