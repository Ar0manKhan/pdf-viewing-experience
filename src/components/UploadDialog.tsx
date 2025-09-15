import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Dropzone,
  DropzoneEmptyState,
  DropzoneContent,
} from "./ui/shadcn-io/dropzone";
import { Button } from "./ui/button";
import { useState, useCallback } from "react";
import { setDoc, type Doc } from "@/lib/indexedDb/docStore";

interface UploadDialogProps {
  onUploadSuccess?: () => void;
}

export function UploadDialog({ onUploadSuccess }: UploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[] | undefined>();

  const handleDrop = useCallback(
    async (files: File[]) => {
      try {
        setUploadedFiles(files);
        const tasks = files.map(async (file) => {
          // generating hash
          const fileBuffer = await file.arrayBuffer();
          const hashBuffer = await window.crypto.subtle.digest(
            "SHA-1",
            fileBuffer
          );
          const hashHex = Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          // saving to indexeddb
          const dbObj: Doc = {
            createdAt: Date.now(),
            lastPlayed: null,
            name: file.name,
            size: file.size,
            type: file.type,
            hash: hashHex,
            data: file,
            id: crypto.randomUUID(),
          };
          return setDoc(dbObj);
        });
        await Promise.all(tasks);
        setIsOpen(false); // Close dialog after successful upload
        // Trigger refresh callback
        onUploadSuccess?.();
      } catch (err) {
        console.error(err);
      }
    },
    [onUploadSuccess]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload PDF Files</DialogTitle>
        </DialogHeader>
        <Dropzone
          accept={{ "application/pdf": [] }}
          maxFiles={100}
          maxSize={1024 * 1024 * 200}
          onDrop={handleDrop}
          onError={console.error}
          src={uploadedFiles}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </DialogContent>
    </Dialog>
  );
}
