import { useCallback } from "react";
import { Button } from "./ui/button";
import usePdfTextStore from "@/stores/pdf-text-store";

export default function TTSPdf() {
  // get the first page data
  // read all the text from the page
  // send each sentence to tts one by one
  const getPageText = usePdfTextStore((e) => e.getPageTexts);
  const handleSpeak = useCallback(() => {
    const pageTexts = getPageText(1);
    if (!Array.isArray(pageTexts) || pageTexts.length === 0) return;

    const availableVoices = window.speechSynthesis.getVoices();
    const defaultVoice =
      availableVoices.find((voice) => voice.lang.includes("en")) ||
      availableVoices[0];
    const rate = 1;
    const pitch = 1;
    pageTexts.forEach((textPart) => {
      console.log("speaking", textPart.text);
      const utterance = new SpeechSynthesisUtterance(textPart.text);
      utterance.voice = defaultVoice;
      utterance.pitch = pitch;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    });
  }, [getPageText]);
  const handleCancel = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);
  return (
    <div className="flex gap-2">
      <Button onClick={handleSpeak}>Speak PDF</Button>
      <Button onClick={handleCancel}>Cancel</Button>
    </div>
  );
}
