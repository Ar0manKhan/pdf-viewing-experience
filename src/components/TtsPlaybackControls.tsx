import { memo, useCallback } from "react";
import { Button } from "./ui/button";
import { DynamicIcon } from "lucide-react/dynamic";
import useTTSStore from "@/stores/pdf-tts-store";
import usePlayPdf from "@/lib/hooks/usePlayPdf";

function TtsPlaybackControls() {
  const currentPage = useTTSStore((e) => e.page);
  const currentPosition = useTTSStore((e) => e.position);
  const isPlaying = useTTSStore((e) => e.isPlaying);
  const setPlaying = useTTSStore((e) => e.setPlaying);
  const resetPosition = useTTSStore((e) => e.resetPosition);
  const currentVoice = useTTSStore((e) => e.voice);

  const playPdf = usePlayPdf();

  const handleCancel = useCallback(() => {
    window.speechSynthesis.pause();
    setPlaying(false);
  }, [setPlaying]);

  return (
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
        <div className="text-xs text-muted-foreground text-right">
          Last read: page {currentPage}
        </div>
      )}

      {isPlaying && (
        <Button onClick={handleCancel} variant="outline" className="w-full">
          <DynamicIcon name="square" className="h-4 w-4 mr-2" />
          Stop Reading
        </Button>
      )}

      {!isPlaying && (currentPage > 1 || currentPosition.start > 0) && (
        <Button onClick={resetPosition} variant="outline" className="w-full">
          <DynamicIcon name="rotate-ccw" className="h-4 w-4 mr-2" />
          Reset
        </Button>
      )}
    </div>
  );
}

export default memo(TtsPlaybackControls);
