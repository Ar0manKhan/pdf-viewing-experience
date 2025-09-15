import {
  Dropzone,
  DropzoneEmptyState,
  DropzoneContent,
} from "@/components/ui/shadcn-io/dropzone";
import type { Doc } from "@/lib/indexedDb/docStore";
import { setDoc } from "@/lib/indexedDb/docStore";
import { useCallback, useState } from "react";

export default function Upload() {
  const [files, setFiles] = useState<File[] | undefined>();

  const handleDrop = useCallback(async (files: File[]) => {
    try {
      setFiles(files);
      const tasks = files.map(async (file) => {
        // generating hash
        const fileBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-1", fileBuffer);
        const hashHex = Array.from(new Uint8Array(hashBuffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        // saving to indexeddb
        const dbObj: Doc = {
          createdAt: Date.now(),
          name: file.name,
          size: file.size,
          type: file.type,
          hash: hashHex,
          data: file,
          id: crypto.randomUUID(),
        };
        return setDoc(dbObj); // each returns a promise; collected by Promise.all [7][10]
      });
      await Promise.all(tasks); // resolves when all succeed; rejects on first failure [5]
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <Dropzone
      accept={{ "application/pdf": [] }}
      maxFiles={100}
      maxSize={1024 * 1024 * 200}
      onDrop={handleDrop}
      onError={console.error}
      src={files}
    >
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
}
