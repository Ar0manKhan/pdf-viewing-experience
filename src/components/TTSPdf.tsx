import { useCallback } from "react";
import { Button } from "./ui/button";
import useTTSStore from "@/stores/pdf-tts-store";
import usePlayPdf from "@/lib/usePlayPdf";

export default function TTSPdf() {
  const setPosition = useTTSStore((e) => e.setPosition);
  const handleCancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setPosition(0, 0);
  }, [setPosition]);
  const playPdf = usePlayPdf();
  return (
    <div className="flex gap-2">
      <Button onClick={() => playPdf(1, 0)}>Speak PDF</Button>
      <Button onClick={handleCancel}>Cancel</Button>
    </div>
  );
}
