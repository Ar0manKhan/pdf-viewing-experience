import useTTSStore from "@/stores/pdf-tts-store";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { usePdfUiStore } from "@/stores/pdf-ui-store";
import { LocateFixed, Pin, PinOff } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback } from "react";

export default function FollowModeToggle() {
  const followMode = usePdfUiStore((s) => s.followMode);
  const setFollowMode = usePdfUiStore((s) => s.setFollowMode);
  const isPlaying = useTTSStore((e) => e.isPlaying);
  const setScrollToView = usePdfUiStore((s) => s.setScrollToView);
  const showCurrentPage = useCallback(() => {
    setScrollToView(true);
    setTimeout(() => setScrollToView(false), 10);
  }, [setScrollToView]);

  if (isPlaying) {
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

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      onClick={showCurrentPage}
    >
      <LocateFixed className="h-4 w-4" />
      <span>Scroll to current page</span>
    </Button>
  );
}
