import { pdfjs, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useCallback, useState } from "react";
import type { PageCallback } from "react-pdf/src/shared/types.js";

type Highlight = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
};

type PdfPageProps = {
  pageNumber: number;
};

export default function PdfPage({ pageNumber }: PdfPageProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  const onPageLoadSuccess = useCallback(async (page: PageCallback) => {
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1 });

    const newHighlights: Highlight[] = [];

    for (const tc of textContent.items) {
      if (!("str" in tc)) continue;
      const objTransformed = pdfjs.Util.transform(
        viewport.transform,
        tc.transform,
      );
      newHighlights.push({
        x: objTransformed[4],
        y: objTransformed[5] + objTransformed[3],
        width: tc.width,
        height: tc.height,
        text: tc.str,
      });
    }
    setHighlights(newHighlights);
  }, []);

  return (
    <div className="relative">
      <Page pageNumber={pageNumber} onLoadSuccess={onPageLoadSuccess} />
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
  );
}
