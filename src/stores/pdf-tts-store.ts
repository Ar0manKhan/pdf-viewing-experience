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
  page: 1,
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

useTTSStore.subscribe((e) => {
  console.log("TTS Store", e);
});

export default useTTSStore;
