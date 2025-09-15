import { pdfjs, Document } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useCallback, useRef, useState, type RefObject } from "react";
import PdfPage from "./PdfPage";
import type { OnDocumentLoadSuccess } from "react-pdf/dist/shared/types.js";
import { usPdfUiStore } from "../../stores/pdf-ui-store";
import { List } from "react-virtualized/dist/es/List";
import useElementSize from "../../lib/useElementSize";
import usePdfTextStore from "@/stores/pdf-text-store";
import { useDebouncedScale } from "@/hooks/useDebouncedScale";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfCanvas() {
  const [pageCounts, setPageCounts] = useState<number[]>([]);
  const { debouncedScale } = useDebouncedScale();
  const setPdf = usePdfTextStore((e) => e.setPdf);
  const pageHeight = usPdfUiStore((e) => e.height);
  const setPageHeight = usPdfUiStore((e) => e.setHeight);
  const ref = useRef<HTMLDivElement>(null);
  const size = useElementSize(ref as RefObject<HTMLDivElement>);

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = useCallback(
    async (pdf) => {
      setPdf(pdf);
      const numPages = pdf.numPages;
      setPageCounts(Array.from({ length: numPages }, (_, i) => i + 1));
      // TODO: Find better way to get average page size
      if (numPages > 0) {
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        setPageHeight(viewport.height);
      }
    },
    [setPageHeight, setPdf],
  );
  const pdfBlob = usePdfTextStore((e) => e.pdfBlob);
  return (
    <div className="flex  flex-col items-center justify-center bg-green-300 min-w-4/5 w-4/5">
      <div
        className="w-full h-screen overflow-hidden relative bg-white"
        ref={ref}
      >
        <Document
          file={pdfBlob}
          onLoadSuccess={onDocumentLoadSuccess}
          scale={debouncedScale}
        >
          <List
            height={size?.height || 0}
            width={size?.width || 0}
            rowHeight={pageHeight * debouncedScale}
            rowCount={pageCounts.length}
            overscanRowCount={1}
            rowRenderer={({ index, style, key }) => (
              <PdfPage key={key} pageNumber={pageCounts[index]} style={style} />
            )}
          />
        </Document>
      </div>
    </div>
  );
}
