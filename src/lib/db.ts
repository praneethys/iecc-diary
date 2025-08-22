import { openDB } from "idb";

const DB_NAME = "iecc-diary";
const STORE_NAME = "sessions";

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export async function addSession(session: any) {
  const db = await getDB();
  await db.put(STORE_NAME, session);
}

export async function getSessions() {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

export async function updateSession(session: any) {
  const db = await getDB();
  await db.put(STORE_NAME, session);
}

export async function deleteSession(id: string) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
