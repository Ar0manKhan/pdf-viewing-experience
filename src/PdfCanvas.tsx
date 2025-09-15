import { pdfjs, Document } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useCallback, useRef, useState, type RefObject } from "react";
import PdfPage from "./PdfPage";
import type { OnDocumentLoadSuccess } from "react-pdf/dist/shared/types.js";
import { Button } from "./components/ui/button";
import { Plus, Minus } from "lucide-react";
import { usPdfUiStore } from "./stores/pdf-ui-store";
import { List } from "react-virtualized/dist/es/List";
import useElementSize from "./lib/useElementSize";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const url = "/b-tree.pdf";

export default function PdfCanvas() {
  const [pageCounts, setPageCounts] = useState<number[]>([]);
  const scale = usPdfUiStore((e) => e.scale);
  const setScale = usPdfUiStore((e) => e.setScale);
  const pageHeight = usPdfUiStore((e) => e.height);
  const setPageHeight = usPdfUiStore((e) => e.setHeight);
  const ref = useRef<HTMLDivElement>(null);
  const size = useElementSize(ref as RefObject<HTMLDivElement>);

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = useCallback(
    async (pdf) => {
      const numPages = pdf.numPages;
      setPageCounts(Array.from({ length: numPages }, (_, i) => i + 1));
      // TODO: Find better way to get average page size
      if (numPages > 0) {
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        setPageHeight(viewport.height);
      }
    },
    [setPageHeight],
  );
  const zoomIn = useCallback(() => {
    setScale(scale + 0.1);
  }, [scale, setScale]);
  const zoomOut = useCallback(() => {
    setScale(scale - 0.1);
  }, [scale, setScale]);

  return (
    <div className="flex flex-col items-center justify-center bg-green-300">
      <div
        className="min-w-4/5 w-4/5 h-screen overflow-hidden relative bg-white"
        ref={ref}
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          scale={scale}
        >
          <List
            height={size?.height || 0}
            width={size?.width || 0}
            rowHeight={pageHeight * scale}
            rowCount={pageCounts.length}
            overscanRowCount={1}
            rowRenderer={({ index, style, key }) => (
              <PdfPage key={key} pageNumber={pageCounts[index]} style={style} />
            )}
          />
        </Document>
      </div>
      <div className="flex gap-2 items-center">
        <p className="w-6">{scale.toFixed(1)}</p>
        <Button onClick={zoomOut} variant={"outline"}>
          <Minus />
        </Button>
        {/*<Slider
          defaultValue={[scale]}
          max={10}
          step={0.1}
          onValueChange={(e) => setScale(e[0])}
          className="w-56"
        />*/}
        <Button onClick={zoomIn} variant={"outline"}>
          <Plus />
        </Button>
      </div>
    </div>
  );
}
