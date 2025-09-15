import PdfCanvas from "@/components/pdf/PdfCanvas";
import { ErrorCard } from "@/components/ErrorCard";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { getDoc } from "@/lib/indexedDb/docStore";
import usePdfTextStore from "@/stores/pdf-text-store";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Loader2 } from "lucide-react";
import useTTSStore from "@/stores/pdf-tts-store";

export default function Doc() {
  const params = useParams();
  const setPdfBlob = usePdfTextStore((e) => e.setPdfBlob);
  const [docInfo, setDocInfo] = useState<{
    name: string;
    size: number;
    createdAt: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cleanTextStore = usePdfTextStore((e) => e.clean);
  const cleanTTSStore = useTTSStore((e) => e.clean);

  useEffect(() => {
    async function loadDoc() {
      try {
        setIsLoading(true);
        setError(null);
        const docId = params["doc-id"];
        if (!docId) {
          setError("Document ID not found");
          setIsLoading(false);
          return;
        }
        const doc = await getDoc(docId);
        if (!doc?.data) {
          setError("Document not found");
          setIsLoading(false);
          return;
        }
        setDocInfo({
          name: doc.name,
          size: doc.size,
          createdAt: doc.createdAt,
        });
        setPdfBlob(doc.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load document");
        setIsLoading(false);
        console.error(err);
      }
    }
    loadDoc();
    return () => {
      cleanTextStore();
      cleanTTSStore();
    };
  }, [params, setPdfBlob]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorCard
        title="Error Loading Document"
        message={error}
        backTo="/"
        backLabel="Back to Documents"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Unified Sidebar with metadata and controls */}
      <DocumentSidebar docInfo={docInfo} />

      {/* PDF Viewer - takes full remaining space */}
      <main className="flex-1 overflow-hidden">
        <PdfCanvas />
      </main>
    </div>
  );
}
