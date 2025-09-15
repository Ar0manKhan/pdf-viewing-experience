import { useState, useEffect } from "react";

export default function TTSWeb() {
  const [text, setText] = useState(
    "Hello world! This is a test of the text to speech system.",
  );
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const handleVoicesChanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log({ availableVoices });
      setVoices(availableVoices);
      // Find a default English voice
      const defaultVoice =
        availableVoices.find((voice) => voice.lang.includes("en")) ||
        availableVoices[0];
      if (defaultVoice) {
        setSelectedVoice(defaultVoice);
      }
    };

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      handleVoicesChanged,
    );
    handleVoicesChanged();

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged,
      );
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (text.trim() !== "" && selectedVoice) {
      window.speechSynthesis.cancel(); // Cancel any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.pitch = pitch;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoiceName = event.target.value;
    const voice = voices.find((v) => v.name === selectedVoiceName);
    if (voice) {
      setSelectedVoice(voice);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Text to Speech</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak"
        className="w-full p-2 border rounded-md mb-4"
        rows={5}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Pitch: {pitch}</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Rate: {rate}</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Voice:</label>
        <select
          onChange={handleVoiceChange}
          value={selectedVoice?.name || ""}
          className="w-full p-2 border rounded-md"
          disabled={voices.length === 0}
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSpeak}
        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-400"
        disabled={!text.trim() || !selectedVoice}
      >
        Speak
      </button>
    </div>
  );
}
