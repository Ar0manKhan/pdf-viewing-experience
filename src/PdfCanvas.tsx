import { pdfjs, Document } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useCallback, useState } from "react";
import PdfPage from "./PdfPage";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const url = "/b-tree.pdf";

export default function PdfCanvas() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = useCallback(function ({
    numPages,
  }: {
    numPages: number;
  }) {
    setNumPages(numPages);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-300">
      <div className="w-4/5 overflow-scroll relative">
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          <PdfPage pageNumber={pageNumber} />
        </Document>
      </div>
      <div className="flex items-center justify-center gap-4 p-4">
        <button
          onClick={() => {
            setPageNumber(Math.max(1, pageNumber - 1));
          }}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <p className="text-lg font-semibold text-gray-800">
          Page {pageNumber} of {numPages || "--"}
        </p>
        <button
          onClick={() => {
            setPageNumber(Math.min(numPages || 1, pageNumber + 1));
          }}
          disabled={pageNumber >= (numPages || 1)}
          className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}