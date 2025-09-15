import db, { Stores } from "./initDb";

export interface Doc {
  id: string;
  name: string;
  type: string;
  data: Blob;
  size: number;
  hash: string;
  lastPlayed:
    | {
        page: number;
        part: number;
      }
    | null
    | undefined;
  createdAt: number;
}

async function setDoc(doc: Doc) {
  const tx = (await db).transaction(Stores.Docs, "readwrite");
  const store = tx.objectStore(Stores.Docs);
  await store.put(doc);
  await tx.done;
  return;
}

async function bulkSetDocs(docs: Doc[]) {
  const tx = (await db).transaction(Stores.Docs, "readwrite");
  const store = tx.objectStore(Stores.Docs);
  return Promise.all(docs.map((doc) => store.put(doc)));
}

async function getDoc(id: string) {
  const tx = (await db).transaction(Stores.Docs, "readonly");
  const store = tx.objectStore(Stores.Docs);
  return (await store.get(id)) as Doc | undefined;
}

async function getDocs() {
  const tx = (await db).transaction(Stores.Docs, "readonly");
  const store = tx.objectStore(Stores.Docs);
  return (await store.getAll()) as Doc[];
}

async function deleteDoc(id: string) {
  const tx = (await db).transaction(Stores.Docs, "readwrite");
  const store = tx.objectStore(Stores.Docs);
  await store.delete(id);
  await tx.done;
}

export { setDoc, getDoc, getDocs, deleteDoc, bulkSetDocs };
