import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { getDocs, deleteDoc, type Doc } from "@/lib/indexedDb/docStore";
import { DynamicIcon } from "lucide-react/dynamic";
import { UploadDialog } from "@/components/UploadDialog";

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <img src="/logo.webp" alt="Logo" className="h-8 w-8" />
              Pdf Reader
            </h1>
            <UploadDialog onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-6">
        <FirefoxWarning />
        <SavedFiles refreshTrigger={refreshTrigger} />
      </main>
      <Footer />
    </div>
  );
}

function FirefoxWarning() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (navigator.userAgent.indexOf("Firefox") > -1) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 relative rounded-md mb-4"
      role="alert"
    >
      <div className="flex">
        <div className="py-1">
          <DynamicIcon name="alert-triangle" className="h-6 w-6 mr-4" />
        </div>
        <div>
          <p className="font-bold">Firefox Users</p>
          <p>Your browser might behave weirdly. We are working on fixing it.</p>
        </div>
        <button
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          onClick={() => setIsVisible(false)}
        >
          <DynamicIcon name="x" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

interface DocumentCardProps {
  id: string;
  name: string;
  lastPlayed: Doc["lastPlayed"];
  onDelete: (id: string) => void;
}

function DocumentCard({ id, name, lastPlayed, onDelete }: DocumentCardProps) {
  return (
    <div className="relative">
      <Link to={`/doc/${id}`} className="block">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center h-24 bg-muted/50 rounded-lg">
              <DynamicIcon
                name="file-text"
                className="h-8 w-8 text-muted-foreground"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardTitle className="text-sm font-medium line-clamp-2">
              {name}
            </CardTitle>
            {lastPlayed && (
              <p className="text-xs text-muted-foreground mt-1">
                Last Page: {lastPlayed.page}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
      <Button
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2 h-8 w-8 p-0"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(id);
        }}
      >
        <DynamicIcon name="trash" className="h-4 w-4" />
      </Button>
    </div>
  );
}

function SavedFiles({ refreshTrigger }: { refreshTrigger?: number }) {
  const [files, setFiles] = useState<
    {
      name: string;
      id: string;
      lastPlayed: Doc["lastPlayed"];
    }[]
  >([]);

  const loadFiles = useCallback(async () => {
    const docs = await getDocs();
    setFiles(
      docs.map((e) => ({ name: e.name, id: e.id, lastPlayed: e.lastPlayed })),
    );
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteDoc(id);
      loadFiles();
    },
    [loadFiles],
  );

  useEffect(() => {
    loadFiles();
  }, [loadFiles, refreshTrigger]);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Saved files</h1>
      {files.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <DynamicIcon
            name="file-text"
            className="mx-auto h-12 w-12 mb-4 opacity-50"
          />
          <p>No saved files yet</p>
          <p className="text-sm">Upload a PDF to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <DocumentCard
              key={file.id}
              id={file.id}
              name={file.name}
              lastPlayed={file.lastPlayed}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Footer() {
  const links = {
    github: "https://github.com/Ar0manKhan",
    project: "/",
    linkedin: "https://www.linkedin.com/in/ar0mankhan/",
    business: "https://BizzGrow.in",
  };

  return (
    <footer className="border-t bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold text-lg">Pdf Reader</h3>
            <p className="text-sm text-muted-foreground">by Arman</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="font-semibold">Connect</h4>
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href={links.project}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Project URL
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
          </div>
          <div>
            <h4 className="font-semibold">Consultancy</h4>
            <a
              href={links.business}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              BizzGrow.in
            </a>
            <p className="text-xs text-muted-foreground">
              for website development
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Built with inspiration from great tools like shadcn, React, Zustand,
            Tailwind CSS, and TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
}
