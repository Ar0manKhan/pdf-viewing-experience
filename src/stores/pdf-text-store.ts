import { create } from "zustand";

export type TextPart = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
};

type PdfTextStoreProp = {
  store: Map<number, TextPart[]>;
  setPageTexts: (page: number, texts: TextPart[]) => void;
};

const usePdfTextStore = create<PdfTextStoreProp>((set) => ({
  store: new Map(),
  setPageTexts: (page, texts) => {
    set((state) => ({
      store: state.store.set(page, texts),
    }));
  },
}));

export default usePdfTextStore;
