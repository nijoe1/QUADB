import { IDBPDatabase, openDB } from "idb";

export const setupDB = async (dbName: string, storeName: string) => {
  try {
    const db = await openDB(dbName, 2, {
      upgrade(db, oldVersion) {
        // Always ensure the object store exists
        if (!db.objectStoreNames.contains(storeName)) {
          console.log(`Creating object store: ${storeName}`);
          db.createObjectStore(storeName);
        }
      },
    });
    return db;
  } catch (error) {
    console.error("Error setting up IndexedDB:", error);
    throw error;
  }
};

export const deleteDB = async (dbName: string, storeName: string) => {
  try {
    await openDB(dbName, 2, {
      upgrade(db) {
        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName);
        }
      },
    });
  } catch (error) {
    console.error("Error deleting IndexedDB:", error);
  }
};

export const getDB = async (dbName: string): Promise<IDBPDatabase<unknown>> => {
  try {
    const db = await openDB(dbName, 2);
    return db;
  } catch (error) {
    console.error("Error getting IndexedDB:", error);
    throw error;
  }
};

export const getStore = async (db: IDBPDatabase<unknown>, storeName: string) => {
  return db.transaction(storeName, "readwrite").objectStore(storeName);
};

export const put = async (
  db: IDBPDatabase<unknown>,
  storeName: string,
  key: string,
  value: any,
) => {
  return db.transaction(storeName, "readwrite").objectStore(storeName).put(value, key);
};

export const get = async (db: IDBPDatabase<unknown>, storeName: string, key: string) => {
  return db.transaction(storeName, "readonly").objectStore(storeName).get(key);
};

export const deleteItem = async (db: IDBPDatabase<unknown>, storeName: string, key: string) => {
  return db.transaction(storeName, "readwrite").objectStore(storeName).delete(key);
};
