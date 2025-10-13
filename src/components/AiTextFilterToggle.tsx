import { DynamicIcon } from "lucide-react/dynamic";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { usePdfUiStore } from "@/stores/pdf-ui-store";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Link } from "react-router";

export default function AiTextFilterToggle() {
  const isEnabled = usePdfUiStore((e) => e.cleanTextByAi);
  const setIsEnabled = usePdfUiStore((e) => e.setCleanTextByAi);
  const [groqKey] = useLocalStorage("groq_api_key");

  if (!groqKey) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Text Enhancement</label>
        <Link
          to="/settings"
          className="flex items-center justify-center w-full p-2 text-sm border border-dashed border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <DynamicIcon name="settings" className="h-4 w-4 mr-2" />
          Setup AI Enhancement
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Text Enhancement</label>
      <ToggleGroup
        title="Text enhancement by AI"
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
