"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSoundContext } from "@/components/SoundProvider";
import { sounds } from "@/lib/sounds";
import { useProgress } from "@/components/ProgressProvider";

interface TrieNode {
  children: Record<string, TrieNode>;
  isEnd: boolean;
}

interface TrieVisualizerProps {
  topicSlug?: string;
}

interface LayoutNode {
  id: string;
  label: string;
  x: number;
  y: number;
  isEnd: boolean;
}

interface LayoutEdge {
  from: string;
  to: string;
  label: string;
}

function buildTrieLayout(trie: TrieNode): { nodes: LayoutNode[]; edges: LayoutEdge[]; prefixToId: Record<string, string> } {
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];
  const prefixToId: Record<string, string> = {};
  let idCounter = 0;

  function walk(node: TrieNode, prefix: string, x: number, y: number) {
    const myId = `n${idCounter++}`;
    prefixToId[prefix] = myId;
    nodes.push({ id: myId, label: prefix ? prefix[prefix.length - 1] : "root", x, y, isEnd: node.isEnd });

    const chars = Object.keys(node.children).sort();
    if (chars.length === 0) return;

    const gap = 30;
    const widths: number[] = [];
    chars.forEach((c) => {
      widths.push(subtreeWidth(node.children[c]));
    });
    const totalWidth = widths.reduce((a, b) => a + b, 0) + gap * (chars.length - 1);

    let totalX = 0;
    chars.forEach((c, i) => {
      const childWidth = widths[i];
      const childCenter = x - totalWidth / 2 + totalX + childWidth / 2;
      const childId = `n${idCounter}`;
      const childNode = node.children[c];
      edges.push({ from: myId, to: childId, label: c });
      walk(childNode, prefix + c, childCenter, y + 60);
      totalX += childWidth + gap;
    });
  }

  function subtreeWidth(node: TrieNode): number {
    const chars = Object.keys(node.children);
    if (chars.length === 0) return 60;
    return chars.reduce((a, c) => a + subtreeWidth(node.children[c]), 0) + 30 * (chars.length - 1);
  }

  walk(trie, "", 200, 40);
  return { nodes, edges, prefixToId };
}

function createEmptyNode(): TrieNode {
  return { children: {}, isEnd: false };
}

