"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSoundContext } from "@/components/SoundProvider";
import { sounds } from "@/lib/sounds";
import { useProgress } from "@/components/ProgressProvider";

type TreeMode = "binary-tree" | "binary-search-tree";

interface TreeNode {
  value: number;
  left: number | null;
  right: number | null;
  parent: number | null;
}

interface TreeVisualizerProps {
  mode: TreeMode;
  topicSlug?: string;
}

function computeLayout(nodes: Record<number, TreeNode>, root: number | null, viewWidth = 600): { positions: Map<number, { x: number; y: number }>; width: number; height: number } {
  if (root === null) return { positions: new Map(), width: viewWidth, height: 80 };

  const positions = new Map<number, { x: number; y: number }>();
  let nextX = 0;

  function assign(nodeId: number | null, depth: number) {
    if (nodeId === null) return;
    const node = nodes[nodeId];
    assign(node.left, depth + 1);
    positions.set(nodeId, { x: nextX * 60 + 30, y: depth * 70 + 40 });
    nextX++;
    assign(node.right, depth + 1);
  }

  assign(root, 0);

  const maxDepth = Math.max(...[...positions.values()].map((p) => p.y), 40);
  const maxX = Math.max(...[...positions.values()].map((p) => p.x), 30);

  return { positions, width: Math.max(maxX + 30, viewWidth), height: maxDepth + 50 };
}

