"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSoundContext } from "@/components/SoundProvider";
import { sounds } from "@/lib/sounds";
import { StepController } from "@/components/StepController";
import { useProgress } from "@/components/ProgressProvider";

type ElementState = "normal" | "comparing" | "swapping" | "sorted" | "selected";

interface Bar {
  id: string;
  value: number;
}

interface SortStep {
  description: string;
  explanation: string;
  why: string;
  codeLine: number;
  bars: Bar[];
  highlighted: number[];
  state: ElementState;
}

type SortAlgorithm = "bubble" | "selection" | "insertion" | "merge" | "quick" | "heap";

interface SortingVisualizerProps {
  algorithm?: SortAlgorithm;
  topicSlug?: string;
}

let idCounter = 0;
function makeBar(value: number): Bar {
  return { id: `bar-${idCounter++}-${value}-${Math.random().toString(36).slice(2, 7)}`, value };
}

export function SortingVisualizer({ algorithm = "bubble", topicSlug }: SortingVisualizerProps) {
  const [bars, setBars] = useState<Bar[]>([]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [inputValue, setInputValue] = useState("");
  const [showWhy, setShowWhy] = useState(false);

  const { soundEnabled } = useSoundContext();
  const { markStarted, markCompleted } = useProgress();

  const playSound = (fn: () => void) => {
    if (soundEnabled) fn();
  };

  const generateSteps = useCallback(
    (initialBars: Bar[], algo: SortAlgorithm): SortStep[] => {
      const arr = initialBars.map((b) => ({ ...b }));
      const genSteps: SortStep[] = [];

      const pushStep = (
        description: string,
        explanation: string,
        why: string,
        codeLine: number,
        highlighted: number[],
        state: ElementState
      ) => {
        genSteps.push({
          description,
          explanation,
          why,
          codeLine,
          bars: arr.map((b, idx) => {
            const firstIdx = arr.findIndex((x) => x.id === b.id);
            return { ...b, id: firstIdx === idx ? b.id : `${b.id}-${idx}` };
          }),
          highlighted: highlighted.filter((i) => i >= 0 && i < arr.length),
          state,
        });
      };

      if (algo === "bubble") {
        for (let i = 0; i < arr.length - 1; i++) {
          let swapped = false;
          for (let j = 0; j < arr.length - i - 1; j++) {
            const a = arr[j].value;
            const b = arr[j + 1].value;
            pushStep(
              `Compare ${a} and ${b}`,
              a > b
                ? `${a} is greater than ${b}, so we need to swap them.`
                : `${a} is less than or equal to ${b}, so they stay in order.`,
              "We compare adjacent elements to check if they are in the correct order. Larger elements should be to the right.",
              2,
              [j, j + 1],
              "comparing"
            );

            if (a > b) {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              swapped = true;
              pushStep(
                `Swap ${a} and ${b}`,
                `Since ${a} is greater than ${b}, we swap them so the smaller one comes first.`,
                "The bubble sort moves larger elements toward the end by swapping adjacent pairs.",
                3,
                [j, j + 1],
                "swapping"
              );
              playSound(sounds.swap);
            }
          }
          if (!swapped) {
            pushStep(
              "Array is sorted!",
              "A full pass with no swaps means the array is sorted.",
              "The bubble sort stops early when it detects no swaps in a full pass.",
              4,
              [],
              "sorted"
            );
            break;
          }
          pushStep(
            `Element ${arr[arr.length - i - 1].value} is now in its final position`,
            "The largest element of this pass has bubbled to the end.",
            "Each full pass guarantees at least one more element reaches its correct sorted position.",
            1,
            [arr.length - i - 1],
            "sorted"
          );
        }
        pushStep(
          "Bubble Sort complete!",
          "The array is now fully sorted.",
          "All elements are in ascending order.",
          5,
          [],
          "sorted"
        );
      } else if (algo === "selection") {
        for (let i = 0; i < arr.length - 1; i++) {
          let minIdx = i;
          pushStep(
            `Set minimum to index ${i} (value ${arr[i].value})`,
            `Assume position ${i} has the minimum of the remaining unsorted portion.`,
            "We assume the first position has the minimum and verify by scanning the rest.",
            0,
            [i],
            "selected"
          );

          for (let j = i + 1; j < arr.length; j++) {
            pushStep(
              `Compare arr[${minIdx}] (${arr[minIdx].value}) with arr[${j}] (${arr[j].value})`,
              arr[j].value < arr[minIdx].value
                ? `${arr[j].value} is smaller, so it becomes the new minimum.`
                : `${arr[j].value} is not smaller, keep current minimum at index ${minIdx}.`,
              "We scan the unsorted portion to find the smallest element.",
              3,
              [minIdx, j],
              "comparing"
            );
            if (arr[j].value < arr[minIdx].value) {
              minIdx = j;
            }
          }

          if (minIdx !== i) {
            const valI = arr[i].value;
            const valMin = arr[minIdx].value;
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            pushStep(
              `Swap arr[${i}] (${valI}) with arr[${minIdx}] (${valMin})`,
              `Found minimum ${valMin} at index ${minIdx}. Swap it with position ${i}.`,
              "We place the minimum at its correct sorted position at the beginning of the unsorted region.",
              4,
              [i, minIdx],
              "swapping"
            );
          }
          pushStep(
            `Position ${i} is now sorted`,
            `The element at index ${i} is in its final spot.`,
            "Selection sort grows the sorted region by one element per pass.",
            0,
            [i],
            "sorted"
          );
        }
        pushStep(
          "Selection Sort complete!",
          "All elements are in their correct sorted positions.",
          "The sorted region now covers the entire array.",
          4,
          [],
          "sorted"
        );
      } else if (algo === "insertion") {
        pushStep(
          "Start with second element",
          "The first element is trivially sorted. We begin inserting from the second element.",
          "Insertion sort builds the sorted portion one element at a time.",
          0,
          [0],
          "sorted"
        );

        for (let i = 1; i < arr.length; i++) {
          const key = arr[i];
          pushStep(
            `Pick element ${key.value} at index ${i}`,
            `We need to insert ${key.value} into the sorted portion [0..${i - 1}].`,
            "We take the next unsorted element and find where it belongs.",
            1,
            [i],
            "selected"
          );

          let j = i - 1;
          while (j >= 0 && arr[j].value > key.value) {
            pushStep(
              `Compare ${arr[j].value} with ${key.value}`,
              `${arr[j].value} > ${key.value}, so shift ${arr[j].value} to the right.`,
              "We compare with sorted elements from right to left to find the insertion point.",
              2,
              [j, i],
              "comparing"
            );

            arr[j + 1] = arr[j];
            pushStep(
              `Shift ${arr[j].value} from index ${j} to ${j + 1}`,
              `Moving ${arr[j].value} right to make room for ${key.value}.`,
              "Shifting elements right creates space for the new element.",
              2,
              [j, j + 1],
              "swapping"
            );
            playSound(sounds.swap);
            j--;
          }

          arr[j + 1] = key;
          pushStep(
            `Insert ${key.value} at position ${j + 1}`,
            `Found the correct spot. ${key.value} goes to index ${j + 1}.`,
            "We place the element in the gap created by shifting.",
            3,
            [j + 1],
            "sorted"
          );

          pushStep(
            `Sorted portion is now [0..${i}]`,
            `[${arr.slice(0, i + 1).map((b) => b.value).join(", ")}] are sorted.`,
            "The sorted portion grows by one element each iteration.",
            4,
            Array.from({ length: i + 1 }, (_, k) => k),
            "sorted"
          );
        }

        pushStep(
          "Insertion Sort complete!",
          "All elements are in ascending order.",
          "Insertion sort is efficient for nearly sorted data.",
          5,
          [],
          "sorted"
        );
      } else if (algo === "merge") {
        pushStep(
          "Merge Sort started",
          `Array: [${arr.map((b) => b.value).join(", ")}]`,
          "Divide the array, sort halves, then merge. Divide-and-conquer strategy.",
          0,
          [],
          "selected"
        );

        function mergeSortRec(left: number, right: number): void {
          if (left >= right) return;
          const mid = Math.floor((left + right) / 2);

          pushStep(
            `Divide [${left}..${right}] at index ${mid}`,
            `Left: [${arr.slice(left, mid + 1).map((b) => b.value).join(", ")}], Right: [${arr.slice(mid + 1, right + 1).map((b) => b.value).join(", ")}]`,
            "Splitting into smaller subarrays until single elements remain.",
            0,
            Array.from({ length: right - left + 1 }, (_, i) => left + i),
            "comparing"
          );

          mergeSortRec(left, mid);
          mergeSortRec(mid + 1, right);

          const leftArr = arr.slice(left, mid + 1);
          const rightArr = arr.slice(mid + 1, right + 1);

          pushStep(
            `Merge [${left}..${mid}] and [${mid + 1}..${right}]`,
            `Combining [${leftArr.map((b) => b.value).join(", ")}] and [${rightArr.map((b) => b.value).join(", ")}]`,
            "We combine two sorted halves into one sorted subarray.",
            3,
            Array.from({ length: right - left + 1 }, (_, i) => left + i),
            "selected"
          );

          let i = 0,
            j = 0,
            k = left;
          while (i < leftArr.length && j < rightArr.length) {
            pushStep(
              `Compare ${leftArr[i].value} and ${rightArr[j].value}`,
              leftArr[i].value <= rightArr[j].value
                ? `${leftArr[i].value} <= ${rightArr[j].value}, take from left.`
                : `${leftArr[i].value} > ${rightArr[j].value}, take from right.`,
              "Pick the smaller element to maintain sorted order.",
              3,
              [k],
              "comparing"
            );

            if (leftArr[i].value <= rightArr[j].value) {
              arr[k] = leftArr[i];
              i++;
            } else {
              arr[k] = rightArr[j];
              j++;
            }

            pushStep(
              `Place ${arr[k].value} at index ${k}`,
              `Position ${k} now has ${arr[k].value}.`,
              "Place the selected element in its correct merged position.",
              3,
              [k],
              "swapping"
            );
            playSound(sounds.swap);
            k++;
          }

          while (i < leftArr.length) {
            arr[k] = leftArr[i];
            pushStep(
              `Copy remaining ${arr[k].value} to index ${k}`,
              "Left subarray has remaining elements.",
              "Copy remaining elements — they're already sorted.",
              3,
              [k],
              "swapping"
            );
            i++;
            k++;
          }

          while (j < rightArr.length) {
            arr[k] = rightArr[j];
            pushStep(
              `Copy remaining ${arr[k].value} to index ${k}`,
              "Right subarray has remaining elements.",
              "Copy remaining elements — they're already sorted.",
              3,
              [k],
              "swapping"
            );
            j++;
            k++;
          }

          pushStep(
            `Merged [${left}..${right}]`,
            `Result: [${arr.slice(left, right + 1).map((b) => b.value).join(", ")}]`,
            "The merged subarray is now sorted.",
            4,
            Array.from({ length: right - left + 1 }, (_, i) => left + i),
            "sorted"
          );
        }

        mergeSortRec(0, arr.length - 1);

        pushStep(
          "Merge Sort complete!",
          "The array is now fully sorted.",
          "Merge sort guarantees O(n log n) time.",
          5,
          [],
          "sorted"
        );
      } else if (algo === "quick") {
        pushStep(
          "Quick Sort started",
          `Array: [${arr.map((b) => b.value).join(", ")}]`,
          "Pick a pivot, partition around it, then recurse.",
          0,
          [],
          "selected"
        );

        function partition(low: number, high: number): number {
          const pivotVal = arr[high].value;
          pushStep(
            `Partition [${low}..${high}] — pivot: ${pivotVal}`,
            `Elements < ${pivotVal} go left, >= ${pivotVal} go right.`,
            "The pivot divides elements into two partitions.",
            0,
            Array.from({ length: high - low + 1 }, (_, i) => low + i),
            "selected"
          );

          let i = low - 1;
          for (let j = low; j < high; j++) {
            pushStep(
              `Compare arr[${j}]=${arr[j].value} with pivot ${pivotVal}`,
              arr[j].value < pivotVal
                ? `${arr[j].value} < ${pivotVal} -> left partition.`
                : `${arr[j].value} >= ${pivotVal} -> stays right.`,
              "Each element is placed in the correct partition.",
              2,
              [j, high],
              "comparing"
            );

            if (arr[j].value < pivotVal) {
              i++;
              if (i !== j) {
                const vi = arr[i].value;
                const vj = arr[j].value;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                pushStep(
                  `Swap arr[${i}]=${vi} and arr[${j}]=${vj}`,
                  `Move ${vj} left, ${vi} right.`,
                  "Swap to place elements in correct partitions.",
                  3,
                  [i, j],
                  "swapping"
                );
                playSound(sounds.swap);
              }
            }
          }

          const pivotIdx = i + 1;
          if (pivotIdx !== high) {
            const pv = arr[pivotIdx].value;
            [arr[pivotIdx], arr[high]] = [arr[high], arr[pivotIdx]];
            pushStep(
              `Place pivot ${pivotVal} at index ${pivotIdx}`,
              `Swap pivot with arr[${pivotIdx}]=${pv}.`,
              "Pivot is now in its final sorted position.",
              3,
              [pivotIdx, high],
              "swapping"
            );
            playSound(sounds.swap);
          }

          pushStep(
            `Pivot ${pivotVal} settled at index ${pivotIdx}`,
            `Left < ${pivotVal}, right >= ${pivotVal}.`,
            "Pivot is sorted. Recurse on the two partitions.",
            4,
            [pivotIdx],
            "sorted"
          );

          return pivotIdx;
        }

        function quickSortRec(low: number, high: number): void {
          if (low >= high) return;
          const p = partition(low, high);
          quickSortRec(low, p - 1);
          quickSortRec(p + 1, high);
        }

        quickSortRec(0, arr.length - 1);

        pushStep(
          "Quick Sort complete!",
          "The array is now fully sorted.",
          "Quick sort averages O(n log n) time.",
          5,
          [],
          "sorted"
        );
      } else if (algo === "heap") {
        pushStep(
          "Heap Sort started",
          `Array: [${arr.map((b) => b.value).join(", ")}]`,
          "Build a max-heap, then extract the maximum repeatedly.",
          0,
          [],
          "selected"
        );

        function heapify(size: number, root: number): void {
          let largest = root;
          const left = 2 * root + 1;
          const right = 2 * root + 2;
          const idx = [root];
          if (left < size) idx.push(left);
          if (right < size) idx.push(right);

          pushStep(
            `Heapify at index ${root} (${arr[root].value})`,
            `Compare with` +
              (left < size ? ` left=${arr[left].value}` : "") +
              (right < size ? ` right=${arr[right].value}` : "") +
              ".",
            "Ensure parent is larger than both children.",
            3,
            idx,
            "comparing"
          );

          if (left < size && arr[left].value > arr[largest].value) largest = left;
          if (right < size && arr[right].value > arr[largest].value) largest = right;

          if (largest !== root) {
            const rv = arr[root].value;
            const lv = arr[largest].value;
            [arr[root], arr[largest]] = [arr[largest], arr[root]];
            pushStep(
              `Swap ${rv} and ${lv}`,
              `${lv} > ${rv}, swap to restore heap property.`,
              "Parent swaps with larger child.",
              3,
              [root, largest],
              "swapping"
            );
            playSound(sounds.swap);
            heapify(size, largest);
          }
        }

        pushStep(
          "Phase 1: Build max-heap",
          "Rearrange array into a max-heap.",
          "A max-heap has the largest element at the root.",
          0,
          [],
          "selected"
        );

        for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
          heapify(arr.length, i);
        }

        pushStep(
          "Max-heap built",
          `Array: [${arr.map((b) => b.value).join(", ")}]`,
          "Largest element is at index 0.",
          0,
          [],
          "sorted"
        );

        for (let i = arr.length - 1; i > 0; i--) {
          const rv = arr[0].value;
          const ev = arr[i].value;
          [arr[0], arr[i]] = [arr[i], arr[0]];
          pushStep(
            `Swap root ${rv} with ${ev}`,
            `Move max ${rv} to final position at index ${i}.`,
            "Root is always the max — place it at the end.",
            1,
            [0, i],
            "swapping"
          );
          playSound(sounds.swap);

          pushStep(
            `Index ${i} sorted (${arr[i].value})`,
            `${arr[i].value} is in its final position.`,
            "Sorted portion grows from the right.",
            4,
            [i],
            "sorted"
          );

          heapify(i, 0);
        }

        pushStep(
          "Heap Sort complete!",
          "The array is now fully sorted.",
          "O(n log n) time, O(1) space.",
          5,
          [],
          "sorted"
        );
      }

      return genSteps;
    },
    []
  );

  const generateRandomBars = () => {
    const count = Math.floor(Math.random() * 6) + 5;
    return Array.from({ length: count }, () => makeBar(Math.floor(Math.random() * 90) + 10));
  };

  const startSort = (data: Bar[] = []) => {
    const init = data.length > 0 ? data : generateRandomBars();
    setBars(init);
    const newSteps = generateSteps(init, algorithm);
    setSteps(newSteps);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    setShowWhy(false);
  };

  const handleRandom = () => {
    setBars(generateRandomBars());
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    playSound(sounds.click);
    if (topicSlug) markStarted(topicSlug);
  };

  const handleAddValue = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setBars((prev) => [...prev, makeBar(val)]);
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    setInputValue("");
    playSound(sounds.insert);
  };

  const handlePlayPause = () => {
    if (steps.length === 0) {
      startSort(bars);
      if (topicSlug) markStarted(topicSlug);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const handleNext = () => {
    if (steps.length === 0) {
      startSort(bars);
      if (topicSlug) markStarted(topicSlug);
      setCurrentStepIndex(0);
      return;
    }
    setCurrentStepIndex((prev) => {
      const next = Math.min(prev + 1, steps.length - 1);
      handleStepEffect(next);
      return next;
    });
  };

  const handlePrevious = () => {
    setCurrentStepIndex((prev) => {
      const next = Math.max(prev - 1, -1);
      if (next >= 0) handleStepEffect(next);
      return next;
    });
  };

  const handleRestart = () => {
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    setShowWhy(false);
  };

  const handleStepEffect = useCallback((index: number) => {
    if (index < 0 || index >= steps.length) return;
    const step = steps[index];
    if (step.description.includes("Swap")) {
      playSound(sounds.swap);
    } else if (step.description.includes("Compare")) {
      playSound(sounds.compare);
    } else if (step.description.includes("complete") || step.description.includes("sorted!")) {
      playSound(sounds.complete);
    } else if (step.description.includes("final position") || step.description.includes("sorted")) {
      playSound(sounds.success);
    }
  }, [steps]);

  useEffect(() => {
    if (!isPlaying) return;
    if (steps.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev + 1 >= steps.length) {
          setIsPlaying(false);
          return prev;
        }
        const next = prev + 1;
        handleStepEffect(next);
        return next;
      });
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, handleStepEffect, speed]);

  useEffect(() => {
    if (steps.length > 0 && currentStepIndex === steps.length - 1) {
      if (topicSlug) markCompleted(topicSlug);
    }
  }, [currentStepIndex, steps.length, topicSlug, markCompleted]);

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const displayBars = currentStep ? currentStep.bars : bars;
  const maxDisplayValue = Math.max(1, ...displayBars.map((b) => b.value));

  return (
    <div className="space-y-6">
      <div className="visualizer-box p-6 min-h-[340px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg capitalize">{algorithm.replace("-", " ")} Visualizer</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Elements: <span className="font-bold">{displayBars.length}</span>
          </div>
        </div>

        <div className="flex items-end justify-center gap-1 sm:gap-1.5 h-[200px]">
          {displayBars.map((bar, index) => {
            const isHighlighted = currentStep?.highlighted?.includes(index) ?? false;
            const state: ElementState = isHighlighted && currentStep ? currentStep.state : "normal";

            const stateClass =
              state === "comparing"
                ? "bg-comparing-fill border-2 border-comparing shadow-comparing/40"
                : state === "swapping"
                ? "bg-moving-fill border-2 border-moving shadow-moving/40"
                : state === "sorted"
                ? "bg-success-fill border-2 border-success shadow-success/40"
                : state === "selected"
                ? "bg-selected-fill border-2 border-selected shadow-selected/40"
                : "bg-gradient-to-t from-primary to-primary-light dark:from-primary-fill dark:to-primary-fill border-2 border-primary-dark/50";

            return (
              <motion.div
                key={bar.id}
                layout
                initial={false}
                animate={{
                  scale: state === "swapping" ? 1.12 : state === "comparing" ? 1.06 : 1,
                  y: state === "swapping" || state === "comparing" ? -4 : 0,
                  opacity: 1,
                }}
                transition={{ layout: { type: "spring", stiffness: 300, damping: 28 }, scale: { duration: 0.15 } }}
                className="flex-1 min-w-0 max-w-11 flex flex-col items-center"
              >
                <motion.div
                  layout
                  animate={{ height: `${Math.max((bar.value / maxDisplayValue) * 165, 20)}px` }}
                  transition={{ layout: { type: "spring", stiffness: 300, damping: 28 } }}
                  className={`w-full rounded-t-lg shadow-lg ${stateClass} transition-colors duration-200 flex items-start justify-center pt-2 text-white font-bold`}
                >
                  <span className="text-xs">{bar.value}</span>
                </motion.div>
                <div className="w-full h-6 flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 mt-1">
                  {index}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-accent" /> Comparing
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-moving" /> Swapping
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-success" /> Sorted
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-selected" /> Selected
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddValue()}
            placeholder="Add value..."
            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent font-mono text-sm focus:border-primary outline-none w-32"
          />
          <button onClick={handleAddValue} className="px-4 py-2 bg-primary-fill text-white rounded-lg text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all">
            Add
          </button>
          <button onClick={handleRandom} className="px-4 py-2 bg-accent/10 text-accent font-semibold rounded-lg text-sm hover:bg-accent-fill hover:text-white transition-all active:scale-95">
            Randomize
          </button>
          <button onClick={handleRestart} className="px-4 py-2 bg-error/10 text-error font-semibold rounded-lg text-sm hover:bg-error-fill hover:text-white transition-all active:scale-95">
            Reset
          </button>
        </div>
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
            <p className="text-lg">Press <span className="font-bold text-primary">Play</span> to start the visualization</p>
            <p className="text-sm mt-1">Or randomize your data and watch the algorithm sort it step by step</p>
          </div>
        )}
      </div>
    </div>
  );
}
