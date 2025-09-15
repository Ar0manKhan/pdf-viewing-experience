import { create } from "zustand";

type TTSPositionProp = {
  start: number;
  end: number;
};

export type TTSStateProp = {
  page: number;
  position: TTSPositionProp;
  setPage: (page: number) => void;
  setPosition: (start: number, end: number) => void;
};

const useTTSStore = create<TTSStateProp>((set) => ({
  page: 0,
  setPage: (page) => {
    set({ page });
  },
  position: {
    start: 0,
    end: 0,
  },
  setPosition: (start, end) => {
    set({ position: { start, end } });
  },
}));

export default useTTSStore;
