"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSoundContext } from "@/components/SoundProvider";
import { sounds } from "@/lib/sounds";
import { StepController } from "@/components/StepController";
import { useProgress } from "@/components/ProgressProvider";

type GraphAlgo = "bfs" | "dfs" | "dijkstra";

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

interface GraphStep {
  description: string;
  explanation: string;
  why: string;
  visited: string[];
  current: string | null;
  frontier: string[];
  highlightedEdges: string[];
  distances?: Record<string, number>;
  type: "visit" | "explore" | "frontier" | "done";
}

const NODES: GraphNode[] = [
  { id: "A", label: "A", x: 200, y: 50 },
  { id: "B", label: "B", x: 80, y: 150 },
  { id: "C", label: "C", x: 320, y: 150 },
  { id: "D", label: "D", x: 30, y: 280 },
  { id: "E", label: "E", x: 200, y: 280 },
  { id: "F", label: "F", x: 370, y: 280 },
];

const EDGES: GraphEdge[] = [
  { from: "A", to: "B", weight: 4 },
  { from: "A", to: "C", weight: 2 },
  { from: "B", to: "D", weight: 5 },
  { from: "B", to: "E", weight: 10 },
  { from: "C", to: "F", weight: 3 },
  { from: "D", to: "E", weight: 1 },
  { from: "E", to: "F", weight: 8 },
];

const ADJACENCY: Record<string, { node: string; weight: number }[]> = {
  A: [
    { node: "B", weight: 4 },
    { node: "C", weight: 2 },
  ],
  B: [
    { node: "A", weight: 4 },
    { node: "D", weight: 5 },
    { node: "E", weight: 10 },
  ],
  C: [
    { node: "A", weight: 2 },
    { node: "F", weight: 3 },
  ],
  D: [
    { node: "B", weight: 5 },
    { node: "E", weight: 1 },
  ],
  E: [
    { node: "B", weight: 10 },
    { node: "D", weight: 1 },
    { node: "F", weight: 8 },
  ],
  F: [
    { node: "C", weight: 3 },
    { node: "E", weight: 8 },
  ],
};

function edgeKey(a: string, b: string): string {
  return [a, b].sort().join("-");
}

function generateBFS(start: string): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<string>();
  const queue: string[] = [start];
  visited.add(start);

  steps.push({
    description: `Start at node ${start}`,
    explanation: `Mark ${start} as visited and add it to the queue.`,
    why: "BFS explores level by level, starting from the source node.",
    visited: [],
    current: start,
    frontier: [start],
    highlightedEdges: [],
    type: "visit",
  });

  while (queue.length > 0) {
    const node = queue.shift()!;
    steps.push({
      description: `Dequeue ${node} and visit it`,
      explanation: `Remove ${node} from the front of the queue and process it.`,
      why: "BFS uses a queue (FIFO) — first in, first out ensures level-by-level exploration.",
      visited: [...visited],
      current: node,
      frontier: [...queue],
      highlightedEdges: [],
      type: "visit",
    });

    const neighbors = ADJACENCY[node];
    for (const { node: neighbor } of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        steps.push({
          description: `Discover neighbor ${neighbor} from ${node}`,
          explanation: `${neighbor} hasn't been visited. Add it to the queue.`,
          why: "We mark neighbors as visited when we first discover them to avoid revisiting.",
          visited: [...visited],
          current: node,
          frontier: [...queue],
          highlightedEdges: [edgeKey(node, neighbor)],
          type: "frontier",
        });
      }
    }
  }

  steps.push({
    description: "BFS complete!",
    explanation: "All reachable nodes have been visited in level order.",
    why: "BFS guarantees the shortest path (in terms of number of edges) from the source.",
    visited: [...visited],
    current: null,
    frontier: [],
    highlightedEdges: [],
    type: "done",
  });

  return steps;
}