export function TrieVisualizer({ topicSlug }: TrieVisualizerProps) {
  const [trie, setTrie] = useState<TrieNode>(() => {
    const root = createEmptyNode();
    ["cat", "car", "dog", "door"].forEach((w) => {
      let node = root;
      for (const c of w) {
        if (!node.children[c]) node.children[c] = createEmptyNode();
        node = node.children[c];
      }
      node.isEnd = true;
    });
    return root;
  });
  const [inputWord, setInputWord] = useState("");
  const [lastOperation, setLastOperation] = useState("");
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

  const { soundEnabled } = useSoundContext();
  const { markStarted } = useProgress();

  const playSound = (fn: () => void) => {
    if (soundEnabled) fn();
  };

  const insertWord = () => {
    const word = inputWord.trim().toLowerCase();
    if (!word) return;
    const newRoot = { children: { ...trie.children }, isEnd: trie.isEnd };
    let node = newRoot;
    const path: string[] = [];
    for (const c of word) {
      path.push(c);
      if (!node.children[c]) node.children[c] = createEmptyNode();
      node = node.children[c];
    }
    node.isEnd = true;
    setTrie(newRoot);
    setHighlightedPath(path);
    setLastOperation(`Inserted "${word}"`);
    playSound(sounds.insert);
    setInputWord("");
    if (topicSlug) markStarted(topicSlug);
  };

  const searchWord = () => {
    const word = inputWord.trim().toLowerCase();
    if (!word) return;
    let node = trie;
    const path: string[] = [];
    let found = true;
    for (const c of word) {
      if (!node.children[c]) {
        found = false;
        break;
      }
      path.push(c);
      node = node.children[c];
    }
    const exists = found && node.isEnd;
    setHighlightedPath(path);
    setLastOperation(
      exists
        ? `Found "${word}" in the trie ✓`
        : found
        ? `"${word}" is a prefix but not a complete word`
        : `"${word}" was not found`
    );
    playSound(exists ? sounds.success : sounds.error);
    if (topicSlug) markStarted(topicSlug);
  };

  const deleteWord = () => {
    const word = inputWord.trim().toLowerCase();
    if (!word) return;

    const cloneDeep = (node: TrieNode): TrieNode => ({
      children: Object.fromEntries(Object.entries(node.children).map(([k, v]) => [k, cloneDeep(v)])),
      isEnd: node.isEnd,
    });

    const newRoot = cloneDeep(trie);
    let node = newRoot;
    const path: string[] = [];

    for (const c of word) {
      if (!node.children[c]) {
        setLastOperation(`"${word}" not found — cannot delete`);
        return;
      }
      path.push(c);
      node = node.children[c];
    }

    if (!node.isEnd) {
      setLastOperation(`"${word}" exists as a prefix only — cannot delete`);
      return;
    }

    node.isEnd = false;

    // Prune nodes with no children and not an end of another word
    const prune = (n: TrieNode): TrieNode => {
      for (const key of Object.keys(n.children)) {
        n.children[key] = prune(n.children[key]);
        if (!n.children[key].isEnd && Object.keys(n.children[key].children).length === 0) {
          delete n.children[key];
        }
      }
      return n;
    };
    prune(newRoot);

    setTrie(newRoot);
    setHighlightedPath(path);
    setLastOperation(`Deleted "${word}"`);
    playSound(sounds.delete);
    if (topicSlug) markStarted(topicSlug);
  };

  const randomize = () => {
    const words = ["ape", "ant", "arc", "art", "bee", "beg", "bet", "big", "bit", "bug", "cap", "cub", "dad", "den", "dim", "eat", "ego", "end", "fan", "fig"];
    const count = 3 + Math.floor(Math.random() * 4);
    const chosen = [...words].sort(() => Math.random() - 0.5).slice(0, count);
    const root = createEmptyNode();
    chosen.forEach((w) => {
      let node = root;
      for (const c of w) {
        if (!node.children[c]) node.children[c] = createEmptyNode();
        node = node.children[c];
      }
      node.isEnd = true;
    });
    setTrie(root);
    setLastOperation(`Loaded ${chosen.length} words: ${chosen.join(", ")}`);
    playSound(sounds.insert);
    if (topicSlug) markStarted(topicSlug);
  };

  const { nodes, edges, prefixToId } = buildTrieLayout(trie);

  // Resolve the currently highlighted word's actual trie path into node ids (root first)
  const pathNodeIds: string[] = [
    prefixToId[""] || "",
    ...highlightedPath.map((_, i) => prefixToId[highlightedPath.slice(0, i + 1).join("")] || ""),
  ].filter(Boolean);
  const pathNodeSet = new Set(pathNodeIds);
  const edgeOnPath = (edge: LayoutEdge): boolean =>
    pathNodeIds.length >= 2 &&
    pathNodeIds.slice(0, -1).some((fromId, idx) => edge.from === fromId && edge.to === pathNodeIds[idx + 1]);

  const maxX = Math.max(...nodes.map((n) => n.x), 100);
  const minX = Math.min(...nodes.map((n) => n.x), 0);
  const width = Math.max(maxX - minX + 100, 400);
  const height = Math.max(...nodes.map((n) => n.y), 60) + 40;

  const getAllWords = (): string[] => {
    const result: string[] = [];
    function walk(node: TrieNode, prefix: string) {
      if (node.isEnd) result.push(prefix);
      for (const c in node.children) walk(node.children[c], prefix + c);
    }
    walk(trie, "");
    return result.sort();
  };

  return (
    <div className="space-y-6">
      <div className="visualizer-box p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Trie Visualizer</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Words: <span className="font-bold">{getAllWords().length}</span>
          </div>
        </div>

        <div className="flex justify-center overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full max-w-[640px] h-auto max-h-[460px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {edges.map((edge, i) => {
              const from = nodes.find((n) => n.id === edge.from)!;
              const to = nodes.find((n) => n.id === edge.to)!;
              const isOnPath = edgeOnPath(edge);
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;
              return (
                <g key={i}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isOnPath ? "#f59e0b" : "#94a3b8"}
                    strokeWidth={isOnPath ? 2.5 : 1.5}
                    className="dark:stroke-gray-500"
                  />
                  <circle cx={mx} cy={my} r={10} className="fill-white dark:fill-gray-800" stroke={isOnPath ? "#f59e0b" : "#94a3b8"} strokeWidth={1} />
                  <text x={mx} y={my + 1} textAnchor="middle" dominantBaseline="central" className="text-[10px] font-bold fill-gray-600 dark:fill-gray-300">
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {nodes.map((node) => {
              const isOnPath = pathNodeSet.has(node.id);
              const isEndOfWord = node.isEnd && node.label !== "root";
              const isRoot = node.id === "n0";
              return (
                <g key={node.id}>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={isRoot ? 16 : isEndOfWord ? 18 : 15}
                    fill={isRoot ? "#6366f1" : isOnPath ? "#f59e0b" : isEndOfWord ? "#22c55e" : "#94a3b8"}
                    stroke={isRoot ? "#4f46e5" : isOnPath ? "#d97706" : isEndOfWord ? "#16a34a" : "#64748b"}
                    strokeWidth={isOnPath ? 2.5 : 1.5}
                    animate={{ scale: isOnPath ? 1.15 : isEndOfWord ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                  {node.label !== "root" && (
                    <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="central" className="text-[11px] font-bold fill-white pointer-events-none">
                      {node.label}
                    </text>
                  )}
                  {node.id === "n0" && (
                    <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="central" className="text-[9px] font-bold fill-white pointer-events-none">
                      ∅
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-center">
          <span className="font-bold text-primary">Stored words:</span>{" "}
          <span className="font-mono">{getAllWords().length > 0 ? getAllWords().join(", ") : "(empty)"}</span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> end of word
          </span>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && insertWord()}
            placeholder="Enter a word..."
            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent font-mono text-sm focus:border-primary outline-none w-36"
          />
          <button onClick={insertWord} className="px-4 py-2 bg-primary-fill text-white rounded-lg text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all">
            Insert
          </button>
          <button onClick={searchWord} className="px-4 py-2 bg-secondary/10 text-secondary font-semibold rounded-lg text-sm hover:bg-secondary-fill hover:text-white transition-all active:scale-95">
            Search
          </button>
          <button onClick={deleteWord} className="px-4 py-2 bg-error/10 text-error font-semibold rounded-lg text-sm hover:bg-error-fill hover:text-white transition-all active:scale-95">
            Delete
          </button>
          <button onClick={randomize} className="px-4 py-2 bg-accent/10 text-accent font-semibold rounded-lg text-sm hover:bg-accent-fill hover:text-white transition-all active:scale-95">
            Randomize
          </button>

          <div className="ml-auto card px-4 py-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 text-xs mr-2">Last:</span>
            <span className="font-medium">{lastOperation || "—"}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          A trie stores strings path by path. Each node is a character, and words sharing prefixes share nodes.
        </p>
      </div>
    </div>
  );
}
