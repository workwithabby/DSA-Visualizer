"use client";

import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";

interface StepControllerProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onRestart: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function StepController({
  isPlaying,
  currentStep,
  totalSteps,
  onPlayPause,
  onPrevious,
  onNext,
  onRestart,
  speed,
  onSpeedChange,
}: StepControllerProps) {
  const buttonClass =
    "p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary-fill hover:text-white transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:hover:bg-primary/10 disabled:hover:text-primary";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button onClick={onRestart} className={buttonClass} title="Restart">
            <RotateCcw size={18} />
          </button>
          <button onClick={onPrevious} className={buttonClass} title="Previous Step">
            <SkipBack size={18} />
          </button>
          <button
            onClick={onPlayPause}
            className={`p-3.5 rounded-xl text-white font-semibold transition-all duration-200 active:scale-95 shadow-lg ${
              isPlaying ? "bg-accent-fill hover:bg-error-fill shadow-accent/30" : "bg-primary-fill hover:bg-primary-dark shadow-primary/30"
            }`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={onNext} className={buttonClass} title="Next Step">
            <SkipForward size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 tabular-nums">
            Step {currentStep} / {totalSteps}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted w-10">Speed</span>
        <div className="flex bg-ink/[0.04] dark:bg-ink/[0.04] rounded-lg p-1 gap-1 flex-1">
          {[
            { label: "Slow", value: 1600 },
            { label: "Normal", value: 800 },
            { label: "Fast", value: 300 },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => onSpeedChange(opt.value)}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                speed === opt.value
                  ? "bg-primary-fill text-white shadow"
                  : "text-muted hover:bg-ink/[0.05]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
