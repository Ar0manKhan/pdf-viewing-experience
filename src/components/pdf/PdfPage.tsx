import { Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { memo, useCallback, useRef, useEffect } from "react";
import type { PageCallback } from "react-pdf/src/shared/types.js";
import { usePdfUiStore } from "../../stores/pdf-ui-store";
import usePdfTextStore, { type TextPart } from "@/stores/pdf-text-store";
import getTextParts from "@/lib/getTextParts";
import useTTSStore from "@/stores/pdf-tts-store";
import usePlayPdf from "@/lib/usePlayPdf";

type PdfPageProps = {
  pageNumber: number;
};

const PdfPage = memo(function ({ pageNumber }: PdfPageProps) {
  const highlights = usePdfTextStore((e) => e.store.get(pageNumber));
  const ttsPage = useTTSStore((e) => e.page);
  const ttsPosition = useTTSStore((e) => e.position);
  const playPdf = usePlayPdf();
  const setHighlights = usePdfTextStore((e) => e.setPageTexts);
  const pdfIsPlaying = useTTSStore((e) => e.isPlaying);
  const mode = usePdfUiStore((e) => e.mode);
  const highlightsContainerRef = useRef<HTMLDivElement>(null);
  const getHighlight = useCallback(
    (idx: number): HTMLDivElement | null | undefined => {
      if (!highlightsContainerRef.current) return null;
      return highlightsContainerRef.current.children[idx] as
        | HTMLDivElement
        | undefined;
    },
    []
  );

  useEffect(() => {
    if (pageNumber === ttsPage && ttsPosition.start >= 0) {
      const highlightElement = getHighlight(ttsPosition.start);
      if (highlightElement) {
        highlightElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [ttsPage, ttsPosition.start, pageNumber, getHighlight]);

  const onPageLoadSuccess = useCallback(
    async (page: PageCallback) => {
      if (Array.isArray(highlights)) return;
      const newHighlights = await getTextParts(page);
      setHighlights(pageNumber, newHighlights);
    },
    [highlights, pageNumber, setHighlights]
  );
  return (
    <div className="relative">
      <Page pageNumber={pageNumber} onLoadSuccess={onPageLoadSuccess} />
      {mode === "reader" && (
        <div ref={highlightsContainerRef}>
          {highlights?.map((highlight, idx) => (
            <Highlight
              key={idx}
              partInfo={highlight}
              highlight={
                ttsPage === pageNumber &&
                idx >= ttsPosition.start &&
                idx < ttsPosition.end &&
                pdfIsPlaying
              }
              idx={idx}
              pageNum={pageNumber}
              playPdf={playPdf}
            />
          ))}
        </div>
      )}
    </div>
  );
});

const Highlight = memo(function Highlight({
  partInfo,
  highlight,
  idx,
  pageNum,
  playPdf,
}: {
  partInfo: TextPart;
  highlight: boolean;
  idx: number;
  pageNum: number;
  playPdf: ReturnType<typeof usePlayPdf>;
}) {
  const scale = usePdfUiStore((e) => e.scale);
  const clickFn = useCallback(
    () => playPdf(pageNum, idx),
    [idx, pageNum, playPdf]
  );
  return (
    <div
      className="absolute hover:bg-amber-300 z-10 opacity-30 cursor-pointer"
      style={{
        left: partInfo.x * scale,
        top: partInfo.y * scale,
        width: partInfo.width * scale,
        height: partInfo.height * scale,
        background: highlight ? "var(--color-amber-200)" : undefined,
      }}
      title={partInfo.text}
      onClick={clickFn}
    />
  );
});
Highlight.displayName = "Highlight";

export default PdfPage;
