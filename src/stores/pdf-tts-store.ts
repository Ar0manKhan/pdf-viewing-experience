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
  voice: SpeechSynthesisVoice | undefined;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  isPlaying: boolean;
  setPlaying: (isPlaying: boolean) => void;
  resetPosition: () => void;
  clean: () => void;
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
  // Find first English voice ar fallback to first voice
  voice: undefined,
  setVoice: (voice) => {
    set({ voice });
  },
  isPlaying: false,
  setPlaying: (isPlaying) => {
    set({ isPlaying });
  },
  resetPosition: () => {
    set({
      page: 1,
      position: { start: 0, end: 0 },
    });
  },
  clean: () => {
    set({
      page: 1,
      position: { start: 0, end: 0 },
      voice: undefined,
      isPlaying: false,
    });
  },
}));

export default useTTSStore;
