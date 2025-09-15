import type { RenderedRows } from "react-virtualized/dist/es/List";
import { create } from "zustand";

interface PdfVirtualizedStore {
  renderedRows: RenderedRows | null;
  setRenderedRows: (renderedRows: RenderedRows) => void;
  height: number;
  setHeight: (height: number) => void;
}

const usePdfVirtualizedStore = create<PdfVirtualizedStore>()((set) => ({
  renderedRows: null,
  setRenderedRows: (renderedRows) => set({ renderedRows }),
  height: 0,
  setHeight: (height) => set({ height }),
}));

export default usePdfVirtualizedStore;
