import PageScale from "@/components/pdf/PageScale";
import PdfCanvas from "@/components/pdf/PdfCanvas";
import TTSPdf from "@/components/TTSPdf";
import { getDoc } from "@/lib/indexedDb/docStore";
import usePdfTextStore from "@/stores/pdf-text-store";
import { useEffect } from "react";
import { useParams } from "react-router";

export default function App() {
  const params = useParams();
  const pdfBlob = usePdfTextStore((e) => e.pdfBlob);
  const setPdfBlob = usePdfTextStore((e) => e.setPdfBlob);
  useEffect(() => {
    async function loadDoc() {
      const docId = params["doc-id"];
      if (!docId) {
        return;
      }
      const doc = await getDoc(docId);
      if (!doc?.data) {
        return;
      }
      setPdfBlob(doc.data);
    }
    loadDoc();
  }, [params, setPdfBlob]);
  if (!pdfBlob) return <div>Loading...</div>;
  return (
    <div className="w-screen h-screen overflow-auto flex justify-between items-center">
      <div className="flex flex-col gap-4 items-center">
        <PageScale />
        <TTSPdf />
      </div>
      <PdfCanvas />
    </div>
  );
}
