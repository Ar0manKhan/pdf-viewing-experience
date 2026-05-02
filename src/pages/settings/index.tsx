import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

type AIProvider = "openai-compatible" | "groq";

export default function Settings() {
  return (
    <div className="container mx-auto my-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <AISettings />
      <Toaster />
    </div>
  );
}

function AISettings() {
  const [provider, setProvider] = useLocalStorage<AIProvider>("ai_provider", "openai-compatible");
  const [apiKey, setApiKey] = useLocalStorage("ai_api_key", "");
  const [baseUrl, setBaseUrl] = useLocalStorage("ai_base_url", "https://api.openai.com/v1");
  const [model, setModel] = useLocalStorage("ai_model", "gpt-5-nano");

  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localBaseUrl, setLocalBaseUrl] = useState(baseUrl);
  const [localModel, setLocalModel] = useState(model);
  const [localProvider, setLocalProvider] = useState<AIProvider>(provider);

  const saveFn = useCallback(() => {
    setProvider(localProvider);
    setApiKey(localApiKey);
    setBaseUrl(localBaseUrl);
    setModel(localModel);
    toast.success("AI settings saved");
  }, [localProvider, localApiKey, localBaseUrl, localModel, setProvider, setApiKey, setBaseUrl, setModel]);

  const defaultModels: Record<AIProvider, string> = {
    "openai-compatible": "gpt-5-nano",
    "groq": "llama-3.3-70b-versatile",
  };

  const handleProviderChange = (value: AIProvider) => {
    setLocalProvider(value);
    setLocalModel(defaultModels[value]);
    if (value === "openai-compatible") {
      setLocalBaseUrl("https://api.openai.com/v1");
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-lg font-semibold">AI Provider</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Provider</Label>
          <div className="flex p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => handleProviderChange("openai-compatible")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
                localProvider === "openai-compatible"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              OpenAI Compatible
            </button>
            <button
              type="button"
              onClick={() => handleProviderChange("groq")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
                localProvider === "groq"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Groq
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-api-key">API Key</Label>
          <Input
            type="password"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            id="ai-api-key"
            placeholder={localProvider === "groq" ? "gsk_..." : "sk-..."}
          />
        </div>

        {localProvider === "openai-compatible" && (
          <div className="space-y-2">
            <Label htmlFor="ai-base-url">Base URL</Label>
            <Input
              type="text"
              value={localBaseUrl}
              onChange={(e) => setLocalBaseUrl(e.target.value)}
              id="ai-base-url"
              placeholder="https://api.openai.com/v1"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="ai-model">Model</Label>
          <Input
            type="text"
            value={localModel}
            onChange={(e) => setLocalModel(e.target.value)}
            id="ai-model"
            placeholder={localProvider === "groq" ? "llama-3.3-70b-versatile" : "gpt-5-nano"}
          />
        </div>

        <Button onClick={saveFn} className="w-full">Save Settings</Button>
      </div>
    </div>
  );
}
