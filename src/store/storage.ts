import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SessionHistoryEntry,
  SessionSnapshot,
  UserSettings,
  WeekTracker,
} from "../types/models";

const STORAGE_KEYS = {
  settings: "bdt/settings",
  tracker: "bdt/tracker",
  history: "bdt/history",
  favorites: "bdt/favorites",
  sessionSnapshot: "bdt/sessionSnapshot",
} as const;

async function getItem<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function setItem<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  keys: STORAGE_KEYS,
  getSettings: (fallback: UserSettings) => getItem(STORAGE_KEYS.settings, fallback),
  setSettings: (value: UserSettings) => setItem(STORAGE_KEYS.settings, value),
  getTracker: (fallback: WeekTracker | null = null) => getItem(STORAGE_KEYS.tracker, fallback),
  setTracker: (value: WeekTracker) => setItem(STORAGE_KEYS.tracker, value),
  getHistory: (fallback: SessionHistoryEntry[] = []) => getItem(STORAGE_KEYS.history, fallback),
  setHistory: (value: SessionHistoryEntry[]) => setItem(STORAGE_KEYS.history, value),
  getFavorites: (fallback: string[] = []) => getItem(STORAGE_KEYS.favorites, fallback),
  setFavorites: (value: string[]) => setItem(STORAGE_KEYS.favorites, value),
  getSessionSnapshot: (fallback: SessionSnapshot | null = null) =>
    getItem(STORAGE_KEYS.sessionSnapshot, fallback),
  setSessionSnapshot: (value: SessionSnapshot | null) =>
    value
      ? setItem(STORAGE_KEYS.sessionSnapshot, value)
      : AsyncStorage.removeItem(STORAGE_KEYS.sessionSnapshot),
  resetProgress: async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.tracker,
      STORAGE_KEYS.history,
      STORAGE_KEYS.favorites,
      STORAGE_KEYS.sessionSnapshot,
    ]);
  },
};
