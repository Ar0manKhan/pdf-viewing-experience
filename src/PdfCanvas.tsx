import { pdfjs, Document } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useCallback, useState } from "react";
import PdfPage from "./PdfPage";
import type { OnDocumentLoadSuccess } from "react-pdf/dist/shared/types.js";
import { Button } from "./components/ui/button";
import { Plus, Minus } from "lucide-react";
import { usePdfScaleStore } from "./stores/pdf-scale-store";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const url = "/b-tree.pdf";

export default function PdfCanvas() {
  const [pageCounts, setPageCounts] = useState<number[]>([]);
  const scale = usePdfScaleStore((e) => e.scale);
  const setScale = usePdfScaleStore((e) => e.setScale);

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = useCallback(
    async ({ numPages }) => {
      // take a middle page for page dimension
      setPageCounts(Array.from({ length: numPages }, (_, i) => i + 1));
    },
    [],
  );
  const zoomIn = useCallback(() => {
    setScale(scale + 0.1);
  }, [scale, setScale]);
  const zoomOut = useCallback(() => {
    setScale(scale - 0.1);
  }, [scale, setScale]);

  return (
    <div className="flex flex-col items-center justify-center bg-green-300">
      <div className="w-4/5 h-screen overflow-scroll relative">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          scale={scale}
        >
          {pageCounts.map((pageNumber) => (
            <PdfPage key={pageNumber} pageNumber={pageNumber} />
          ))}
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
