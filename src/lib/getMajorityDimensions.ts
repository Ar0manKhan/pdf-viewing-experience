// this function accepts pdf doc.
// get dimensions of random pages and return the majority dimensions

import { pdfjs } from "react-pdf";

export interface PageDimensions {
  width: number;
  height: number;
}

async function getMajorityDimensions(doc: pdfjs.PDFDocumentProxy): Promise<PageDimensions> {
  // if page count is less than 20, then page index will be all 1 to 20
  // else it will be 20 random page index
  const pageIndexes = [];
  const pageCount = doc.numPages;
  if (pageCount < 20) {
    for (let i = 0; i < pageCount; i++) {
      pageIndexes.push(i);
    }
  } else {
    for (let i = 0; i < 20; i++) {
      pageIndexes.push(Math.floor(Math.random() * pageCount));
    }
  }

  const allDimensions = await Promise.all(
    pageIndexes.map(async (index) => {
      const page = await doc.getPage(index + 1);
      const viewport = page.getViewport({ scale: 1 });
      return { width: viewport.width, height: viewport.height };
    }),
  );

  const maxWidth = Math.max(...allDimensions.map(d => d.width));
  const maxHeight = Math.max(...allDimensions.map(d => d.height));

  return { width: maxWidth, height: maxHeight };
}

export default getMajorityDimensions;
