
import { openDB, IDBPDatabase } from 'idb';
import { Tour } from '../types';

const DB_NAME = 'KuratourDB';
const STORE_NAME = 'tours';

export const initDB = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'tourTitle' });
      }
    },
  });
};

export const saveTourOffline = async (tour: Tour) => {
  const db = await initDB();
  await db.put(STORE_NAME, tour);
};

export const getSavedToursOffline = async (): Promise<Tour[]> => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const deleteTourOffline = async (tourTitle: string) => {
  const db = await initDB();
  await db.delete(STORE_NAME, tourTitle);
};
