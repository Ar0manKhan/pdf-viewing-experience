import type { Doc } from "@/lib/indexedDb/docStore";
import { create } from "zustand";

interface PdfIdbStore {
  data: Doc | null;
  setLastPlayedData: (data: Doc["lastPlayed"]) => void;
  setData: (data: Doc) => void;
  clean: () => void;
}

const pdfIdbStore = create<PdfIdbStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
  setLastPlayedData: (lastPlayed) => {
    set((state) => {
      if (state.data) {
        return {
          data: {
            ...state.data,
            lastPlayed,
          },
        };
      } else return state;
    });
  },
  clean: () => set({ data: null }),
}));

export default pdfIdbStore;
