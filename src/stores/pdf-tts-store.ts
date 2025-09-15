import { create } from "zustand";

type TTSPositionProp = {
  start: number;
  end: number;
};

export type TTSStateProp = {
  page: number;
  position: TTSPositionProp;
  setPage: (page: number) => void;
  setPosition: (page: number, start: number, end: number) => void;
};

const useTTSStore = create<TTSStateProp>((set) => ({
  page: 1,
  setPage: (page) => {
    set({ page });
  },
  position: {
    start: 0,
    end: 0,
  },
  setPosition: (page, start, end) => {
    set({ page, position: { start, end } });
  },
}));

export default useTTSStore;
