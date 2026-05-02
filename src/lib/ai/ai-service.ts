import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

type AIProvider = "openai-compatible" | "groq";

interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}

function getAIConfig(): AIConfig | null {
  const provider = localStorage.getItem("ai_provider") as AIProvider | null;
  const apiKeyRaw = localStorage.getItem("ai_api_key");

  if (!provider || !apiKeyRaw) return null;

  let apiKey: string;
  try {
    apiKey = JSON.parse(apiKeyRaw);
  } catch {
    apiKey = apiKeyRaw;
  }

  if (!apiKey) return null;

  const baseUrl =
    localStorage.getItem("ai_base_url") || "https://api.openai.com/v1";
  const model =
    localStorage.getItem("ai_model") ||
    (provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-5-nano");

  return { provider, apiKey, baseUrl, model };
}

export async function generateAIResponse(prompt: string): Promise<string | null> {
  const config = getAIConfig();
  if (!config) return null;

  try {
    let model;

    if (config.provider === "groq") {
      const groq = createGroq({ apiKey: config.apiKey });
      model = groq(config.model);
    } else {
      const openaiCompatible = createOpenAICompatible({
        name: "openai-compatible",
        apiKey: config.apiKey,
        baseURL: config.baseUrl,
      });
      model = openaiCompatible(config.model);
    }

    const response = await generateText({
      model,
      prompt,
    });

    return response.text;
  } catch (err) {
    console.error("Error generating AI response:", err);
    return null;
  }
}
