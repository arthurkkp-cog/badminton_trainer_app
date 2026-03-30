import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { weeklyPlan } from "../data/workouts";
import {
  SessionHistoryEntry,
  SessionSnapshot,
  UserSettings,
  WeekTracker,
  WeeklyTrackerEntry,
} from "../types/models";
import { calculateStreak, getTodayDayId, getWeekStart } from "../utils/date";
import { estimateSessionMinutes } from "../utils/workout";
import { storage } from "./storage";

const defaultSettings: UserSettings = {
  lengthTarget: 45,
  mode: "beginner",
  soundEnabled: true,
};

const buildEmptyTracker = (weekStart: string): WeekTracker => ({
  weekStart,
  entries: Object.fromEntries(
    weeklyPlan.map((day) => [
      day.id,
      {
        dayId: day.id,
        completed: false,
      } satisfies WeeklyTrackerEntry,
    ])
  ),
});

type CompletionPayload = {
  dayId: string;
  energyRating?: number;
  effortRating?: number;
  notes?: string;
};

interface AppStoreValue {
  isReady: boolean;
  settings: UserSettings;
  tracker: WeekTracker;
  history: SessionHistoryEntry[];
  favorites: string[];
  sessionSnapshot: SessionSnapshot | null;
  streakCount: number;
  todayDayId: string;
  updateSettings: (patch: Partial<UserSettings>) => Promise<void>;
  toggleFavorite: (exerciseId: string) => Promise<void>;
  completeSession: (payload: CompletionPayload) => Promise<void>;
  setSessionSnapshot: (snapshot: SessionSnapshot | null) => Promise<void>;
  resetProgress: () => Promise<void>;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: React.PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [tracker, setTracker] = useState<WeekTracker>(buildEmptyTracker(getWeekStart()));
  const [history, setHistory] = useState<SessionHistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sessionSnapshot, setSnapshot] = useState<SessionSnapshot | null>(null);

  useEffect(() => {
    const load = async () => {
      const currentWeekStart = getWeekStart();
      const [storedSettings, storedTracker, storedHistory, storedFavorites] =
        await Promise.all([
          storage.getSettings(defaultSettings),
          storage.getTracker(),
          storage.getHistory(),
          storage.getFavorites(),
        ]);

      setSettings(storedSettings);
      setTracker(
        storedTracker && storedTracker.weekStart === currentWeekStart
          ? storedTracker
          : buildEmptyTracker(currentWeekStart)
      );
      setHistory(storedHistory);
      setFavorites(storedFavorites);
      setSnapshot(null);
      await storage.setSessionSnapshot(null);
      setIsReady(true);
    };

    load();
  }, []);

  const persistTracker = useCallback(async (nextTracker: WeekTracker) => {
    setTracker(nextTracker);
    await storage.setTracker(nextTracker);
  }, []);

  const updateSettings = useCallback(async (patch: Partial<UserSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    await storage.setSettings(next);
  }, [settings]);

  const toggleFavorite = useCallback(async (exerciseId: string) => {
    const next = favorites.includes(exerciseId)
      ? favorites.filter((id) => id !== exerciseId)
      : [...favorites, exerciseId];
    setFavorites(next);
    await storage.setFavorites(next);
  }, [favorites]);

  const completeSession = useCallback(async ({ dayId, energyRating, effortRating, notes }: CompletionPayload) => {
    const completedAt = new Date().toISOString();
    const currentWeekStart = getWeekStart();
    const baseTracker =
      tracker.weekStart === currentWeekStart ? tracker : buildEmptyTracker(currentWeekStart);
    const nextTracker: WeekTracker = {
      weekStart: currentWeekStart,
      entries: {
        ...baseTracker.entries,
        [dayId]: {
          dayId,
          completed: true,
          completedAt,
          energyRating,
          effortRating,
          notes,
        },
      },
    };

    const workoutDay = weeklyPlan.find((day) => day.id === dayId);
    const nextHistory = [
      {
        dayId,
        completedAt,
        durationMinutes: workoutDay ? estimateSessionMinutes(workoutDay, settings.lengthTarget) : 0,
        energyRating,
        effortRating,
      },
      ...history,
    ];

    await Promise.all([
      persistTracker(nextTracker),
      storage.setHistory(nextHistory),
      storage.setSessionSnapshot(null),
    ]);

    setHistory(nextHistory);
    setSnapshot(null);
  }, [history, persistTracker, settings.lengthTarget, tracker]);

  const setSessionSnapshot = useCallback(async (nextSnapshot: SessionSnapshot | null) => {
    setSnapshot(nextSnapshot);
    await storage.setSessionSnapshot(nextSnapshot);
  }, []);

  const resetProgress = useCallback(async () => {
    const freshTracker = buildEmptyTracker(getWeekStart());
    await storage.resetProgress();
    setTracker(freshTracker);
    setHistory([]);
    setFavorites([]);
    setSnapshot(null);
  }, []);

  const value = useMemo<AppStoreValue>(
    () => ({
      isReady,
      settings,
      tracker,
      history,
      favorites,
      sessionSnapshot,
      streakCount: calculateStreak(history.map((entry) => entry.completedAt)),
      todayDayId: getTodayDayId(),
      updateSettings,
      toggleFavorite,
      completeSession,
      setSessionSnapshot,
      resetProgress,
    }),
    [
      completeSession,
      favorites,
      history,
      isReady,
      resetProgress,
      sessionSnapshot,
      setSessionSnapshot,
      settings,
      toggleFavorite,
      tracker,
      updateSettings,
    ]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return context;
}
