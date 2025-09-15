import { create } from "zustand";

type ReadingMode = "selection" | "reader";

type PdfUiStore = {
  scale: number;
  height: number;
  mode: ReadingMode;
  setScale: (scale: number) => void;
  setHeight: (height: number) => void;
  setMode: (mode: ReadingMode) => void;
};

export const usePdfUiStore = create<PdfUiStore>((set) => ({
  scale: 1.5,
  height: 0,
  mode: "reader",
  setScale: (scale) => set({ scale }),
  setHeight: (height) => set({ height }),
  setMode: (mode) => set({ mode }),
}));
