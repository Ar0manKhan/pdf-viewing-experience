import { create } from "zustand";

type PdfScaleStore = {
  scale: number;
  setScale: (scale: number) => void;
};

export const usePdfScaleStore = create<PdfScaleStore>((set) => ({
  scale: 2,
  setScale: (scale) => set({ scale }),
}));
