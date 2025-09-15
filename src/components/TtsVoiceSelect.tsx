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
  const [isFirefox, setIsFirefox] = useState(false);

  useEffect(() => {
    setIsFirefox(navigator.userAgent.toLowerCase().indexOf("firefox") > -1);
  }, []);

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

  if (isFirefox) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Voice</label>
        <select
          value={currentVoice?.name || ""}
          onChange={(e) => handleVoiceChange(e.target.value)}
          disabled={voices.length === 0}
          className="w-full p-2 border rounded-md bg-background text-foreground"
        >
          <option value="" disabled>
            Select a voice
          </option>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
    );
  }

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
