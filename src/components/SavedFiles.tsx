import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useCallback } from "react";
import {
  getDocs,
  deleteDoc,
  sortDocsByLastAccessed,
  type Doc,
} from "@/lib/indexedDb/docStore";
import { DynamicIcon } from "lucide-react/dynamic";

interface DocumentCardProps {
  id: string;
  name: string;
  lastPlayed: Doc["lastPlayed"];
  onDelete: (id: string) => void;
}

function DocumentCard({ id, name, lastPlayed, onDelete }: DocumentCardProps) {
  return (
    <Card className="relative">
      <Link to={`/doc/${id}`} className="block">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-center h-24 bg-muted/50 rounded-lg">
            <DynamicIcon
              name="file-text"
              className="h-8 w-8 text-muted-foreground"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardTitle
            title={name}
            className="text-sm font-medium line-clamp-2 mb-2"
          >
            {name}
          </CardTitle>
          {lastPlayed && (
            <Badge variant="secondary">Last Page: {lastPlayed.page}</Badge>
          )}
        </CardContent>
      </Link>
      <div className="absolute top-1 right-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <DynamicIcon name="more-vertical" className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <a
                href={`/doc/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center"
              >
                <DynamicIcon name="external-link" className="mr-2 h-4 w-4" />
                <span>Open in new tab</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(id)}
              className="text-red-600 focus:text-red-600"
            >
              <DynamicIcon name="trash" className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

export default function SavedFiles({
  refreshTrigger,
}: {
  refreshTrigger?: number;
}) {
  const [files, setFiles] = useState<
    {
      name: string;
      id: string;
      lastPlayed: Doc["lastPlayed"];
    }[]
  >([]);

  const loadFiles = useCallback(async () => {
    const docs = await getDocs();
    const sortedDocs = sortDocsByLastAccessed(docs);
    setFiles(
      sortedDocs.map((e) => ({
        name: e.name,
        id: e.id,
        lastPlayed: e.lastPlayed,
      }))
    );
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteDoc(id);
      loadFiles();
    },
    [loadFiles]
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
