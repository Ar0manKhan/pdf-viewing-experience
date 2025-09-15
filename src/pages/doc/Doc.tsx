import PageScale from "@/components/pdf/PageScale";
import PdfCanvas from "@/components/pdf/PdfCanvas";
import TTSPdf from "@/components/TTSPdf";
import { getDoc } from "@/lib/indexedDb/docStore";
import usePdfTextStore from "@/stores/pdf-text-store";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Documents
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h1 className="font-semibold text-foreground truncate max-w-xs">
                    {docInfo?.name || "Document"}
                  </h1>
                  {docInfo && (
                    <p className="text-xs text-muted-foreground">
                      {(docInfo.size / 1024 / 1024).toFixed(2)} MB •{" "}
                      {new Date(docInfo.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-80 border-r bg-muted/30 p-4 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold mb-3">Zoom Controls</h2>
              <PageScale />
            </div>
            <div>
              <h2 className="font-semibold mb-3">Text-to-Speech</h2>
              <TTSPdf />
            </div>
          </div>
        </aside>

        {/* PDF Viewer */}
        <main className="flex-1 overflow-hidden">
          <PdfCanvas />
        </main>
      </div>
    </div>
  );
}
