import type { TextPart } from "@/stores/pdf-text-store";
import type { TextContent } from "react-pdf/dist/shared/types.js";

export default function extractTextContent(
  textContent: TextContent,
): TextPart[] {
  const newHighlights: TextPart[] = [];
  for (const tc of textContent.items) {
    if (!("str" in tc)) continue;
    newHighlights.push({
      x: tc.transform[4],
      y: tc.transform[5] + tc.transform[3],
      width: tc.width,
      height: tc.height,
      text: tc.str,
    });
  }
  return newHighlights;
}
