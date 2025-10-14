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
  lastAccessed?: string;
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

/**
 * Sorts documents by lastAccessed date in decreasing order (newest first).
 * Documents without lastAccessed date are placed at the end.
 */
function sortDocsByLastAccessed(docs: Doc[]): Doc[] {
  return docs.sort((a, b) => {
    // If both have lastAccessed dates, sort by date (newest first)
    if (a.lastAccessed && b.lastAccessed) {
      return (
        new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
      );
    }

    // If only a has lastAccessed, it comes first
    if (a.lastAccessed && !b.lastAccessed) {
      return -1;
    }

    // If only b has lastAccessed, it comes first
    if (!a.lastAccessed && b.lastAccessed) {
      return 1;
    }

    // If neither has lastAccessed, maintain original order
    return 0;
  });
}

async function deleteDoc(id: string) {
  const tx = (await db).transaction(Stores.Docs, "readwrite");
  const store = tx.objectStore(Stores.Docs);
  await store.delete(id);
  await tx.done;
}

export {
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  bulkSetDocs,
  sortDocsByLastAccessed,
};
