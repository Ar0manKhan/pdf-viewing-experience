import { usePdfUiStore } from "@/stores/pdf-ui-store";
import { Button } from "./ui/button";
import { DynamicIcon } from "lucide-react/dynamic";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function FollowModeToggle() {
  const followMode = usePdfUiStore((s) => s.followMode);
  const setFollowMode = usePdfUiStore((s) => s.setFollowMode);

  const handleClick = () => {
    setFollowMode(!followMode);
  };

  const tooltipText = followMode
    ? "Disable follow on scroll. The view will not follow the text being read."
    : "Enable follow on scroll. The view will automatically scroll to the text being read.";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            variant={followMode ? "default" : "outline"}
            className="w-full"
          >
            <DynamicIcon
              name={followMode ? "pin" : "pin-off"}
              className="h-4 w-4 mr-2"
            />
            {followMode ? "Follow on scroll" : "Scroll freely"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
