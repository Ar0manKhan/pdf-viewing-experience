import findIndex from "lodash-es/findIndex";
import { getPromptToClean } from "./getPromptToClean";
import { getCleanText, setCleanText } from "../indexedDb/cleanTextCacheStore";
import { generateAIResponse } from "./ai-service";

async function textRemoveNoise(text: string) {
  if (!text.trim().length) return text;

  const result = await generateAIResponse(getPromptToClean(text));
  return result ?? text;
}

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
  const cleanText = await textRemoveNoiseCached(text);
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
