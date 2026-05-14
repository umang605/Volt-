"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppMode } from "@/types";

interface ModeStore {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggle: () => void;
}

export const useMode = create<ModeStore>()(
  persist(
    (set, get) => ({
      mode: "volt",
      setMode: (mode) => set({ mode }),
      toggle: () => set({ mode: get().mode === "volt" ? "hr" : "volt" }),
    }),
    { name: "volt-mode" }
  )
);
