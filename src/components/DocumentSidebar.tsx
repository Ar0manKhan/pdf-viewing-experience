import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ArrowLeft, Menu } from "lucide-react";
import { DocumentInfo } from "./DocumentInfo";
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
  const ControlsContent = () => (
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
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Document Controls</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ControlsContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {docInfo && (
          <div className="mt-4">
            <DocumentInfo
              name={docInfo.name}
              size={docInfo.size}
              createdAt={docInfo.createdAt}
            />
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-80 border-r bg-muted/30 flex-col">
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
            <div className="mt-4">
              <DocumentInfo
                name={docInfo.name}
                size={docInfo.size}
                createdAt={docInfo.createdAt}
              />
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="flex-1 p-4 overflow-y-auto">
          <ControlsContent />
        </div>
      </aside>
    </>
  );
}
