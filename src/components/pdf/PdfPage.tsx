import { pdfjs, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { memo, useCallback, type CSSProperties } from "react";
import type { PageCallback } from "react-pdf/src/shared/types.js";
import { usPdfUiStore } from "../../stores/pdf-ui-store";
import type { TextPart } from "@/stores/pdf-text-store";
import usePdfTextStore from "@/stores/pdf-text-store";

type PdfPageProps = {
  pageNumber: number;
};

const PdfPage = memo(function ({
  pageNumber,
  style,
}: PdfPageProps & { style: CSSProperties }) {
  const highlights = usePdfTextStore((e) => e.store.get(pageNumber));
  const setHighlights = usePdfTextStore((e) => e.setPageTexts);
  const scale = usPdfUiStore((e) => e.scale);
  const onPageLoadSuccess = useCallback(
    async (page: PageCallback) => {
      if (Array.isArray(highlights)) return;
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1 });
      const newHighlights: TextPart[] = [];
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
      setHighlights(pageNumber, newHighlights);
    },
    [highlights, pageNumber, setHighlights],
  );
  return (
    <div style={style}>
      <div className="relative">
        <Page pageNumber={pageNumber} onLoadSuccess={onPageLoadSuccess} />
        {highlights?.map((highlight, idx) => (
          <div
            key={idx}
            className="absolute bg-amber-100 hover:bg-amber-300 z-10 opacity-30 cursor-pointer"
            style={{
              left: highlight.x * scale,
              top: highlight.y * scale,
              width: highlight.width * scale,
              height: highlight.height * scale,
            }}
            title={highlight.text}
          />
        ))}
      </div>
    </div>
  );
});

export default PdfPage;
