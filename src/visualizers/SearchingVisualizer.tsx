"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundContext } from "@/components/SoundProvider";
import { sounds } from "@/lib/sounds";
import { StepController } from "@/components/StepController";
import { useProgress } from "@/components/ProgressProvider";

type SearchAlgo = "linear" | "binary";

interface SearchStep {
  description: string;
  explanation: string;
  why: string;
  arr: number[];
  highlighted: number[];
  foundIndex: number | null;
  type: "compare" | "found" | "notfound" | "init";
}

export function SearchingVisualizer({ algo = "linear", topicSlug }: { algo?: SearchAlgo; topicSlug?: string }) {
  const [arr, setArr] = useState<number[]>(() =>
    algo === "linear" ? [42, 17, 89, 5, 63, 28, 71, 34] : [5, 12, 25, 34, 47, 58, 63, 79, 84, 92]
  );
  const [target, setTarget] = useState("");
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [inputArr, setInputArr] = useState("");
  const [showWhy, setShowWhy] = useState(false);

  const { soundEnabled } = useSoundContext();
  const { markStarted, markCompleted } = useProgress();

  const playSound = (fn: () => void) => {
    if (soundEnabled) fn();
  };

  const generateSearchSteps = (data: number[], searchTarget: number, searchAlgo: SearchAlgo): SearchStep[] => {
    const genSteps: SearchStep[] = [];

    if (searchAlgo === "linear") {
      for (let i = 0; i < data.length; i++) {
        const copy = [...data];
        genSteps.push({
          description: `Compare element ${data[i]} with target ${searchTarget}`,
          explanation:
            data[i] === searchTarget
              ? `${data[i]} matches the target! We found it.`
              : `${data[i]} is not equal to ${searchTarget}. Move to the next element.`,
          why: "Linear search compares each element one by one from the beginning until a match is found or we reach the end.",
          arr: copy,
          highlighted: [i],
          foundIndex: data[i] === searchTarget ? i : null,
          type: data[i] === searchTarget ? "found" : "compare",
        });

        if (data[i] === searchTarget) {
          return genSteps;
        }
      }

      genSteps.push({
        description: `Reached the end of the array`,
        explanation: `We checked all ${data.length} elements and did not find ${searchTarget}.`,
        why: "If the entire array was searched without a match, the target does not exist in the data.",
        arr: [...data],
        highlighted: [],
        foundIndex: null,
        type: "notfound",
      });
    } else {
      const sorted = [...data].sort((a, b) => a - b);
      let low = 0;
      let high = sorted.length - 1;

      genSteps.push({
        description: `Array is sorted: [${sorted.join(", ")}]`,
        explanation: `Binary search requires a sorted array to work correctly.`,
        why: "Binary search eliminates half the search space each step, which only works on ordered data.",
        arr: [...sorted],
        highlighted: [],
        foundIndex: null,
        type: "init",
      });

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const copy = [...sorted];
        genSteps.push({
          description: `Check middle: arr[${mid}] = ${sorted[mid]}`,
          explanation:
            sorted[mid] === searchTarget
              ? `${sorted[mid]} equals ${searchTarget}. Found it at index ${mid}!`
              : sorted[mid] < searchTarget
              ? `${sorted[mid]} < ${searchTarget}, so search the right half.`
              : `${sorted[mid]} > ${searchTarget}, so search the left half.`,
          why: `By comparing with the middle element, we can eliminate half the remaining elements with a single comparison.`,
          arr: copy,
          highlighted: [mid],
          foundIndex: sorted[mid] === searchTarget ? mid : null,
          type: sorted[mid] === searchTarget ? "found" : "compare",
        });

        if (sorted[mid] === searchTarget) return genSteps;

        if (sorted[mid] < searchTarget) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      genSteps.push({
        description: `Low (${low}) > High (${high})`,
        explanation: `The search boundaries crossed, meaning ${searchTarget} is not in the array.`,
        why: "When low exceeds high, we've searched the entire array without finding the target.",
        arr: [...sorted],
        highlighted: [],
        foundIndex: null,
        type: "notfound",
      });
    }

    return genSteps;
  };

  const resetData = () => {
    if (algo === "linear") {
      setArr([42, 17, 89, 5, 63, 28, 71, 34]);
    } else {
      setArr([5, 12, 25, 34, 47, 58, 63, 79, 84, 92]);
    }
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    setShowWhy(false);
  };

  const handleSearch = () => {
    const searchTarget = parseInt(target);
    if (isNaN(searchTarget)) return;
    const newSteps = generateSearchSteps(arr, searchTarget, algo);
    setSteps(newSteps);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    playSound(sounds.click);
    if (topicSlug) markStarted(topicSlug);
  };

  const handleCustomArray = () => {
    const values = inputArr
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    if (values.length === 0) return;
    setArr(algo === "binary" ? values.sort((a, b) => a - b) : values);
    setSteps([]);
    setCurrentStepIndex(-1);
    playSound(sounds.click);
    if (topicSlug) markStarted(topicSlug);
  };

  const startSearch = (autoPlay: boolean) => {
    const defaultTarget = parseInt(target) || (algo === "linear" ? 28 : 58);
    const newSteps = generateSearchSteps(arr, defaultTarget, algo);
    setSteps(newSteps);
    setTarget(String(defaultTarget));
    if (topicSlug) markStarted(topicSlug);
    setCurrentStepIndex(-1);
    setIsPlaying(autoPlay);
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
        if (steps[next].type === "found") playSound(sounds.success);
        else if (steps[next].type === "compare") playSound(sounds.compare);
        else if (steps[next].type === "notfound") playSound(sounds.error);
      }
      if (topicSlug && next === steps.length - 1) markCompleted(topicSlug);
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
          if (steps[prev]?.type === "found") playSound(sounds.complete);
          if (topicSlug) markCompleted(topicSlug);
          return prev;
        }
        const next = prev + 1;
        if (steps[next].type === "found") playSound(sounds.success);
        else if (steps[next].type === "compare") playSound(sounds.compare);
        else if (steps[next].type === "notfound") playSound(sounds.error);
        return next;
      });
    }, speed);
    return () => clearTimeout(t);
  }, [isPlaying, currentStepIndex, steps, speed, topicSlug, markCompleted]);

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const displayArr = currentStep ? currentStep.arr : arr;

  return (
    <div className="space-y-6">
      <div className="visualizer-box p-6">
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Target value"
            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent font-mono text-sm focus:border-primary outline-none w-32"
          />
          <button onClick={handleSearch} className="px-4 py-2 bg-primary-fill text-white rounded-lg text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all">
            Search
          </button>
          <button onClick={resetData} className="px-4 py-2 bg-accent/10 text-accent font-semibold rounded-lg text-sm hover:bg-accent-fill hover:text-white transition-all active:scale-95">
            Random
          </button>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputArr}
              onChange={(e) => setInputArr(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomArray()}
              placeholder={algo === "binary" ? "Sorted: 1,5,8,12,20" : "1,5,8,12,20"}
              className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent font-mono text-sm focus:border-primary outline-none flex-1 min-w-[180px]"
            />
            <button onClick={handleCustomArray} className="px-3 py-2 bg-secondary/10 text-secondary font-semibold rounded-lg text-sm hover:bg-secondary-fill hover:text-white transition-all active:scale-95">
              Set
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-center gap-2 min-h-[120px]">
          <AnimatePresence>
            {displayArr.map((val, index) => {
              const isHighlighted = currentStep?.highlighted?.includes(index);
              const isFound = currentStep?.foundIndex === index;

              return (
                <motion.div
                  key={`${index}-${val}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative w-12 h-14 rounded-lg flex items-center justify-center font-bold text-white shadow-lg transition-all duration-300 ${
                    isFound
                      ? "bg-success-fill border-2 border-success scale-110 shadow-success/40"
                      : isHighlighted
                      ? "bg-comparing-fill border-2 border-comparing scale-110 shadow-comparing/40"
                      : "bg-gradient-to-b from-primary to-primary-light dark:from-primary-fill dark:to-primary-fill"
                  }`}
                >
                  {val}
                  <span className="absolute -bottom-5 text-[10px] font-semibold text-gray-500 dark:text-gray-400">{index}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {algo === "binary" && (
          <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-bold">Note:</span> Binary search requires sorted data. The array is {displayArr.every((v, i) => i === 0 || displayArr[i - 1] <= v) ? "sorted ✓" : "NOT sorted ⚠"}
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
            <p className="text-lg">Enter a target value or press <span className="font-bold text-primary">Play</span></p>
            <p className="text-sm mt-1">{algo === "linear" ? "Linear search checks each element one by one" : "Binary search halves the search space each step"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
