import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { DynamicIcon } from "lucide-react/dynamic";
import { Suspense, lazy, useState } from "react";
import { Skeleton } from "./ui/skeleton";

const PageScale = lazy(() => import("./pdf/PageScale"));
const TtsControls = lazy(() => import("./TtsControls"));
const DocumentInfo = lazy(() => import("./DocumentInfo"));

interface DocumentSidebarProps {
  docInfo: {
    name: string;
    size: number;
    createdAt: number;
  } | null;
}

export default function DocumentSidebar({ docInfo }: DocumentSidebarProps) {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const ControlsContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold mb-3">Zoom Controls</h2>
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <PageScale />
        </Suspense>
      </div>
      <div>
        <h2 className="font-semibold mb-3">Text-to-Speech</h2>
        <Suspense fallback={<Skeleton className="h-20 w-full" />}>
          <TtsControls />
        </Suspense>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: Floating reopen button when collapsed */}
      {isDesktopCollapsed && (
        <div className="hidden md:block fixed top-4 left-4 z-50">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsDesktopCollapsed(false)}
            className="shadow-md"
          >
            <DynamicIcon name="panel-right-open" className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex border-r bg-muted/30 flex-col transition-all duration-300 ${
          isDesktopCollapsed ? "w-0 overflow-hidden opacity-0" : "w-80 opacity-100"
        }`}
      >
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <DynamicIcon name="arrow-left" className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDesktopCollapsed(true)}
              title="Collapse sidebar"
            >
              <DynamicIcon name="panel-left-open" className="h-4 w-4" />
            </Button>
          </div>

          {docInfo && (
            <div className="mt-4">
              <Suspense fallback={<Skeleton className="h-12 w-full" />}>
                <DocumentInfo
                  name={docInfo.name}
                  size={docInfo.size}
                  createdAt={docInfo.createdAt}
                />
              </Suspense>
            </div>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <ControlsContent />
        </div>
      </aside>

      {/* Mobile: Floating back button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <Link to="/">
          <Button variant="secondary" size="icon" className="shadow-md">
            <DynamicIcon name="arrow-left" className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Mobile: Floating menu button */}
      <div className="md:hidden fixed top-4 right-4 z-40">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          className="shadow-md"
        >
          <DynamicIcon name="panel-bottom-open" className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Bottom Sheet */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent 
          side="bottom" 
          className="h-[85vh] md:hidden rounded-t-xl px-4"
          hideCloseButton
        >
          <SheetHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg">Document Controls</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
                className="h-8 w-8"
              >
                <DynamicIcon name="x" className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>
          <div className="mt-4 space-y-6 overflow-y-auto pb-8">
            {docInfo && (
              <Suspense fallback={<Skeleton className="h-12 w-full" />}>
                <DocumentInfo
                  name={docInfo.name}
                  size={docInfo.size}
                  createdAt={docInfo.createdAt}
                />
              </Suspense>
            )}
            <ControlsContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
