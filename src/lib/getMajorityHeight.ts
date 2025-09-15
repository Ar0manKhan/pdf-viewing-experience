// this function accepts pdf doc.
// get height of random page and return the majority height

import { pdfjs } from "react-pdf";

async function getMajorityHeight(doc: pdfjs.PDFDocumentProxy) {
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

  const allHeights = await Promise.all(
    pageIndexes.map(async (index) => {
      const page = await doc.getPage(index + 1);
      const viewport = page.getViewport({ scale: 1 });
      return viewport.height;
    }),
  );

  return Math.max(...allHeights);
}

export default getMajorityHeight;
