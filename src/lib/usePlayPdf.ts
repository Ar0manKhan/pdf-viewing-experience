import usePdfTextStore from "@/stores/pdf-text-store";
import useTTSStore from "@/stores/pdf-tts-store";
import preloadTextParts from "./preloadTextParts";
import usePdfIdbStore from "@/stores/pdf-idb-store";
import chunk from "lodash-es/chunk";
import { useCallback, useEffect, useMemo } from "react";
import { setDoc } from "./indexedDb/docStore";

const CHUNK_SIZE = 50000;

export default function usePlayPdf() {
  const setPosition = useTTSStore((e) => e.setPosition);
  const getPageText = usePdfTextStore((e) => e.getPageTexts);
  const pdf = usePdfTextStore((e) => e.pdf);
  const totalPageCount = useMemo(() => pdf?.numPages ?? 0, [pdf]);
  const voice = useTTSStore((e) => e.voice);
  const setPlaying = useTTSStore((e) => e.setPlaying);
  const pdfIdbData = usePdfIdbStore((e) => e.data);
  const setPdfIdbLastPlayed = usePdfIdbStore((e) => e.setLastPlayedData);
  const resetTts = useTTSStore((e) => e.resetPosition);

  useEffect(() => {
    if (pdfIdbData) {
      setDoc(pdfIdbData);
    }
  }, [pdfIdbData]);

  const speechEnd = useCallback(() => {
    setPlaying(false);
    resetTts();
  }, [resetTts, setPlaying]);

  const playChunk = useCallback(
    async function (pageNum: number, chunkIndex: number, position: number) {
      if (!voice || pageNum > totalPageCount) {
        speechEnd();
        return;
      }

      let pageTexts = getPageText(pageNum);
      if (!pageTexts) {
        const newParts = await preloadTextParts(pdf, pageNum);
        if (!newParts) {
          speechEnd();
          return;
        }
        pageTexts = newParts;
      }

      const textChunks = chunk(pageTexts.slice(position), CHUNK_SIZE);

      // If no more chunks in current page, try next page
      if (chunkIndex >= textChunks.length) {
        playChunk(pageNum + 1, 0, 0);
        return;
      }

      const currentChunk = textChunks[chunkIndex];
      const text = currentChunk
        .map((e) => e.text.trim())
        .filter(Boolean)
        .join(" ");

      if (!text) {
        // If current chunk is empty, move to next chunk
        playChunk(pageNum, chunkIndex + 1, position);
        return;
      }

      const rate = 1;
      const pitch = 1;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;

      utterance.addEventListener("start", () => {
        const currentStartPosition = position + chunkIndex * CHUNK_SIZE;
        const currentEndPosition = position + (chunkIndex + 1) * CHUNK_SIZE;
        setPosition(pageNum, currentStartPosition, currentEndPosition);
        setPdfIdbLastPlayed({
          page: pageNum,
          part: currentStartPosition,
        });
        setPlaying(true);
      });

      utterance.addEventListener("end", () => {
        playChunk(pageNum, chunkIndex + 1, position);
      });

      window.speechSynthesis.speak(utterance);
    },
    [
      getPageText,
      pdf,
      setPdfIdbLastPlayed,
      setPlaying,
      setPosition,
      speechEnd,
      totalPageCount,
      voice,
    ],
  );

  const playPdf = useCallback(
    async function (pageNum: number, position: number) {
      window.speechSynthesis.cancel();
      playChunk(pageNum, 0, position);
    },
    [playChunk],
  );

  return playPdf;
}
