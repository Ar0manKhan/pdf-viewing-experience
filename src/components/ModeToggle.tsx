import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { usePdfUiStore } from "@/stores/pdf-ui-store";
import { Type, BookOpen } from "lucide-react";

export default function ModeToggle() {
  const mode = usePdfUiStore((e) => e.mode);
  const setMode = usePdfUiStore((e) => e.setMode);

  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => {
        if (value) setMode(value as "selection" | "reader");
      }}
      className="grid w-full grid-cols-2"
    >
      <ToggleGroupItem value="selection" variant="blackWhite" size="sm">
        <Type className="h-4 w-4" />
        Selection
      </ToggleGroupItem>
      <ToggleGroupItem value="reader" variant="blackWhite" size="sm">
        <BookOpen className="h-4 w-4" />
        Reader
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
