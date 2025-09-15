import { getDoc } from "@/lib/indexedDb/docStore";
import usePdfTextStore from "@/stores/pdf-text-store";
import usePdfIdbStore from "@/stores/pdf-idb-store";
import { Suspense, lazy, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Loader2 } from "lucide-react";
import useTTSStore from "@/stores/pdf-tts-store";
import { Skeleton } from "@/components/ui/skeleton";

const PdfCanvas = lazy(() => import("@/components/pdf/PdfCanvas"));
const DocumentSidebar = lazy(() => import("@/components/DocumentSidebar"));
const ErrorCard = lazy(() => import("@/components/ErrorCard"));

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
  const cleanIdbStore = usePdfIdbStore((e) => e.clean);
  const setPdfIdb = usePdfIdbStore((e) => e.setData);
  const setPlayingPosition = useTTSStore((e) => e.setPosition);

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
        if (doc.lastPlayed) {
          setPlayingPosition(
            doc.lastPlayed.page,
            doc.lastPlayed.part,
            doc.lastPlayed.part,
          );
        }
        setDocInfo({
          name: doc.name,
          size: doc.size,
          createdAt: doc.createdAt,
        });
        setPdfIdb(doc);
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
      cleanIdbStore();
    };
  }, [
    cleanIdbStore,
    cleanTTSStore,
    cleanTextStore,
    params,
    setPdfBlob,
    setPdfIdb,
    setPlayingPosition,
  ]);

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
    <div className="h-dvh bg-background md:flex">
      {/* Responsive Sidebar/Header */}
      <Suspense
        fallback={
          <div className="w-64 h-full bg-gray-100 dark:bg-gray-900 p-4">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        }
      >
        <DocumentSidebar docInfo={docInfo} />
      </Suspense>

      {/* PDF Viewer - takes full remaining space */}
      <main className="flex-1 overflow-hidden h-full">
        <Suspense
          fallback={
            <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading PDF...</p>
              </div>
            </div>
          }
        >
          <PdfCanvas />
        </Suspense>
      </main>
    </div>
  );
}
