"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSoundContext } from "@/components/SoundProvider";
import { sounds } from "@/lib/sounds";
import { useProgress } from "@/components/ProgressProvider";

interface GraphVisualizerProps {
  topicSlug?: string;
}

interface GNode {
  id: string;
  x: number;
  y: number;
}

interface GEdge {
  from: string;
  to: string;
}

const DEFAULT_NODES: GNode[] = [
  { id: "A", x: 200, y: 40 },
  { id: "B", x: 90, y: 130 },
  { id: "C", x: 310, y: 130 },
  { id: "D", x: 40, y: 250 },
  { id: "E", x: 200, y: 250 },
  { id: "F", x: 360, y: 250 },
];

const DEFAULT_EDGES: GEdge[] = [
  { from: "A", to: "B" },
  { from: "A", to: "C" },
  { from: "B", to: "D" },
  { from: "B", to: "E" },
  { from: "C", to: "F" },
  { from: "D", to: "E" },
  { from: "E", to: "F" },
];

export function GraphStructureVisualizer({ topicSlug }: GraphVisualizerProps) {
  const [nodes, setNodes] = useState<GNode[]>(DEFAULT_NODES);
  const [edges, setEdges] = useState<GEdge[]>(DEFAULT_EDGES);
  const [inputId, setInputId] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [lastOperation, setLastOperation] = useState("");

  const { soundEnabled } = useSoundContext();
  const { markStarted } = useProgress();

  const playSound = (fn: () => void) => {
    if (soundEnabled) fn();
  };

  const addNode = () => {
    const id = inputId.trim().toUpperCase();
    if (!id) return;
    if (nodes.some((n) => n.id === id)) {
      setLastOperation(`Node "${id}" already exists`);
      return;
    }
    const x = 50 + (nodes.length % 4) * 100;
    const y = 300 + Math.floor(nodes.length / 4) * 80;
    setNodes((prev) => [...prev, { id, x, y }]);
    setLastOperation(`Added vertex "${id}"`);
    playSound(sounds.insert);
    setInputId("");
    if (topicSlug) markStarted(topicSlug);
  };

  const addEdge = () => {
    const from = edgeFrom.trim().toUpperCase();
    const to = edgeTo.trim().toUpperCase();
    if (!from || !to) return;
    if (from === to) {
      setLastOperation(`Cannot create self-loop between ${from} and itself`);
      return;
    }
    if (!nodes.some((n) => n.id === from) || !nodes.some((n) => n.id === to)) {
      setLastOperation(`Both vertices must exist first`);
      return;
    }
    if (edges.some((e) => (e.from === from && e.to === to) || (e.from === to && e.to === from))) {
      setLastOperation(`Edge ${from}-${to} already exists`);
      return;
    }
    setEdges((prev) => [...prev, { from, to }]);
    setLastOperation(`Added edge ${from} — ${to}`);
    playSound(sounds.insert);
    setEdgeFrom("");
    setEdgeTo("");
    if (topicSlug) markStarted(topicSlug);
  };

  const randomize = () => {
    const n = 5 + Math.floor(Math.random() * 3);
    const newNodes: GNode[] = Array.from({ length: n }, (_, i) => ({
      id: String.fromCharCode(65 + i),
      x: 70 + (i % 3) * 120,
      y: 40 + Math.floor(i / 3) * 140,
    }));
    const newEdges: GEdge[] = [];
    for (let i = 0; i < n; i++) {
      if (i + 1 < n && Math.random() > 0.2) {
        newEdges.push({ from: newNodes[i].id, to: newNodes[i + 1].id });
      }
      if (i + 2 < n && Math.random() > 0.6) {
        newEdges.push({ from: newNodes[i].id, to: newNodes[i + 2].id });
      }
    }
    setNodes(newNodes);
    setEdges(newEdges);
    setLastOperation(`Randomized graph with ${n} vertices and ${newEdges.length} edges`);
    playSound(sounds.insert);
    if (topicSlug) markStarted(topicSlug);
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
    setLastOperation(`Removed vertex "${id}" and its incident edges`);
    playSound(sounds.delete);
  };

  const width = 420;
  const height = Math.max(...nodes.map((n) => n.y), 50) + 50;

  return (
    <div className="space-y-6">
      <div className="visualizer-box p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Graph Visualizer</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Vertices: <span className="font-bold">{nodes.length}</span> · Edges:{" "}
            <span className="font-bold">{edges.length}</span>
          </div>
        </div>

        <div className="flex justify-center overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[400px]">
            {edges.map((edge, i) => {
              const from = nodes.find((n) => n.id === edge.from);
              const to = nodes.find((n) => n.id === edge.to);
              if (!from || !to) return null;
              return (
                <line
                  key={`${i}-${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  className="dark:stroke-gray-500"
                />
              );
            })}

            {nodes.map((node) => (
              <g key={node.id} className="cursor-pointer" onClick={() => removeNode(node.id)}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  fill="#6366f1"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-sm font-bold fill-white pointer-events-none"
                >
                  {node.id}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">Click a vertex to remove it</p>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNode()}
            placeholder="Vertex ID (e.g. G)"
            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent font-mono text-sm focus:border-primary outline-none w-28"
          />
          <button
            onClick={addNode}
            className="px-4 py-2 bg-primary-fill text-white rounded-lg text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all"
          >
            Add Vertex
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-1" />

          <input
            type="text"
            value={edgeFrom}
            onChange={(e) => setEdgeFrom(e.target.value)}
            placeholder="From"
            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent font-mono text-sm focus:border-primary outline-none w-16"
          />
          <span className="text-gray-400">—</span>
          <input
            type="text"
            value={edgeTo}
            onChange={(e) => setEdgeTo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addEdge()}
            placeholder="To"
            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent font-mono text-sm focus:border-primary outline-none w-16"
          />
          <button
            onClick={addEdge}
            className="px-4 py-2 bg-secondary/10 text-secondary font-semibold rounded-lg text-sm hover:bg-secondary-fill hover:text-white transition-all active:scale-95"
          >
            Add Edge
          </button>

          <button
            onClick={randomize}
            className="px-4 py-2 bg-accent/10 text-accent font-semibold rounded-lg text-sm hover:bg-accent-fill hover:text-white transition-all active:scale-95"
          >
            Randomize
          </button>

          <div className="ml-auto card px-4 py-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 text-xs mr-2">Last:</span>
            <span className="font-medium">{lastOperation || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