function generateDFS(start: string): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<string>();
  const stack: string[] = [start];

  steps.push({
    description: `Start at node ${start}`,
    explanation: `Push ${start} onto the stack and mark as visited.`,
    why: "DFS explores as deep as possible along each branch before backtracking.",
    visited: [],
    current: start,
    frontier: [start],
    highlightedEdges: [],
    type: "visit",
  });

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited.has(node) && node !== start) continue;

    visited.add(node);
    steps.push({
      description: `Pop ${node} and visit it`,
      explanation: `Remove ${node} from the top of the stack and process it.`,
      why: "Stack (LIFO) means we go deeper before going wider.",
      visited: [...visited],
      current: node,
      frontier: [...stack],
      highlightedEdges: [],
      type: "visit",
    });

    const neighbors = ADJACENCY[node];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const { node: neighbor } = neighbors[i];
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        steps.push({
          description: `Push unvisited neighbor ${neighbor} onto stack`,
          explanation: `${neighbor} hasn't been visited. Push it to explore next.`,
          why: "We push neighbors so the last one pushed is explored first (going deep).",
          visited: [...visited],
          current: node,
          frontier: [...stack],
          highlightedEdges: [edgeKey(node, neighbor)],
          type: "frontier",
        });
      }
    }
  }

  steps.push({
    description: "DFS complete!",
    explanation: "All reachable nodes have been visited.",
    why: "DFS explores as deep as possible before backtracking, using a stack.",
    visited: [...visited],
    current: null,
    frontier: [],
    highlightedEdges: [],
    type: "done",
  });

  return steps;
}

function generateDijkstra(start: string): GraphStep[] {
  const steps: GraphStep[] = [];
  const dist: Record<string, number> = {};
  const visited = new Set<string>();

  for (const n of NODES) {
    dist[n.id] = Infinity;
  }
  dist[start] = 0;

  steps.push({
    description: `Initialize: set ${start} distance to 0, all others to infinity`,
    explanation: `Distances: ${NODES.map((n) => `${n.id}:${n.id === start ? "0" : "∞"}`).join(", ")}`,
    why: "We start with only the source known. All other distances are unknown (infinity).",
    visited: [],
    current: start,
    frontier: [start],
    highlightedEdges: [],
    distances: { ...dist },
    type: "visit",
  });

  const pq: { node: string; dist: number }[] = [{ node: start, dist: 0 }];

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { node: current, dist: currentDist } = pq.shift()!;

    if (visited.has(current)) continue;
    visited.add(current);

    const frontierSnapshot = () =>
      Array.from(new Set(pq.map((e) => e.node))).filter((n) => !visited.has(n));

    steps.push({
      description: `Extract min: ${current} (distance ${currentDist})`,
      explanation: `${current} has the smallest distance among unvisited nodes. Process it.`,
      why: "Greedy choice: the closest unvisited node cannot be improved by going through another unvisited node.",
      visited: [...visited],
      current,
      frontier: frontierSnapshot(),
      highlightedEdges: [],
      distances: { ...dist },
      type: "visit",
    });

    for (const { node: neighbor, weight } of ADJACENCY[current]) {
      if (visited.has(neighbor)) continue;
      const newDist = dist[current] + weight;
      if (newDist < dist[neighbor]) {
        const oldDist = dist[neighbor];
        dist[neighbor] = newDist;
        pq.push({ node: neighbor, dist: newDist });
        steps.push({
          description: `Update ${neighbor}: ${oldDist === Infinity ? "∞" : oldDist} -> ${newDist}`,
          explanation: `Path through ${current}: ${dist[current]} + ${weight} = ${newDist}. Shorter than before!`,
          why: "Relaxation: if going through the current node gives a shorter path, update the distance.",
          visited: [...visited],
          current,
          frontier: frontierSnapshot(),
          highlightedEdges: [edgeKey(current, neighbor)],
          distances: { ...dist },
          type: "explore",
        });
      } else {
        steps.push({
          description: `Check ${neighbor}: path via ${current} gives ${newDist}, not shorter than ${dist[neighbor]}`,
          explanation: `Current distance ${dist[neighbor]} is already <= ${newDist}. No update needed.`,
          why: "If the existing path is already shorter, we don't update.",
          visited: [...visited],
          current,
          frontier: frontierSnapshot(),
          highlightedEdges: [edgeKey(current, neighbor)],
          distances: { ...dist },
          type: "explore",
        });
      }
    }
  }

  steps.push({
    description: "Dijkstra complete!",
    explanation: `Shortest distances: ${NODES.map((n) => `${n.id}:${dist[n.id]}`).join(", ")}`,
    why: "Dijkstra finds shortest paths from the source to all reachable nodes in O((V+E) log V).",
    visited: [...visited],
    current: null,
    frontier: [],
    highlightedEdges: [],
    distances: { ...dist },
    type: "done",
  });

  return steps;
}

