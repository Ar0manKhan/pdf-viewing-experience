import { useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { DynamicIcon } from "lucide-react/dynamic";
import useTTSStore from "@/stores/pdf-tts-store";
import usePlayPdf from "@/lib/usePlayPdf";
import ModeToggle from "./ModeToggle";
import FollowModeToggle from "./FollowModeToggle";
import TtsVoiceSelect from "./TtsVoiceSelect";

export default function TtsControls() {
  const currentPage = useTTSStore((e) => e.page);
  const currentPosition = useTTSStore((e) => e.position);
  const isPlaying = useTTSStore((e) => e.isPlaying);
  const setPlaying = useTTSStore((e) => e.setPlaying);
  const resetPosition = useTTSStore((e) => e.resetPosition);

  const handleCancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  }, [setPlaying]);

  const playPdf = usePlayPdf();

  const currentVoice = useTTSStore((e) => e.voice);

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Voice Selection */}
        <TtsVoiceSelect />

        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Reading Mode</label>
          <ModeToggle />
        </div>

        {/* Follow Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Scroll Behavior</label>
          <FollowModeToggle />
        </div>

        {/* Playback Controls */}
        <div className="space-y-2">
          {!isPlaying && currentPage === 1 && currentPosition.start === 0 && (
            <Button
              onClick={() => playPdf(1, 0)}
              className="w-full"
              disabled={!currentVoice}
            >
              <DynamicIcon name="play" className="h-4 w-4 mr-2" />
              Start Reading
            </Button>
          )}

          {!isPlaying && (currentPage > 1 || currentPosition.start > 0) && (
            <Button
              onClick={() => playPdf(currentPage, currentPosition.start)}
              className="w-full"
              disabled={!currentVoice}
            >
              <DynamicIcon name="play" className="h-4 w-4 mr-2" />
              Resume Reading
            </Button>
          )}

          {(currentPage > 1 || currentPosition.start > 0) && (
            <div className="text-xs text-muted-foreground text-center">
              Last read: page {currentPage}, position {currentPosition.start}
            </div>
          )}

          {isPlaying && (
            <Button onClick={handleCancel} variant="outline" className="w-full">
              <DynamicIcon name="square" className="h-4 w-4 mr-2" />
              Stop Reading
            </Button>
          )}

          {!isPlaying && (currentPage > 1 || currentPosition.start > 0) && (
            <Button
              onClick={resetPosition}
              variant="outline"
              className="w-full"
            >
              <DynamicIcon name="rotate-ccw" className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <DynamicIcon name="volume-2" className="h-3 w-3" />
          <span>Ready to read</span>
        </div>
      </CardContent>
    </Card>
  );
}
