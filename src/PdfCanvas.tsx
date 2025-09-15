import { pdfjs, Document } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useCallback, useState } from "react";
import PdfPage from "./PdfPage";
import type { OnDocumentLoadSuccess } from "react-pdf/dist/shared/types.js";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const url = "/b-tree.pdf";

export default function PdfCanvas() {
  const [pageCounts, setPageCounts] = useState<number[]>([]);
  const [scale, setScale] = useState(1);

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = useCallback(
    async ({ numPages, getPage }) => {
      // take a middle page for page dimension
      setPageCounts(Array.from({ length: numPages }, (_, i) => i + 1));
      if (numPages > 2) {
        console.log("get page", getPage(2));
      }
    },
    [],
  );
  const zoomIn = useCallback(() => {
    setScale(scale + 0.1);
  }, [scale]);
  const zoomOut = useCallback(() => {
    setScale(scale - 0.1);
  }, [scale]);

  return (
    <div className="flex flex-col items-center justify-center bg-green-300">
      {/*<p>
        {pageDim.height} {pageDim.width}
      </p>*/}
      <div className="w-4/5 overflow-scroll relative">
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess} scale={2}>
          {pageCounts.map((pageNumber) => (
            <PdfPage key={pageNumber} pageNumber={pageNumber} />
          ))}
        </Document>
      </div>
    </div>
  );
}
