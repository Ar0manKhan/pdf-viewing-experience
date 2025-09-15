import { Link } from "react-router";
import { Button } from "./ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import PageScale from "./pdf/PageScale";
import TTSPdf from "./TTSPdf";

interface DocumentSidebarProps {
  docInfo: {
    name: string;
    size: number;
    createdAt: number;
  } | null;
}

export function DocumentSidebar({ docInfo }: DocumentSidebarProps) {
  return (
    <aside className="w-80 border-r bg-muted/30 flex flex-col">
      {/* Header Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {docInfo && (
          <div className="flex items-center gap-2 mt-4">
            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="font-semibold text-foreground truncate">
                {docInfo.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                {(docInfo.size / 1024 / 1024).toFixed(2)} MB •{" "}
                {new Date(docInfo.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls Section */}
      <div className="flex-1 p-4 overflow-y-auto">
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
      </div>
    </aside>
  );
}