export function GraphVisualizer({ algo = "bfs", topicSlug }: { algo?: GraphAlgo; topicSlug?: string }) {
  const [steps, setSteps] = useState<GraphStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [showWhy, setShowWhy] = useState(false);

  const { soundEnabled } = useSoundContext();
  const { markStarted, markCompleted } = useProgress();

  const playSound = (fn: () => void) => {
    if (soundEnabled) fn();
  };

  const algoLabels: Record<GraphAlgo, string> = {
    bfs: "Breadth-First Search",
    dfs: "Depth-First Search",
    dijkstra: "Dijkstra's Algorithm",
  };

  const startSearch = (autoPlay: boolean) => {
    const generator = algo === "bfs" ? generateBFS : algo === "dfs" ? generateDFS : generateDijkstra;
    const newSteps = generator("A");
    setSteps(newSteps);
    setCurrentStepIndex(-1);
    setIsPlaying(autoPlay);
    setShowWhy(false);
    if (topicSlug) markStarted(topicSlug);
  };

  const handlePlayPause = () => {
    if (steps.length === 0) {
      startSearch(true);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const handleNext = () => {
    if (steps.length === 0) {
      startSearch(false);
      setCurrentStepIndex(0);
      return;
    }
    setCurrentStepIndex((prev) => {
      const next = Math.min(prev + 1, steps.length - 1);
      if (steps[next]) {
        if (steps[next].type === "visit") playSound(sounds.compare);
        else if (steps[next].type === "explore") playSound(sounds.swap);
        else if (steps[next].type === "done") playSound(sounds.complete);
      }
      return next;
    });
  };

  const handlePrevious = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, -1));
  };

  const handleRestart = () => {
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    setShowWhy(false);
  };

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
    const t = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev + 1 >= steps.length) {
          setIsPlaying(false);
          if (steps[prev]?.type === "done") playSound(sounds.complete);
          return prev;
        }
        const next = prev + 1;
        if (steps[next].type === "visit") playSound(sounds.compare);
        else if (steps[next].type === "explore") playSound(sounds.swap);
        else if (steps[next].type === "done") playSound(sounds.complete);
        return next;
      });
    }, speed);
    return () => clearTimeout(t);
  }, [isPlaying, currentStepIndex, steps, speed]);

  useEffect(() => {
    if (steps.length > 0 && currentStepIndex === steps.length - 1) {
      if (topicSlug) markCompleted(topicSlug);
    }
  }, [currentStepIndex, steps.length, topicSlug, markCompleted]);

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  return (
    <div className="space-y-6">
      <div className="visualizer-box p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">{algoLabels[algo]} Visualizer</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Start Node: <span className="font-bold">A</span>
          </div>
        </div>

        <div className="flex justify-center">
          <svg viewBox="0 0 420 330" className="w-full max-w-lg">
            {EDGES.map((edge) => {
              const from = NODES.find((n) => n.id === edge.from)!;
              const to = NODES.find((n) => n.id === edge.to)!;
              const isHighlighted = currentStep?.highlightedEdges.includes(edgeKey(edge.from, edge.to));

              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;

              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    className={`transition-colors duration-300 ${
                      isHighlighted
                        ? "stroke-green-500 dark:stroke-green-400"
                        : "stroke-gray-300 dark:stroke-gray-600"
                    }`}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                  />
                  <text
                    x={mx}
                    y={my - 6}
                    textAnchor="middle"
                    className={`text-[11px] font-bold fill-gray-500 dark:fill-gray-400`}
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {NODES.map((node) => {
              const isCurrent = currentStep?.current === node.id;
              const isVisited = currentStep?.visited?.includes(node.id) ?? false;
              const isFrontier = currentStep?.frontier?.includes(node.id) ?? false;

              let fill = "url(#defaultGrad)";
              let strokeColor = "#94a3b8";

              if (currentStep?.type === "done" && isVisited) {
                fill = "#22c55e";
                strokeColor = "#16a34a";
              } else if (isCurrent) {
                fill = "#f59e0b";
                strokeColor = "#d97706";
              } else if (algo !== "dijkstra" && isFrontier) {
                // BFS/DFS: nodes discovered but not yet processed show as frontier
                fill = "#3b82f6";
                strokeColor = "#2563eb";
              } else if (isVisited) {
                fill = "#22c55e";
                strokeColor = "#16a34a";
              } else if (isFrontier) {
                // Dijkstra: only unprocessed priority-queue entries show as frontier
                fill = "#3b82f6";
                strokeColor = "#2563eb";
              }

              return (
                <g key={node.id}>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={22}
                    fill={fill}
                    stroke={strokeColor}
                    strokeWidth={isCurrent ? 3 : 2}
                    animate={{
                      scale: isCurrent ? 1.15 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                  <text
                    x={node.x}
                    y={node.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-sm font-bold fill-white pointer-events-none"
                  >
                    {node.label}
                  </text>
                  {algo === "dijkstra" && currentStep?.distances && (
                    <text
                      x={node.x}
                      y={node.y - 30}
                      textAnchor="middle"
                      className="text-[10px] font-mono font-bold fill-gray-600 dark:fill-gray-300"
                    >
                      d={currentStep.distances[node.id] === Infinity ? "∞" : currentStep.distances[node.id]}
                    </text>
                  )}
                </g>
              );
            })}

            <defs>
              <linearGradient id="defaultGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className="stop-color-[#6366f1]" />
                <stop offset="100%" className="stop-color-[#818cf8]" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" /> Current
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" /> Visited
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" /> {algo === "dfs" ? "In Stack" : "In Queue"}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-400 dark:bg-gray-500" /> Unvisited
          </div>
        </div>

        {currentStep && currentStep.frontier.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
            <span className="font-bold text-primary">{algo === "dfs" ? "Stack" : algo === "dijkstra" ? "Priority Queue" : "Queue"}:</span>{" "}
            <span className="font-mono">[{currentStep.frontier.join(", ")}]</span>
          </div>
        )}
      </div>

      <div className="card p-6">
        <StepController
          isPlaying={isPlaying}
          currentStep={currentStepIndex + 1}
          totalSteps={steps.length}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onRestart={handleRestart}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-lg">Current Step</h4>
          {currentStep && (
            <button
              onClick={() => setShowWhy(!showWhy)}
              className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary-fill hover:text-white transition-all font-medium"
            >
              Why did it do that?
            </button>
          )}
        </div>

        {currentStep ? (
          <div className="space-y-4 animate-slide-in">
            <div>
              <div className="text-xs font-bold text-primary uppercase">Step {currentStepIndex + 1}</div>
              <h5 className="text-lg font-bold mt-1">{currentStep.description}</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{currentStep.explanation}</p>
            </div>

            {showWhy && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 animate-slide-in">
                <div className="text-xs font-bold text-primary uppercase mb-1">Why did it do that?</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{currentStep.why}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-lg">
              Press <span className="font-bold text-primary">Play</span> to start the visualization
            </p>
            <p className="text-sm mt-1">Watch how {algo === "bfs" ? "BFS explores level by level" : algo === "dfs" ? "DFS goes deep before backtracking" : "Dijkstra finds shortest paths"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
