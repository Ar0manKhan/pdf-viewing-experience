import { openDB } from "idb";

export enum Stores {
  Docs = "Docs",
}

const DB_NAME = "pdf-viewer";
const DB_VERSION = 1;

const initDB = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // leaving old and new version aside for now.
      if (db.objectStoreNames.contains(Stores.Docs)) {
        return;
      }
      const store = db.createObjectStore(Stores.Docs, {
        keyPath: "id",
        autoIncrement: true,
      });
      store.createIndex("name", "name", { unique: true });
      store.createIndex("hash", "createdAt", { unique: true });
      store.createIndex("createdAt", "createdAt", { unique: false });
    },
  });
};

const db = initDB();

export default db;