export function TreeVisualizer({ mode, topicSlug }: TreeVisualizerProps) {
  const [nodes, setNodes] = useState<Record<number, TreeNode>>({
    50: { value: 50, left: 30, right: 70, parent: null },
    30: { value: 30, left: 20, right: 40, parent: 50 },
    70: { value: 70, left: 60, right: 80, parent: 50 },
    20: { value: 20, left: null, right: null, parent: 30 },
    40: { value: 40, left: null, right: null, parent: 30 },
    60: { value: 60, left: null, right: null, parent: 70 },
    80: { value: 80, left: null, right: null, parent: 70 },
  });
  const [inputValue, setInputValue] = useState("");
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [lastOperation, setLastOperation] = useState("");
  const [traversal, setTraversal] = useState<string>("");
  const [traversalNodes, setTraversalNodes] = useState<number[]>([]);
  const [traversalStep, setTraversalStep] = useState(-1);
  const traversalTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const { soundEnabled } = useSoundContext();
  const { markStarted } = useProgress();

  const playSound = (fn: () => void) => {
    if (soundEnabled) fn();
  };

  const getRoot = () => {
    for (const id in nodes) {
      if (nodes[id].parent === null) return Number(id);
    }
    return null;
  };

  const getInorder = (): number[] => {
    const result: number[] = [];
    const root = getRoot();
    function traverse(id: number | null) {
      if (id === null) return;
      traverse(nodes[id].left);
      result.push(nodes[id].value);
      traverse(nodes[id].right);
    }
    traverse(root);
    return result;
  };

  const getPreorder = (): number[] => {
    const result: number[] = [];
    const root = getRoot();
    function traverse(id: number | null) {
      if (id === null) return;
      result.push(nodes[id].value);
      traverse(nodes[id].left);
      traverse(nodes[id].right);
    }
    traverse(root);
    return result;
  };

  const getPostorder = (): number[] => {
    const result: number[] = [];
    const root = getRoot();
    function traverse(id: number | null) {
      if (id === null) return;
      traverse(nodes[id].left);
      traverse(nodes[id].right);
      result.push(nodes[id].value);
    }
    traverse(root);
    return result;
  };

  const runTraversal = (type: string) => {
    if (traversalTimer.current) clearInterval(traversalTimer.current);
    const order = type === "inorder" ? getInorder() : type === "preorder" ? getPreorder() : getPostorder();
    setTraversalNodes(order);
    setTraversalStep(-1);
    setTraversal(type);

    let step = 0;
    const interval = setInterval(() => {
      if (step >= order.length) {
        if (traversalTimer.current) clearInterval(traversalTimer.current);
        traversalTimer.current = null;
        setHighlighted(null);
        setTraversalStep(order.length);
        setLastOperation(`${type} traversal complete: ${order.join(" → ")}`);
        return;
      }
      setHighlighted(getNodeIdByValue(order[step]));
      setTraversalStep(step + 1);
      playSound(sounds.compare);
      step++;
    }, 700);
    traversalTimer.current = interval;
  };

  const getNodeIdByValue = (val: number): number | null => {
    for (const id in nodes) {
      if (nodes[id].value === val) return Number(id);
    }
    return null;
  };

  const addNode = (val: number) => {
    if (isNaN(val)) return;

    if (mode === "binary-tree") {
      // Find the first empty spot level by level (complete binary tree insertion)
      const allIds = Object.keys(nodes).map(Number);
      const newId = (allIds.length > 0 ? Math.max(...allIds) : 0) + 1;
      const root = getRoot();
      const seen = new Set<number>();
      let parentId: number | null = null;
      let side: "left" | "right" | null = null;

      function findSpot(parent: number): boolean {
        if (seen.has(parent)) return false;
        seen.add(parent);
        if (nodes[parent].left === null) {
          parentId = parent;
          side = "left";
          return true;
        }
        if (nodes[parent].right === null) {
          parentId = parent;
          side = "right";
          return true;
        }
        const left = nodes[parent].left;
        if (left !== null && findSpot(left)) return true;
        const right = nodes[parent].right;
        if (right !== null && findSpot(right)) return true;
        return false;
      }

      if (root !== null) {
        findSpot(root);
      }

      if (parentId === null || side === null) {
        // Tree was empty
        setNodes({ [newId]: { value: val, left: null, right: null, parent: null } });
        setLastOperation(`Inserted ${val} as root`);
      } else {
        const pId: number = parentId;
        const s: "left" | "right" = side;
        setNodes((prev) => ({
          ...prev,
          [newId]: { value: val, left: null, right: null, parent: pId },
          [pId]: { ...prev[pId], [s]: newId },
        }));
        setLastOperation(`Inserted ${val} as ${s} child of ${nodes[pId].value}`);
      }
      playSound(sounds.insert);
    } else {
      // BST insertion
      const root = getRoot();
      const allIds = Object.keys(nodes).map(Number);
      const newId = (allIds.length > 0 ? Math.max(...allIds) : 0) + 1;

      const tempNodes: Record<number, TreeNode> = {};
      for (const k of Object.keys(nodes)) {
        tempNodes[Number(k)] = { ...nodes[Number(k)] };
      }
      tempNodes[newId] = { value: val, left: null, right: null, parent: null };

      if (root === null) {
        setNodes({ [newId]: { value: val, left: null, right: null, parent: null } });
        setLastOperation(`Inserted ${val} as root`);
        playSound(sounds.insert);
        setHighlighted(newId);
        setInputValue("");
        if (topicSlug) markStarted(topicSlug);
        return;
      }

      let current = root;
      while (true) {
        const node = tempNodes[current];
        if (val < node.value) {
          if (node.left === null) {
            node.left = newId;
            tempNodes[newId].parent = current;
            setLastOperation(`Inserted ${val} as left child of ${node.value}`);
            break;
          }
          current = node.left;
        } else if (val > node.value) {
          if (node.right === null) {
            node.right = newId;
            tempNodes[newId].parent = current;
            setLastOperation(`Inserted ${val} as right child of ${node.value}`);
            break;
          }
          current = node.right;
        } else {
          const rest: Record<number, TreeNode> = {};
          for (const k of Object.keys(tempNodes)) {
            if (Number(k) !== newId) rest[Number(k)] = tempNodes[Number(k)];
          }
          setNodes(rest);
          setLastOperation(`Value ${val} already exists — duplicates not allowed in BST`);
          return;
        }
      }
      setNodes(tempNodes);
      playSound(sounds.insert);
      setHighlighted(newId);
    }

    setInputValue("");
    if (topicSlug) markStarted(topicSlug);
  };

  const handleInsert = () => {
    const val = parseInt(inputValue);
    addNode(val);
  };

  const deleteNode = (id: number) => {
    if (mode === "binary-tree") {
      // Simple: delete a leaf
      const node = nodes[id];
      if (node.left !== null || node.right !== null) {
        setLastOperation(`Cannot delete ${node.value}: only leaf nodes can be deleted in this visualizer`);
        return;
      }
      const newNodes: Record<number, TreeNode> = {};
      for (const k of Object.keys(nodes)) {
        const key = Number(k);
        if (key === id) continue;
        newNodes[key] = { ...nodes[key] };
      }
      if (node.parent !== null && newNodes[node.parent]) {
        const parent = newNodes[node.parent];
        if (parent.left === id) parent.left = null;
        if (parent.right === id) parent.right = null;
      }
      setNodes(newNodes);
      setLastOperation(`Deleted leaf node ${node.value}`);
      playSound(sounds.delete);
    } else {
      // BST deletion
      const node = nodes[id];
      if (!node) return;

      // Deep copy all nodes first so we never mutate state directly
      const newNodes: Record<number, TreeNode> = {};
      for (const k of Object.keys(nodes)) {
        newNodes[Number(k)] = { ...nodes[Number(k)] };
      }

      // Case 1: No children
      if (node.left === null && node.right === null) {
        if (node.parent !== null && newNodes[node.parent]) {
          const parent = newNodes[node.parent];
          if (parent.left === id) parent.left = null;
          if (parent.right === id) parent.right = null;
        }
        delete newNodes[id];
        setNodes(newNodes);
        setLastOperation(`Deleted ${node.value} (leaf)`);
      }
      // Case 2: One child
      else if (node.left === null || node.right === null) {
        const childId = node.left !== null ? node.left : node.right!;
        if (node.parent !== null && newNodes[node.parent]) {
          const parent = newNodes[node.parent];
          if (parent.left === id) parent.left = childId;
          if (parent.right === id) parent.right = childId;
          newNodes[childId].parent = node.parent;
        } else {
          newNodes[childId].parent = null;
        }
        delete newNodes[id];
        setNodes(newNodes);
        setLastOperation(`Deleted ${node.value} (one child replaced)`);
      }
      // Case 3: Two children - use inorder successor
      else {
        let successor: number | null = node.right;
        while (successor !== null && newNodes[successor].left !== null) {
          successor = newNodes[successor].left;
        }
        if (successor === null) return;
        const successorNode = newNodes[successor];
        const oldVal = newNodes[id].value;
        newNodes[id] = { ...newNodes[id], value: successorNode.value, left: newNodes[id].left, right: newNodes[id].right };
        if (successorNode.parent !== null && newNodes[successorNode.parent]) {
          const parent = newNodes[successorNode.parent];
          if (parent.left === successor) parent.left = null;
          if (parent.right === successor) parent.right = null;
        }
        delete newNodes[successor];
        setNodes(newNodes);
        setLastOperation(`Deleted ${oldVal}, replaced with inorder successor ${newNodes[id].value}`);
      }
      playSound(sounds.delete);
    }
    setHighlighted(getNodeIdByValue(nodes[id]?.value ?? -1));
  };

  const generateSample = () => {
    if (mode === "binary-search-tree") {
      setNodes({
        50: { value: 50, left: 30, right: 70, parent: null },
        30: { value: 30, left: 20, right: 40, parent: 50 },
        70: { value: 70, left: 60, right: 80, parent: 50 },
        20: { value: 20, left: null, right: null, parent: 30 },
        40: { value: 40, left: null, right: null, parent: 30 },
        60: { value: 60, left: null, right: null, parent: 70 },
        80: { value: 80, left: null, right: null, parent: 70 },
      });
    } else {
      setNodes({
        1: { value: 10, left: 2, right: 3, parent: null },
        2: { value: 20, left: 4, right: 5, parent: 1 },
        3: { value: 30, left: 6, right: 7, parent: 1 },
        4: { value: 40, left: null, right: null, parent: 2 },
        5: { value: 50, left: null, right: null, parent: 2 },
        6: { value: 60, left: null, right: null, parent: 3 },
        7: { value: 70, left: null, right: null, parent: 3 },
      });
    }
    setLastOperation("Loaded sample tree");
    setHighlighted(null);
    playSound(sounds.insert);
    if (topicSlug) markStarted(topicSlug);
  };

  const root = getRoot();
  const layout = computeLayout(nodes, root);

  return (
    <div className="space-y-6">
      <div className="visualizer-box p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg capitalize">{mode.replace("-", " ")} Visualizer</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Nodes: <span className="font-bold">{Object.keys(nodes).length}</span>
          </div>
        </div>

        <div className="flex justify-center overflow-x-auto">
          <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="min-w-[400px]">
            {/* Edges */}
            {Object.entries(nodes).map(([idStr, node]) => {
              const id = Number(idStr);
              const pos = layout.positions.get(id);
              if (!pos) return null;

              const children: { id: number; pos: { x: number; y: number } }[] = [];
              if (node.left !== null && layout.positions.has(node.left)) {
                children.push({ id: node.left, pos: layout.positions.get(node.left)! });
              }
              if (node.right !== null && layout.positions.has(node.right)) {
                children.push({ id: node.right, pos: layout.positions.get(node.right)! });
              }

              return children.map((child) => (
                <line
                  key={`${id}-${child.id}`}
                  x1={pos.x}
                  y1={pos.y}
                  x2={child.pos.x}
                  y2={child.pos.y}
                  stroke={highlighted === child.id ? "#22c55e" : "#94a3b8"}
                  strokeWidth={highlighted === child.id ? 2.5 : 1.5}
                  className="dark:stroke-gray-500"
                />
              ));
            })}

            {/* Nodes */}
            {Object.entries(nodes).map(([idStr, node]) => {
              const id = Number(idStr);
              const pos = layout.positions.get(id);
              if (!pos) return null;

              const isHighlighted = highlighted === id;
              const fill = isHighlighted ? "#22c55e" : "#6366f1";

              return (
                <g key={id}>
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={20}
                    fill={fill}
                    stroke={isHighlighted ? "#16a34a" : "#4f46e5"}
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
                    {node.value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <button
            onClick={() => runTraversal("inorder")}
            className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary-fill hover:text-white transition-all font-semibold"
          >
            In-order
          </button>
          <button
            onClick={() => runTraversal("preorder")}
            className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary-fill hover:text-white transition-all font-semibold"
          >
            Pre-order
          </button>
          <button
            onClick={() => runTraversal("postorder")}
            className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary-fill hover:text-white transition-all font-semibold"
          >
            Post-order
          </button>
        </div>

        {traversal && traversalNodes.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-center">
            <span className="font-bold text-primary capitalize">{traversal} traversal:</span>{" "}
            <span className="font-mono">
              {traversalNodes.map((v, i) => (
                <span key={i} className={i < traversalStep ? "text-success font-bold" : ""}>
                  {v}
                  {i < traversalNodes.length - 1 ? " → " : ""}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInsert()}
            placeholder="Insert value..."
            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent font-mono text-sm focus:border-primary outline-none w-32"
          />
          <button
            onClick={handleInsert}
            className="px-4 py-2 bg-primary-fill text-white rounded-lg text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all"
          >
            Insert
          </button>
          <button
            onClick={() => {
              if (highlighted !== null) {
                deleteNode(highlighted);
              } else {
                setLastOperation("Click a node to select it for deletion (nodes are highlighted on insertion)");
              }
            }}
            className="px-4 py-2 bg-error/10 text-error font-semibold rounded-lg text-sm hover:bg-error-fill hover:text-white transition-all active:scale-95"
          >
            Delete Selected
          </button>
          <button
            onClick={generateSample}
            className="px-4 py-2 bg-accent/10 text-accent font-semibold rounded-lg text-sm hover:bg-accent-fill hover:text-white transition-all active:scale-95"
          >
            Sample Tree
          </button>

          <div className="ml-auto card px-4 py-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 text-xs mr-2">Last:</span>
            <span className="font-medium">{lastOperation || "—"}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {mode === "binary-search-tree"
            ? "BST: left child < parent < right child. Deleting a node with two children replaces it with its inorder successor."
            : "Binary Tree: each node has at most two children. Insertion fills the first available spot level by level."}
        </p>
      </div>
    </div>
  );
}
