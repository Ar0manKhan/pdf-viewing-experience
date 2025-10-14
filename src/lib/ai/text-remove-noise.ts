import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import findIndex from "lodash-es/findIndex";
import { getPromptToClean } from "./getPromptToClean";
import { getCleanText, setCleanText } from "../indexedDb/cleanTextCacheStore";

async function textRemoveNoise(text: string) {
  let groqApiKey = localStorage.getItem("groq_api_key");
  if (!groqApiKey) return text;
  try {
    groqApiKey = JSON.parse(groqApiKey);
  } catch (err) {
    console.error("Error parsing json:", err);
    return text;
  }
  if (!groqApiKey) return text;
  try {
    if (!text.trim().length) return;
    const groq = createGroq({
      apiKey: groqApiKey,
    });
    const response = await generateText({
      model: groq("openai/gpt-oss-20b"),
      prompt: getPromptToClean(text),
    });
    const result = response.text;
    return result;
  } catch (err) {
    console.error("Error parsing json:", err);
    return text;
  }
}

// TODO: Move this to idb instaed of local storage
export async function textRemoveNoiseCached(text: string) {
  const data = await getCleanText(text);
  if (data) return data;
  const result = await textRemoveNoise(text);
  if (result) {
    await setCleanText(text, result);
  }
  return result;
}

export async function textRemoveNoiseArray(texts: string[]): Promise<string[]> {
  const text = texts.join(" ");
  // send text to filter out noise using llm
  const cleanText = await textRemoveNoiseCached(text);
  // map the clean text back into the position of the original text array
  // TODO: Use more sophisticated mapping
  const cleanTextPart = cleanText?.split(" ") ?? [];
  let idx = 0;
  const result = Array(texts.length).fill("");
  const normalizedTexts = texts.map((e) => e.toLowerCase().trim());
  for (const i in cleanTextPart) {
    const normalizedCleanText = cleanTextPart[i].toLowerCase().trim();
    const nextIdx = findIndex(
      normalizedTexts,
      (e) => e.includes(normalizedCleanText),
      idx,
    );
    if (nextIdx > -1) {
      idx = nextIdx;
    }
    result[idx] += " " + cleanTextPart[i];
  }
  return result;
}
