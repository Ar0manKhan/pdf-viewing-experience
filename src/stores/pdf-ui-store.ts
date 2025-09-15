import { create } from "zustand";

type PdfUiStore = {
  scale: number;
  height: number;
  setScale: (scale: number) => void;
  setHeight: (height: number) => void;
};

export const usPdfUiStore = create<PdfUiStore>((set) => ({
  scale: 1.5,
  height: 0,
  setScale: (scale) => set({ scale }),
  setHeight: (height) => set({ height }),
}));
