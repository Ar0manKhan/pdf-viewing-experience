import usePdfTextStore from "@/stores/pdf-text-store";
import useTTSStore from "@/stores/pdf-tts-store";
import preloadTextParts from "./preloadTextParts";
import chunk from "lodash-es/chunk";
import { useCallback, useMemo } from "react";

const CHUNK_SIZE = 50;
export default function usePlayPdf() {
  const setPosition = useTTSStore((e) => e.setPosition);
  const getPageText = usePdfTextStore((e) => e.getPageTexts);
  const pdf = usePdfTextStore((e) => e.pdf);
  const totalPageCount = useMemo(() => pdf?.numPages ?? 0, [pdf]);

  const playPdf = useCallback(
    async function (pageNum: number, position: number) {
      window.speechSynthesis.cancel();
      if (pageNum > totalPageCount) return;
      let pageTexts = getPageText(pageNum);
      if (!pageTexts) {
        const newParts = await preloadTextParts(pdf, pageNum);
        // TODO: Handle more carefully, there would be a case when a page does not
        // have text, but the next page does.
        if (!newParts) return;
        pageTexts = newParts;
      }
      const availableVoices = window.speechSynthesis.getVoices();
      const defaultVoice =
        availableVoices.find((voice) => voice.lang.includes("en")) ||
        availableVoices[0];
      const rate = 1;
      const pitch = 1;
      const textChunks = chunk(pageTexts.slice(position), CHUNK_SIZE);
      textChunks.forEach((c, i) => {
        const text = c
          .map((e) => e.text.trim())
          .filter(Boolean)
          .join(" ");
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = defaultVoice;
        utterance.pitch = pitch;
        utterance.rate = rate;
        utterance.addEventListener("start", () => {
          setPosition(
            position + i * CHUNK_SIZE,
            position + (i + 1) * CHUNK_SIZE,
          );
        });
        utterance.addEventListener("end", () => {
          setPosition(0, 0);
        });
        window.speechSynthesis.speak(utterance);
      });
    },
    [getPageText, pdf, setPosition, totalPageCount],
  );
  return playPdf;
}
