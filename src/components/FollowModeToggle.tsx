import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { usePdfUiStore } from "@/stores/pdf-ui-store";
import { Pin, PinOff } from "lucide-react";

export default function FollowModeToggle() {
  const followMode = usePdfUiStore((s) => s.followMode);
  const setFollowMode = usePdfUiStore((s) => s.setFollowMode);

  return (
    <ToggleGroup
      type="single"
      value={followMode ? "on" : "off"}
      onValueChange={(value) => {
        if (value) setFollowMode(value === "on");
      }}
      className="grid w-full grid-cols-2"
    >
      <ToggleGroupItem value="on" variant="blackWhite" size="sm">
        <Pin className="h-4 w-4" />
        Follow
      </ToggleGroupItem>
      <ToggleGroupItem value="off" variant="blackWhite" size="sm">
        <PinOff className="h-4 w-4" />
        Free
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
