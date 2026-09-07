"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const SoundContext = createContext<{
  soundEnabled: boolean;
  toggleSound: () => void;
}>({ soundEnabled: true, toggleSound: () => {} });

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSoundContext = () => useContext(SoundContext);
