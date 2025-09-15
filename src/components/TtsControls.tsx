import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { Play, RotateCcw, Square, Volume2 } from "lucide-react";
import useTTSStore from "@/stores/pdf-tts-store";
import usePlayPdf from "@/lib/usePlayPdf";
import ModeToggle from "./ModeToggle";

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
  const setVoice = useTTSStore((e) => e.setVoice);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    function getVoices() {
      const voices = window.speechSynthesis.getVoices();
      const defaultVoice = voices.find((voice) => voice.lang.includes("en"));
      if (defaultVoice) setVoice(defaultVoice);
      setVoices(voices);
    }
    if (window.speechSynthesis) {
      getVoices();
      window.speechSynthesis.onvoiceschanged = getVoices;
    }
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [setVoice]);

  const currentVoice = useTTSStore((e) => e.voice);
  const handleVoiceChange = useCallback(
    (value: string) => {
      const voice = voices.find((voice) => voice.name === value);
      if (voice) setVoice(voice);
    },
    [setVoice, voices]
  );

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Voice Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Voice</label>
          <Select
            value={currentVoice?.name || ""}
            onValueChange={handleVoiceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Reading Mode</label>
          <ModeToggle />
        </div>

        {/* Playback Controls */}
        <div className="space-y-2">
          {!isPlaying && currentPage === 1 && currentPosition.start === 0 && (
            <Button
              onClick={() => playPdf(1, 0)}
              className="w-full"
              disabled={!currentVoice}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Reading
            </Button>
          )}

          {!isPlaying && (currentPage > 1 || currentPosition.start > 0) && (
            <Button
              onClick={() => playPdf(currentPage, currentPosition.start)}
              className="w-full"
              disabled={!currentVoice}
            >
              <Play className="h-4 w-4 mr-2" />
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
              <Square className="h-4 w-4 mr-2" />
              Stop Reading
            </Button>
          )}

          {!isPlaying && (currentPage > 1 || currentPosition.start > 0) && (
            <Button
              onClick={resetPosition}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Volume2 className="h-3 w-3" />
          <span>Ready to read</span>
        </div>
      </CardContent>
    </Card>
  );
}
