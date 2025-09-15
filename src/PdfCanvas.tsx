import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useCallback, useState } from "react";
import type { PageCallback } from "react-pdf/src/shared/types.js";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const url = "/b-tree.pdf";

type Highlight = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  pageNumber: number;
};

export default function PdfCanvas() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [highlights, setHighlights] = useState<
    { x: number; y: number; width: number; height: number; text: string }[]
  >([]);
  const resetHighlights = useCallback(() => {
    setHighlights([]);
  }, []);

  const onDocumentLoadSuccess = useCallback(function ({
    numPages,
  }: {
    numPages: number;
  }) {
    setNumPages(numPages);
  }, []);

  const onPageLoadSuccess = useCallback(
    async (page: PageCallback) => {
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1 });

      const highlights: Highlight[] = [];

      for (const tc of textContent.items) {
        if (!("str" in tc)) continue;
        const objTransformed = pdfjs.Util.transform(
          viewport.transform,
          tc.transform,
        );
        highlights.push({
          x: objTransformed[4],
          y: objTransformed[5] + objTransformed[3],
          width: tc.width,
          height: tc.height,
          text: tc.str,
          pageNumber,
        });
      }
      setHighlights(highlights);
    },
    [pageNumber],
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-300">
      <div className="w-4/5 overflow-scroll relative">
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} onLoadSuccess={onPageLoadSuccess} />
        </Document>
        {highlights.map((highlight, idx) => (
          <div
            key={idx}
            className="absolute bg-amber-100 hover:bg-amber-300 z-10 opacity-30 cursor-pointer"
            style={{
              left: highlight.x,
              top: highlight.y,
              width: highlight.width,
              height: highlight.height,
            }}
            title={highlight.text}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 p-4">
        <button
          onClick={() => {
            resetHighlights();
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
            resetHighlights();
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
