import db from "./initDb";
import { Stores } from "./initDb";

export async function getCleanText(originalText: string) {
  const tx = (await db).transaction(Stores.CleanTextCache, "readonly");
  const store = tx.objectStore(Stores.CleanTextCache);
  const result = await store.get(originalText);
  await tx.done;
  return result?.cleanText;
}

export async function setCleanText(originalText: string, cleanText: string) {
  const tx = (await db).transaction(Stores.CleanTextCache, "readwrite");
  const store = tx.objectStore(Stores.CleanTextCache);
  await store.put({ originalText, cleanText });
  await tx.done;
}
