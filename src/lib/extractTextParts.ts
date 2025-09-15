import type { TextPart } from "@/stores/pdf-text-store";
import { pdfjs } from "react-pdf";

export default async function getTextParts(page: pdfjs.PDFPageProxy) {
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
  return newHighlights;
}
