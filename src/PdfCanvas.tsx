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
  const [pageDim, setPageDim] = useState({ height: 0, width: 0 });

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = useCallback(
    async ({ numPages }) => {
      // take a middle page for page dimension
      setPageCounts(Array.from({ length: numPages }, (_, i) => i + 1));
    },
    [],
  );
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
