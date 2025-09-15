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
import useElementSize from "../../lib/useElementSize";
import usePdfTextStore from "@/stores/pdf-text-store";
import { useDebouncedScale } from "@/hooks/useDebouncedScale";
import getMajorityHeight from "@/lib/getMajorityHeight";
import { Skeleton } from "../ui/skeleton";
import List from "react-virtualized/dist/es/List";
import PdfPage from "./PdfPage";
import usePdfVirtualizedStore from "@/stores/pdf-virtualized-store";
import useTTSStore from "@/stores/pdf-tts-store";
import { usePdfUiStore } from "@/stores/pdf-ui-store";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfCanvas() {
  const [pageCount, setPageCount] = useState(0);
  const { debouncedScale } = useDebouncedScale();
  const setPdf = usePdfTextStore((e) => e.setPdf);
  const pageHeight = usePdfVirtualizedStore((e) => e.height);
  const setPageHeight = usePdfVirtualizedStore((e) => e.setHeight);
  const ref = useRef<HTMLDivElement>(null);
  const size = useElementSize(ref as RefObject<HTMLDivElement>);
  const setRenderedRows = usePdfVirtualizedStore((e) => e.setRenderedRows);
  const renderedRows = usePdfVirtualizedStore((e) => e.renderedRows);
  const pdfPage = useTTSStore((e) => e.page);
  const followMode = usePdfUiStore((e) => e.followMode);
  const scrollIndex = useMemo(() => {
    if (!followMode) return undefined;
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
  }, [followMode, pageCount, pdfPage, renderedRows]);

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
