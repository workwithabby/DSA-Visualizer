"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSoundContext } from "./SoundProvider";

export function SoundToggle() {
  const { soundEnabled, toggleSound } = useSoundContext();

  return (
    <button
      onClick={toggleSound}
      className="p-2 rounded-md border border-transparent text-faint hover:text-ink hover:border-rule hover:bg-ink/[0.04] transition-colors duration-200"
      aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
      title={soundEnabled ? "Sound ON" : "Sound OFF"}
    >
      {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
