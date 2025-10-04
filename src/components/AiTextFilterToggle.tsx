import { DynamicIcon } from "lucide-react/dynamic";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { usePdfUiStore } from "@/stores/pdf-ui-store";

export default function AiTextFilterToggle() {
  const isEnabled = usePdfUiStore((e) => e.cleanTextByAi);
  const setIsEnabled = usePdfUiStore((e) => e.setCleanTextByAi);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Text Enhancement</label>
      <ToggleGroup
        type="single"
        value={isEnabled ? "ai-filter" : ""}
        onValueChange={(value) => setIsEnabled(value === "ai-filter")}
        className="w-full"
      >
        <ToggleGroupItem
          value="ai-filter"
          variant="outline"
          size="sm"
          className="w-full data-[state=on]:bg-black data-[state=on]:text-white"
        >
          <DynamicIcon name="sparkles" className="h-4 w-4 mr-2" />
          Text filter by AI
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
