import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useEffect, useState, useCallback } from "react";
import { getDocs } from "@/lib/indexedDb/docStore";
import { FileText } from "lucide-react";
import { UploadDialog } from "../components/UploadDialog";

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Pdf Reader</h1>
            <UploadDialog onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <SavedFiles refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
}

interface DocumentCardProps {
  id: string;
  name: string;
}

function DocumentCard({ id, name }: DocumentCardProps) {
  return (
    <Link to={`/doc/${id}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-center h-24 bg-muted/50 rounded-lg">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardTitle className="text-sm font-medium line-clamp-2">
            {name}
          </CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
}

function SavedFiles({ refreshTrigger }: { refreshTrigger?: number }) {
  const [files, setFiles] = useState<{ name: string; id: string }[]>([]);

  const loadFiles = useCallback(async () => {
    const docs = await getDocs();
    setFiles(docs.map((e) => ({ name: e.name, id: e.id })));
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles, refreshTrigger]);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Saved files</h1>
      {files.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No saved files yet</p>
          <p className="text-sm">Upload a PDF to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <DocumentCard key={file.id} id={file.id} name={file.name} />
          ))}
        </div>
      )}
    </section>
  );
}
