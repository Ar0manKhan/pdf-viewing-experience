import { openDB } from "idb";

export enum Stores {
  Docs = "Docs",
  Credentials = "credentials",
  CleanTextCache = "CleanTextCache",
}

const DB_NAME = "pdf-viewer";
const DB_VERSION = 3;

const initDB = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // in new version, if docs is not defined, then define them, otherwise,
      // do nothing for docs store
      if (!db.objectStoreNames.contains(Stores.Docs)) {
        const store = db.createObjectStore(Stores.Docs, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("name", "name", { unique: true });
        store.createIndex("hash", "hash", { unique: true });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
      if (!db.objectStoreNames.contains(Stores.Credentials)) {
        const store = db.createObjectStore(Stores.Credentials, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("provider", "provider", { unique: false });
      }
      if (!db.objectStoreNames.contains(Stores.CleanTextCache)) {
        const store = db.createObjectStore(Stores.CleanTextCache, {
          keyPath: "originalText",
        });
        store.createIndex("originalText", "originalText", { unique: true });
      }
    },
  });
};

const db = initDB();

export default db;
