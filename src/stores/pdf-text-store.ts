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
  getPageTexts: (page: number) => TextPart[] | undefined;
  setPageTexts: (page: number, texts: TextPart[]) => void;
};

const usePdfTextStore = create<PdfTextStoreProp>((set, get) => ({
  store: new Map(),
  getPageTexts: (page) => {
    return get().store.get(page);
  },
  setPageTexts: (page, texts) => {
    set((state) => ({
      store: state.store.set(page, texts),
    }));
  },
}));

export default usePdfTextStore;
