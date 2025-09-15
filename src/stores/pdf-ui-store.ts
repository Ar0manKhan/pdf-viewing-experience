import { create } from "zustand";
import { persist } from "zustand/middleware";

type ReadingMode = "selection" | "reader";

type PdfUiStore = {
  scale: number;
  mode: ReadingMode;
  followMode: boolean;
  setScale: (scale: number) => void;
  setMode: (mode: ReadingMode) => void;
  setFollowMode: (followMode: boolean) => void;
};

export const usePdfUiStore = create<PdfUiStore>()(
  persist(
    (set) => ({
      scale: 1.5,
      mode: "reader",
      followMode: true,
      setScale: (scale) => set({ scale }),
      setMode: (mode) => set({ mode }),
      setFollowMode: (followMode) => set({ followMode }),
    }),
    {
      name: "pdf-ui-storage", // name of the item in the storage (must be unique)
    },
  ),
);
