import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { getDocs } from "@/lib/indexedDb/docStore";

export default function App() {
  return (
    <div className="container mx-auto py-4">
      <div className="flex gap-4">
        <Link to="/doc">
          <Button>Go to doc</Button>
        </Link>
        <Link to="/upload">
          <Button>Upload file</Button>
        </Link>
      </div>
      <SavedFiles />
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
