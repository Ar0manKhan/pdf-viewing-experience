import { create } from "zustand";
import { persist } from "zustand/middleware";

type ReadingMode = "selection" | "reader";

type PdfUiStore = {
  scale: number;
  height: number;
  mode: ReadingMode;
  scrollToPage: number | null;
  setScale: (scale: number) => void;
  setHeight: (height: number) => void;
  setMode: (mode: ReadingMode) => void;
  setScrollToPage: (scrollToPage: number | null) => void;
};

export const usePdfUiStore = create<PdfUiStore>()(
  persist(
    (set) => ({
      scale: 1.5,
      height: 0,
      mode: "reader",
      scrollToPage: null,
      setScale: (scale) => set({ scale }),
      setHeight: (height) => set({ height }),
      setMode: (mode) => set({ mode }),
      setScrollToPage: (scrollToPage) => set({ scrollToPage }),
    }),
    {
      name: "pdf-ui-storage", // name of the item in the storage (must be unique)
    },
  ),
);
