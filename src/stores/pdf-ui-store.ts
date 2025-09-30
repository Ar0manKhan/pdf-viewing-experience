import { create } from "zustand";
import { persist } from "zustand/middleware";

type ReadingMode = "selection" | "reader";

type PdfUiStore = {
  scale: number;
  mode: ReadingMode;
  followMode: boolean;
  scrollToView: boolean;
  cleanTextByAi: boolean;
  setScale: (scale: number) => void;
  setMode: (mode: ReadingMode) => void;
  setFollowMode: (followMode: boolean) => void;
  setScrollToView: (scrollToView: boolean) => void;
  setCleanTextByAi: (cleanTextByAi: boolean) => void;
};

export const usePdfUiStore = create<PdfUiStore>()(
  persist(
    (set) => ({
      scale: 1.5,
      mode: "reader",
      followMode: false,
      scrollToView: false,
      cleanTextByAi: false,
      setScale: (scale) => set({ scale }),
      setMode: (mode) => set({ mode }),
      setFollowMode: (followMode) => set({ followMode }),
      setScrollToView: (scrollToView) => set({ scrollToView }),
      setCleanTextByAi: (cleanTextByAi) => set({ cleanTextByAi }),
    }),
    {
      name: "pdf-ui-storage", // name of the item in the storage (must be unique)
    },
  ),
);
