import { memo, useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import useTTSStore from "@/stores/pdf-tts-store";

function TtsVoiceSelect() {
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
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [setVoice]);

  const currentVoice = useTTSStore((e) => e.voice);
  const handleVoiceChange = useCallback(
    (value: string) => {
      const voice = voices.find((voice) => voice.name === value);
      if (voice) setVoice(voice);
    },
    [setVoice, voices],
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Voice</label>
      <Select
        value={currentVoice?.name || ""}
        onValueChange={handleVoiceChange}
        disabled={voices.length === 0}
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
  );
}

export default memo(TtsVoiceSelect);
