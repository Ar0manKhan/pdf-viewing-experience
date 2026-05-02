import { pdfjs, Document } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import {
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { OnDocumentLoadSuccess } from "react-pdf/dist/shared/types.js";
import usePdfTextStore from "@/stores/pdf-text-store";
import { useDebouncedScale } from "@/hooks/useDebouncedScale";
import { useZoomCentering } from "@/hooks/useZoomCentering";
import getMajorityHeight from "@/lib/getMajorityHeight";
import { Skeleton } from "../ui/skeleton";
import List, { type List as ListType } from "react-virtualized/dist/es/List";
import PdfPage from "./PdfPage";
import usePdfVirtualizedStore from "@/stores/pdf-virtualized-store";
import useTTSStore from "@/stores/pdf-tts-store";
import { usePdfUiStore } from "@/stores/pdf-ui-store";
import useElementSize from "@/lib/hooks/useElementSize";

// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfCanvas() {
  const [pageCount, setPageCount] = useState(0);
  const { debouncedScale, isDebouncing } = useDebouncedScale();
  const listRef = useRef<ListType | null>(null);
  const setPdf = usePdfTextStore((e) => e.setPdf);
  const pageHeight = usePdfVirtualizedStore((e) => e.height);
  const setPageHeight = usePdfVirtualizedStore((e) => e.setHeight);
  const ref = useRef<HTMLDivElement>(null);
  const size = useElementSize(ref as RefObject<HTMLDivElement>);
  const setRenderedRows = usePdfVirtualizedStore((e) => e.setRenderedRows);
  const renderedRows = usePdfVirtualizedStore((e) => e.renderedRows);
  const pdfPage = useTTSStore((e) => e.page);
  const isPlaying = useTTSStore((e) => e.isPlaying);
  const scrollIntoViewMannally = usePdfUiStore((e) => e.scrollToView);
  const followMode = usePdfUiStore((e) => e.followMode);

  // Maintain viewport center position during zoom. It is boilderplat to fix issue on zoom
  useZoomCentering(listRef, isDebouncing, debouncedScale, size?.height || 0);

  const scrollIndex = useMemo(() => {
    if ((!isPlaying && !scrollIntoViewMannally) || (isPlaying && !followMode))
      return undefined;
    const targetPage = pdfPage - 1;
    if (targetPage < 0) return undefined;
    if (!renderedRows) return undefined;
    if (
      targetPage >= renderedRows.overscanStartIndex &&
      targetPage <= renderedRows.overscanStopIndex
    )
      return undefined;
    if (pageCount === 0) return undefined;
    return targetPage;
  }, [
    followMode,
    isPlaying,
    pageCount,
    pdfPage,
    renderedRows,
    scrollIntoViewMannally,
  ]);

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = useCallback(
    async (pdf) => {
      setPdf(pdf);
      const numPages = pdf.numPages;
      setPageCount(numPages);
      if (numPages > 0) {
        setPageHeight(await getMajorityHeight(pdf));
      }
    },
    [setPageHeight, setPdf],
  );
  const pdfBlob = usePdfTextStore((e) => e.pdfBlob);
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div
        className="w-full h-full overflow-hidden relative bg-white shadow-sm"
        ref={ref}
      >
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <Document
            file={pdfBlob}
            onLoadSuccess={onDocumentLoadSuccess}
            scale={debouncedScale}
          >
            <List
              ref={listRef}
              height={size?.height || 0}
              width={size?.width || 0}
              rowHeight={pageHeight * debouncedScale}
              rowCount={pageCount}
              overscanRowCount={1}
              scrollToIndex={scrollIndex}
              onRowsRendered={setRenderedRows}
              rowRenderer={({ index, style, key }) => (
                <div style={style} key={key}>
                  <PdfPage key={key} pageNumber={index + 1} />
                </div>
              )}
            />
          </Document>
        </Suspense>
      </div>
    </div>
  );
}
