import { Card, CardContent } from "./ui/card";
import { DynamicIcon } from "lucide-react/dynamic";
import ModeToggle from "./ModeToggle";
import FollowModeToggle from "./FollowModeToggle";
import TtsVoiceSelect from "./TtsVoiceSelect";
import TtsPlaybackControls from "./TtsPlaybackControls";
import AiTextFilterToggle from "./AiTextFilterToggle";

export default function TtsControls() {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <TtsVoiceSelect />

        <div className="space-y-2">
          <label className="text-sm font-medium">Reading Mode</label>
          <ModeToggle />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Scroll Behavior</label>
          <FollowModeToggle />
        </div>

        <TtsPlaybackControls />

        <AiTextFilterToggle />

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <DynamicIcon name="volume-2" className="h-3 w-3" />
          <span>Ready to read</span>
        </div>
      </CardContent>
    </Card>
  );
}
