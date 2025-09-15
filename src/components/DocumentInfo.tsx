import { FileText } from "lucide-react";

interface DocumentInfoProps {
  name: string;
  size: number;
  createdAt: number;
}

export default function DocumentInfo({
  name,
  size,
  createdAt,
}: DocumentInfoProps) {
  const formatFileSize = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-2">
      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <h1 className="font-semibold text-foreground truncate">{name}</h1>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(size)}</span>
          <span>•</span>
          <span>{formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
