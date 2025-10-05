import { UploadDialog } from "@/components/UploadDialog";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "lucide-react/dynamic";
import { Link } from "react-router";

interface HeaderProps {
  onUploadSuccess: () => void;
}

export default function Header({ onUploadSuccess }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <img src="/logo.webp" alt="Logo" className="h-8 w-8" />
            Pdf Reader
          </h1>
          <div className="flex items-center gap-2">
            <UploadDialog onUploadSuccess={onUploadSuccess} />
            <Link to="/settings">
              <Button variant="outline" size="icon">
                <DynamicIcon name="settings" className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
