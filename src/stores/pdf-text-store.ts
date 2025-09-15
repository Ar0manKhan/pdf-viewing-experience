import preloadTextParts from "@/lib/preloadTextParts";
import type { pdfjs } from "react-pdf";
import { create } from "zustand";

export type TextPart = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
};

type PdfTextStoreProp = {
  pdfBlob: Blob | null;
  setPdfBlob: (pdfBlob: Blob) => void;
  pdf: pdfjs.PDFDocumentProxy | undefined;
  setPdf: (pdf: pdfjs.PDFDocumentProxy) => void;
  store: Map<number, TextPart[]>;
  getPageTexts: (page: number) => TextPart[] | undefined;
  setPageTexts: (page: number, texts: TextPart[]) => void;
  clean: () => void;
};

const usePdfTextStore = create<PdfTextStoreProp>((set, get) => ({
  pdfBlob: null,
  setPdfBlob: (pdfBlob) => {
    set({ pdfBlob });
  },
  pdf: undefined,
  setPdf: (pdf) => {
    set({ pdf });
  },
  store: new Map(),
  getPageTexts: (page) => {
    return get().store.get(page);
  },
  setPageTexts: (page, texts) => {
    set((store) => {
      const newStore = new Map(store.store);
      newStore.set(page, texts);
      return {
        store: newStore,
      };
    });
  },
  clean: () => {
    set({ store: new Map(), pdf: undefined, pdfBlob: null });
  },
}));

export function usePagePreloader() {
  const setPageTexts = usePdfTextStore((state) => state.setPageTexts);
  return async (page: number) => {
    const texts = await preloadTextParts(usePdfTextStore.getState().pdf, page);
    setPageTexts(page, texts);
  };
}

export default usePdfTextStore;
