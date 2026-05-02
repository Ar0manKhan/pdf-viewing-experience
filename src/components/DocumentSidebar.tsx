import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      {/* Mobile Header */}
      <div className="md:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <DynamicIcon name="arrow-left" className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <DynamicIcon name="menu" className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Document Controls</SheetTitle>
              </SheetHeader>
              <div className="mt-6 px-4 pb-4">
                <ControlsContent />
              </div>
            </SheetContent>
          </Sheet>
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

      {/* Floating expand button when sidebar is collapsed (desktop only) */}
      {isCollapsed && (
        <div className="hidden md:block fixed top-4 left-4 z-50">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsCollapsed(false)}
            className="shadow-md"
          >
            <DynamicIcon name="panel-right-open" className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex border-r bg-muted/30 flex-col transition-all duration-300 ${
          isCollapsed ? "w-0 overflow-hidden opacity-0" : "w-80 opacity-100"
        }`}
      >
        {/* Header Section */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <DynamicIcon name="arrow-left" className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(true)}
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

        {/* Controls Section */}
        <div className="flex-1 p-4 overflow-y-auto">
          <ControlsContent />
        </div>
      </aside>
    </>
  );
}
