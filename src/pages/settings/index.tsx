import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function Settings() {
  return (
    <div className="p-6">
      <GroqKey />
      <Toaster />
    </div>
  );
}

function GroqKey() {
  const [localValue, setLocalValue] = useLocalStorage("groq_api_key", "");
  const [groqApiKey, setGroqApiKey] = useState("");
  useEffect(() => {
    if (localValue) {
      setGroqApiKey(localValue);
    }
  }, [localValue]);
  const saveFn = useCallback(() => {
    setLocalValue(groqApiKey);
    if (groqApiKey.trim()) {
      toast.success("Groq API key updated");
    } else {
      toast.success("Groq API key removed");
    }
  }, [groqApiKey, setLocalValue]);
  return (
    <div className="flex gap-4">
      <Label htmlFor="groq-api-key" className="w-32">
        Groq API Key
      </Label>
      <Input
        type="text"
        value={groqApiKey}
        onChange={(e) => setGroqApiKey(e.target.value)}
        id="groq-api-key"
        placeholder="gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
      />
      <Button onClick={saveFn}>Save</Button>
    </div>
  );
}
