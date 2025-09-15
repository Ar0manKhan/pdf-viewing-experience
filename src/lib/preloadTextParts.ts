import type { pdfjs } from "react-pdf";
import getTextParts from "./getTextParts";

export default async function preloadTextParts(
  pdf: pdfjs.PDFDocumentProxy | undefined,
  pageNum: number,
) {
  if (!pdf) return [];
  const page = await pdf.getPage(pageNum);
  if (!page) return [];
  return getTextParts(page);
}
