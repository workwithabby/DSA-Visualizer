"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSoundContext } from "@/components/SoundProvider";
import { sounds } from "@/lib/sounds";
import { useProgress } from "@/components/ProgressProvider";

interface HeapVisualizerProps {
  maxHeap?: boolean;
  topicSlug?: string;
}

export function HeapVisualizer({ maxHeap = true, topicSlug }: HeapVisualizerProps) {
  const [heap, setHeap] = useState<number[]>([100, 60, 70, 30, 40, 50, 45]);
  const [inputValue, setInputValue] = useState("");
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [lastOperation, setLastOperation] = useState("");
  const [heapType, setHeapType] = useState<"max" | "min">(maxHeap ? "max" : "min");

  const { soundEnabled } = useSoundContext();
  const { markStarted } = useProgress();

  const playSound = (fn: () => void) => {
    if (soundEnabled) fn();
  };

  const childIndices = (i: number) => [2 * i + 1, 2 * i + 2];
  const parentIndex = (i: number) => Math.floor((i - 1) / 2);

  const siftUp = (index: number, current: number[], type: "max" | "min"): { arr: number[]; finalIndex: number } => {
    const arr = [...current];
    let i = index;
    while (i > 0) {
      const p = parentIndex(i);
      const shouldSwap =
        type === "max" ? arr[i] > arr[p] : arr[i] < arr[p];
      if (shouldSwap) {
        [arr[i], arr[p]] = [arr[p], arr[i]];
        i = p;
      } else {
        break;
      }
    }
    return { arr, finalIndex: i };
  };

  const siftDown = (index: number, size: number, current: number[], type: "max" | "min"): number[] => {
    const arr = [...current];
    let i = index;
    while (true) {
      const [left, right] = childIndices(i);
      let target = i;
      if (left < size) {
        const leftShouldWin =
          type === "max" ? arr[left] > arr[target] : arr[left] < arr[target];
        if (leftShouldWin) target = left;
      }
      if (right < size) {
        const rightShouldWin =
          type === "max" ? arr[right] > arr[target] : arr[right] < arr[target];
        if (rightShouldWin) target = right;
      }
      if (target !== i) {
        [arr[i], arr[target]] = [arr[target], arr[i]];
        i = target;
      } else {
        break;
      }
    }
    return arr;
  };

  const insert = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const newHeap = [...heap, val];
    const { arr: finalHeap, finalIndex } = siftUp(newHeap.length - 1, newHeap, heapType);
    setHeap(finalHeap);
    setHighlighted([finalIndex]);
    setLastOperation(`Inserted ${val}. Sifted it up to maintain ${heapType}-heap property.`);
    playSound(sounds.insert);
    setInputValue("");
    if (topicSlug) markStarted(topicSlug);
  };

  const extract = () => {
    if (heap.length === 0) {
      setLastOperation("Heap is empty");
      return;
    }
    const root = heap[0];
    const newHeap = [...heap];
    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();
    const finalHeap = newHeap.length > 1 ? siftDown(0, newHeap.length, newHeap, heapType) : newHeap;
    setHeap(finalHeap);
    setHighlighted([]);
    setLastOperation(`Extracted ${root} (the ${heapType}). Sifted the new root down.`);
    playSound(sounds.delete);
  };

  const toggleType = () => {
    const newType = heapType === "max" ? "min" : "max";
    setHeapType(newType);
    // Rebuild heap: build from scratch
    let h: number[] = [];
    heap.forEach((v) => {
      h = [...h, v];
      h = siftUp(h.length - 1, h, newType).arr;
    });
    setHeap(h);
    setLastOperation(`Switched to ${newType}-heap and rebuilt the tree`);
    playSound(sounds.click);
  };

  const randomize = () => {
    const count = 7;
    const vals = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
    let h: number[] = [];
    vals.forEach((v) => {
      h = [...h, v];
      h = siftUp(h.length - 1, h, heapType).arr;
    });
    setHeap(h);
    setLastOperation(`Randomized ${count} elements into a ${heapType}-heap`);
    playSound(sounds.insert);
    if (topicSlug) markStarted(topicSlug);
  };

  // Compute SVG positions for heap (complete binary tree)
  const positions: { x: number; y: number }[] = [];
  heap.forEach((_, i) => {
    const depth = Math.floor(Math.log2(i + 1));
    const offset = 320 / Math.pow(2, depth);
    if (i === 0) {
      positions.push({ x: 200, y: 40 });
    } else {
      const p = parentIndex(i);
      const isLeft = i === 2 * p + 1;
      const parentPos = positions[p];
      positions.push({
        x: isLeft ? parentPos.x - offset : parentPos.x + offset,
        y: depth * 70 + 40,
      });
    }
  });

  const xs = positions.map((p) => p.x);
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 0);
  const width = maxX - minX + 80;
  const viewMinX = minX - 40;
  const height = positions.length > 0 ? Math.max(...positions.map((p) => p.y)) + 50 : 80;

  const isHeapValid = () => {
    for (let i = 0; i < heap.length; i++) {
      const [l, r] = childIndices(i);
      if (l < heap.length && (heapType === "max" ? heap[i] < heap[l] : heap[i] > heap[l])) return false;
      if (r < heap.length && (heapType === "max" ? heap[i] < heap[r] : heap[i] > heap[r])) return false;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="visualizer-box p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg capitalize">{heapType}-heap Visualizer</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Elements: <span className="font-bold">{heap.length}</span>
          </div>
        </div>

        <div className="flex justify-center overflow-x-auto">
          <svg viewBox={`${viewMinX} 0 ${width} ${height}`} className="min-w-[400px]">
            {heap.map((_, i) => {
              const [l, r] = childIndices(i);
              const pos = positions[i];
              const children = [];
              if (l < heap.length) children.push({ id: l, pos: positions[l] });
              if (r < heap.length) children.push({ id: r, pos: positions[r] });

              return children.map((c) => (
                <line
                  key={`${i}-${c.id}`}
                  x1={pos.x}
                  y1={pos.y}
                  x2={c.pos.x}
                  y2={c.pos.y}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  className="dark:stroke-gray-500"
                />
              ));
            })}

            {heap.map((val, i) => {
              const pos = positions[i];
              const isHighlighted = highlighted.includes(i);
              const fill = isHighlighted ? "#f59e0b" : "#6366f1";

              return (
                <g key={i}>
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={22}
                    fill={fill}
                    stroke={isHighlighted ? "#d97706" : "#4f46e5"}
                    strokeWidth={2}
                    animate={{ scale: isHighlighted ? 1.15 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-sm font-bold fill-white pointer-events-none"
                  >
                    {val}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 38}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-gray-400 dark:fill-gray-500"
                  >
                    {i}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs">
          <span className="font-bold text-primary">Array representation:</span>{" "}
          <span className="font-mono">[{heap.join(", ")}]</span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-amber-500" /> Being placed / sifted
          <span className="mx-2 text-gray-400">|</span>
          Heap property:{" "}
          <span className={isHeapValid() ? "text-success font-bold" : "text-error font-bold"}>
            {isHeapValid() ? "valid ✓" : "invalid ✗"}
          </span>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && insert()}
            placeholder="Insert value..."
            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent font-mono text-sm focus:border-primary outline-none w-32"
          />
          <button
            onClick={insert}
            className="px-4 py-2 bg-primary-fill text-white rounded-lg text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all"
          >
            Insert
          </button>
          <button
            onClick={extract}
            className="px-4 py-2 bg-error/10 text-error font-semibold rounded-lg text-sm hover:bg-error-fill hover:text-white transition-all active:scale-95"
          >
            Extract {heapType === "max" ? "Max" : "Min"}
          </button>
          <button
            onClick={toggleType}
            className="px-4 py-2 bg-secondary/10 text-secondary font-semibold rounded-lg text-sm hover:bg-secondary-fill hover:text-white transition-all active:scale-95"
          >
            {heapType === "max" ? "→ Min-heap" : "→ Max-heap"}
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
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          A {heapType}-heap keeps the {heapType === "max" ? "largest" : "smallest"} element at the root.
          Insert adds at the end and sifts up. Extract removes the root and sifts down.
        </p>
      </div>
    </div>
  );
}
