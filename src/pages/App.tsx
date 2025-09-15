import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { getDocs } from "@/lib/indexedDb/docStore";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Pdf Reader</h1>
            <Link to="/upload">
              <Button>Upload PDF</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <SavedFiles />
      </main>
    </div>
  );
}

function SavedFiles() {
  const [files, setFiles] = useState<{ name: string; id: string }[]>([]);
  useEffect(() => {
    getDocs().then((docs) => {
      setFiles(docs.map((e) => ({ name: e.name, id: e.id })));
    });
  }, []);
  return (
    <section className="mt-4">
      <h1 className="text-2xl font-bold">Saved files</h1>
      <div className="mt-2">
        {files.map((e) => (
          <div key={e.id} className="flex gap-2">
            <Link to={`/doc/${e.id}`}>{e.name}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
