import usePdfTextStore from "@/stores/pdf-text-store";
import useTTSStore from "@/stores/pdf-tts-store";
import preloadTextParts from "../preloadTextParts";
import usePdfIdbStore from "@/stores/pdf-idb-store";
import chunk from "lodash-es/chunk";
import { useCallback, useEffect, useMemo } from "react";
import { setDoc } from "../indexedDb/docStore";
import { textRemoveNoiseArray } from "../ai/text-remove-noise";
import { usePdfUiStore } from "@/stores/pdf-ui-store";

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
  const cleanTextByAi = usePdfUiStore((e) => e.cleanTextByAi);

  useEffect(() => {
    if (pdfIdbData) {
      setDoc(pdfIdbData);
    }
  }, [pdfIdbData]);

  const speechEnd = useCallback(() => {
    setPlaying(false);
    resetTts();
  }, [resetTts, setPlaying]);

  const _getPageData = useCallback(
    async function (pageNum: number, chunkIndex: number, position: number) {
      let pageTexts = getPageText(pageNum);
      if (pageNum > totalPageCount)
        return { pageNum: -1, chunkIndex: -1, position: -1, text: "" };
      if (!pageTexts) {
        const newParts = await preloadTextParts(pdf, pageNum);
        if (!newParts) {
          return { pageNum: -1, chunkIndex: -1, position: -1, text: "" };
        }
        pageTexts = newParts;
      }
      const textChunks = chunk(pageTexts.slice(position), CHUNK_SIZE);
      // If no more chunks in current page, try next page
      if (chunkIndex >= textChunks.length) {
        return _getPageData(pageNum + 1, 0, 0);
      }
      const currentChunk = textChunks[chunkIndex];
      const text = currentChunk
        .map((e) => e.text.trim())
        .filter(Boolean)
        .join(" ");
      if (!text) {
        // If current chunk is empty, move to next chunk
        return _getPageData(pageNum, chunkIndex + 1, position);
      }
      const currentTextArray = currentChunk.map((e) => e.text);
      let cleanTextArray = currentTextArray;
      if (cleanTextByAi) {
        cleanTextArray = await textRemoveNoiseArray(currentTextArray);
      }
      const cleanText = cleanTextArray.join(" ");
      return { pageNum, chunkIndex, position, text: cleanText };
    },
    [cleanTextByAi, getPageText, pdf, totalPageCount],
  );

  const playChunk = useCallback(
    async function (pageNum: number, chunkIndex: number, position: number) {
      const {
        pageNum: newPageNum,
        chunkIndex: newChunkIndex,
        position: newPosition,
        text,
      } = await _getPageData(pageNum, chunkIndex, position);
      if (newPageNum === -1 || !voice) {
        speechEnd();
        return;
      }
      const rate = 1;
      const pitch = 1;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.addEventListener("start", () => {
        const currentStartPosition = newPosition + newChunkIndex * CHUNK_SIZE;
        const currentEndPosition =
          newPosition + (newChunkIndex + 1) * CHUNK_SIZE;
        setPosition(newPageNum, currentStartPosition, currentEndPosition);
        setPdfIdbLastPlayed({
          page: newPageNum,
          part: currentStartPosition,
        });
        setPlaying(true);
      });
      utterance.addEventListener("end", () => {
        playChunk(newPageNum, newChunkIndex + 1, newPosition);
      });
      window.speechSynthesis.speak(utterance);
    },
    [
      _getPageData,
      setPdfIdbLastPlayed,
      setPlaying,
      setPosition,
      speechEnd,
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
