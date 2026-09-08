"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundContext } from "@/components/SoundProvider";
import { sounds } from "@/lib/sounds";
import { useProgress } from "@/components/ProgressProvider";

export type StructureType = "array" | "linked-list" | "stack" | "queue" | "deque" | "hash-table";

interface GenericStructureVisualizerProps {
  structure: StructureType;
  topicSlug?: string;
}

export function GenericStructureVisualizer({ structure, topicSlug }: GenericStructureVisualizerProps) {
  const [items, setItems] = useState<(number | null)[]>(Array(8).fill(null).map((_, i) => (i + 1) * 10));
  const [inputValue, setInputValue] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [lastOperation, setLastOperation] = useState("");
  const [hashMap, setHashMap] = useState<Record<string, number>>({ "apple": 10, "banana": 20, "cherry": 30 });
  const [dequeMode, setDequeMode] = useState<"back" | "front">("back");
  const [hashDeleteKey, setHashDeleteKey] = useState("");

  const { soundEnabled } = useSoundContext();
  const { markStarted, markCompleted } = useProgress();
  const usedInsert = useRef(false);
  const usedDelete = useRef(false);

  const playSound = (fn: () => void) => {
    if (soundEnabled) fn();
  };

  const maybeComplete = () => {
    if (usedInsert.current && usedDelete.current && topicSlug) markCompleted(topicSlug);
  };

  const noteDelete = () => {
    usedDelete.current = true;
    if (topicSlug) markStarted(topicSlug);
    maybeComplete();
  };

  const handleInsert = () => {
    const val = Number(inputValue);
    if (isNaN(val)) return;

    if (structure === "hash-table") {
      const key = inputKey.trim() || `key${Object.keys(hashMap).length + 1}`;
      setHashMap((prev) => ({ ...prev, [key]: val }));
      setLastOperation(`Inserted key "${key}" with value ${val}`);
      playSound(sounds.insert);
    } else if (structure === "array") {
      const emptyIdx = items.findIndex((v) => v === null);
      const idx = emptyIdx === -1 ? items.length : emptyIdx;
      if (idx >= 10) return;
      const newItems = [...items];
      newItems[idx] = val;
      setItems(newItems);
      setSelectedIndex(idx);
      setLastOperation(`Inserted ${val} at index ${idx}`);
      playSound(sounds.insert);
    } else if (structure === "queue") {
      setItems((prev) => [...prev, val]);
      setSelectedIndex(items.length);
      setLastOperation(`Enqueued ${val} at the back`);
      playSound(sounds.insert);
    } else if (structure === "deque") {
      if (dequeMode === "front") {
        setItems((prev) => [val, ...prev]);
        setSelectedIndex(0);
        setLastOperation(`Added ${val} to the front`);
      } else {
        setItems((prev) => [...prev, val]);
        setSelectedIndex(items.length);
        setLastOperation(`Added ${val} to the back`);
      }
      playSound(sounds.insert);
    } else if (structure === "stack") {
      setItems((prev) => [...prev, val]);
      setSelectedIndex(items.length);
      setLastOperation(`Pushed ${val} onto the stack`);
      playSound(sounds.insert);
    } else if (structure === "linked-list") {
      setItems((prev) => [val, ...prev]);
      setSelectedIndex(0);
      setLastOperation(`Inserted ${val} at head`);
      playSound(sounds.insert);
    }
    usedInsert.current = true;
    if (topicSlug) markStarted(topicSlug);
    maybeComplete();
    setInputValue("");
    setInputKey("");
  };

  const handleDelete = () => {
    if (structure === "hash-table") {
      const keys = Object.keys(hashMap);
      if (keys.length === 0) return;
      const keyToDelete = hashDeleteKey.trim();
      if (keyToDelete && !Object.prototype.hasOwnProperty.call(hashMap, keyToDelete)) {
        setLastOperation(`Key "${keyToDelete}" not found`);
        return;
      }
      const targetKey = keyToDelete || keys[keys.length - 1];
      const rest: Record<string, number> = {};
      Object.keys(hashMap).forEach((k) => {
        if (k !== targetKey) rest[k] = hashMap[k];
      });
      setHashMap(rest);
      setLastOperation(`Deleted key "${targetKey}" (value: ${hashMap[targetKey]})`);
      playSound(sounds.delete);
    } else if (structure === "queue") {
      if (items.length === 0) return;
      const removed = items[0];
      setItems((prev) => prev.slice(1));
      setLastOperation(`Dequeued ${removed} from the front`);
      playSound(sounds.delete);
    } else if (structure === "deque") {
      if (items.length === 0) return;
      if (dequeMode === "front") {
        const removed = items[0];
        setItems((prev) => prev.slice(1));
        setLastOperation(`Removed ${removed} from the front`);
      } else {
        const removed = items[items.length - 1];
        setItems((prev) => prev.slice(0, -1));
        setLastOperation(`Removed ${removed} from the back`);
      }
      playSound(sounds.delete);
    } else if (structure === "stack") {
      if (items.length === 0) return;
      const removed = items[items.length - 1];
      setItems((prev) => prev.slice(0, -1));
      setLastOperation(`Popped ${removed} from the stack`);
      playSound(sounds.delete);
    } else if (structure === "linked-list") {
      if (items.length === 0) return;
      const removed = items[items.length - 1];
      setItems((prev) => prev.slice(0, -1));
      setLastOperation(`Removed ${removed} from tail`);
      playSound(sounds.delete);
    } else {
      if (items.length === 0) return;
      const lastIdx = items.length - 1;
      const removed = items[lastIdx];
      setItems((prev) => prev.slice(0, -1));
      setLastOperation(`Deleted ${removed}`);
      playSound(sounds.delete);
    }
    noteDelete();
  };

  const handleClear = () => {
    setItems([]);
    setHashMap({});
    setSelectedIndex(null);
    setLastOperation("Cleared all elements");
    playSound(sounds.delete);
  };

  const handleRandomize = () => {
    const count = structure === "stack" ? 5 : 8;
    const newItems = Array(count)
      .fill(0)
      .map(() => Math.floor(Math.random() * 90) + 10);
    setItems(newItems);
    setSelectedIndex(null);
    setLastOperation(`Randomized with ${count} elements`);
    playSound(sounds.insert);
    if (topicSlug) markStarted(topicSlug);
  };

  const operationLabels = {
    array: { insert: "Insert", delete: "Delete" },
    "linked-list": { insert: "Insert Head", delete: "Delete Tail" },
    stack: { insert: "Push", delete: "Pop" },
    queue: { insert: "Enqueue", delete: "Dequeue" },
    deque: { insert: `Add ${dequeMode === "front" ? "Front" : "Back"}`, delete: `Remove ${dequeMode === "front" ? "Front" : "Back"}` },
    "hash-table": { insert: "Insert", delete: "Delete" },
  };

  const opLabels = operationLabels[structure];

  return (
    <div className="space-y-6">
      <div className="visualizer-box p-6 min-h-[260px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg capitalize">{structure.replace("-", " ")} Visualizer</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Elements: <span className="font-bold">{structure === "hash-table" ? Object.keys(hashMap).length : items.length}</span>
          </div>
        </div>

        {structure === "hash-table" ? (
          <div className="space-y-2">
            {Object.entries(hashMap).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="w-24 sm:w-32 shrink-0 text-xs font-bold text-gray-500 dark:text-gray-400 sm:text-right">Hash(key) →</div>
                <div className="flex-1 flex items-center gap-2 min-w-[120px]">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-primary/10 px-3 py-2 rounded-lg font-mono text-sm"
                  >
                    {key}
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-primary-fill text-white px-4 py-2 rounded-lg font-bold"
                  >
                    {val}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        ) : structure === "stack" ? (
          <div className="flex flex-col-reverse items-center gap-2 min-h-[220px]">
            <span className="font-mono text-[10px] uppercase tracking-wide text-faint">bottom</span>
            <div className="flex flex-col-reverse items-center gap-2">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      y: selectedIndex === index ? -4 : 0,
                    }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-colors ${
                      selectedIndex === index
                        ? "bg-comparing-fill border-2 border-comparing shadow-comparing/40"
                        : "bg-gradient-to-b from-primary to-primary-light dark:from-primary-fill dark:to-primary-fill"
                    }`}
                  >
                    {item}
                  </motion.div>
                ))}
              </AnimatePresence>
              {items.length === 0 && (
                <div className="text-faint text-sm">Empty stack — push some elements</div>
              )}
            </div>
            {items.length > 0 && (
              <span className="font-mono text-[10px] uppercase tracking-wide text-primary">top → {items[items.length - 1]}</span>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <AnimatePresence>
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {structure === "linked-list" && index > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-primary flex items-center"
                    >
                      <span className="text-xs">→</span>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      y: selectedIndex === index ? -8 : 0,
                    }}
                    whileHover={{ scale: 1.05 }}
                    className={`relative px-4 py-3 rounded-lg font-bold text-white shadow-md transition-colors ${
                      selectedIndex === index
                        ? "bg-comparing-fill border-2 border-comparing shadow-comparing/40"
                        : "bg-gradient-to-b from-primary to-primary-light dark:from-primary-fill dark:to-primary-fill"
                    }`}
                  >
                    {item}
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 dark:text-gray-400 font-semibold">
                      {index}
                    </span>
                  </motion.div>
                </div>
              ))}
            </AnimatePresence>
            {items.length === 0 && (
              <div className="text-gray-500 dark:text-gray-400 text-sm">Empty container — add some {structure.replace("-", " ")} elements</div>
            )}
          </div>
        )}

        {structure === "queue" && items.length > 0 && (
          <div className="mt-8 flex justify-center gap-8 text-xs font-semibold">
            <span className="text-green-600 dark:text-green-400">FRONT → {items[0]}</span>
            <span>← BACK {items[items.length - 1]}</span>
          </div>
        )}
        {structure === "deque" && items.length > 0 && (
          <div className="mt-8 flex justify-center gap-8 text-xs font-semibold">
            <span className="text-green-600 dark:text-green-400">FRONT ← {items[0]}</span>
            <span>→ BACK {items[items.length - 1]}</span>
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap gap-3 items-center">
          {structure === "hash-table" && (
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              placeholder="Key (optional)..."
              className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent font-mono text-sm focus:border-primary outline-none w-32"
            />
          )}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInsert()}
            placeholder={structure === "hash-table" ? "Value..." : "Enter value..."}
            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent font-mono text-sm focus:border-primary outline-none w-32"
          />
          <button onClick={handleInsert} className="px-4 py-2 bg-primary-fill text-white rounded-lg text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all">
            {opLabels.insert}
          </button>
          {structure === "hash-table" && (
            <input
              type="text"
              value={hashDeleteKey}
              onChange={(e) => setHashDeleteKey(e.target.value)}
              placeholder="Key to delete..."
              className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent font-mono text-sm focus:border-primary outline-none w-32"
            />
          )}
          <button onClick={handleDelete} className="px-4 py-2 bg-error/10 text-error font-semibold rounded-lg text-sm hover:bg-error-fill hover:text-white transition-all active:scale-95">
            {opLabels.delete}
          </button>
          <button onClick={handleClear} className="px-4 py-2 bg-selected/10 text-selected font-semibold rounded-lg text-sm hover:bg-selected-fill hover:text-white transition-all active:scale-95">
            Clear
          </button>
          <button onClick={handleRandomize} className="px-4 py-2 bg-accent/10 text-accent font-semibold rounded-lg text-sm hover:bg-accent-fill hover:text-white transition-all active:scale-95">
            Randomize
          </button>

          {structure === "deque" && (
            <button
              onClick={() => setDequeMode(dequeMode === "front" ? "back" : "front")}
              className="px-4 py-2 bg-secondary/10 text-secondary font-semibold rounded-lg text-sm hover:bg-secondary-fill hover:text-white transition-all active:scale-95"
            >
              Mode: {dequeMode === "front" ? "Front" : "Back"}
            </button>
          )}

          <div className="ml-auto card px-4 py-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 text-xs mr-2">Last:</span>
            <span className="font-medium">{lastOperation || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
