import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import useTTSStore from "@/stores/pdf-tts-store";
import usePlayPdf from "@/lib/usePlayPdf";

export default function TTSPdf() {
  const setPosition = useTTSStore((e) => e.setPosition);
  const handleCancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setPosition(0, 0, 0);
  }, [setPosition]);
  const playPdf = usePlayPdf();
  const setVoice = useTTSStore((e) => e.setVoice);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    function getVoies() {
      const voices = window.speechSynthesis.getVoices();
      const defaultVoice = voices.find((voice) => voice.lang.includes("en"));
      if (defaultVoice) setVoice(defaultVoice);
      setVoices(voices);
    }
    if (window.speechSynthesis) {
      getVoies();
      window.speechSynthesis.onvoiceschanged = getVoies;
    }
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [setVoice]);
  const currentVoice = useTTSStore((e) => e.voice);
  const handleVoiceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const voice = voices.find((voice) => voice.name === e.target.value);
      if (voice) setVoice(voice);
    },
    [setVoice, voices],
  );

  return (
    <div className="flex flex-col gap-2">
      <select onChange={handleVoiceChange} value={currentVoice?.name}>
        <option value="">Select a voice</option>
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <Button onClick={() => playPdf(1, 0)}>Speak PDF</Button>
      <Button onClick={handleCancel}>Cancel</Button>
    </div>
  );
}
