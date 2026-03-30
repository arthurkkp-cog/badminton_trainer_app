export type WorkoutLength = 30 | 45 | 60;
export type TrainingMode = "beginner" | "intermediate";
export type FocusTag =
  | "Footwork"
  | "Power"
  | "Endurance"
  | "Mobility"
  | "Recovery"
  | "Strength"
  | "Speed"
  | "Balance"
  | "Skills"
  | "Core";

export type WorkoutSection = "warmup" | "main" | "cooldown";

export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  badmintonBenefit: string;
  defaultSets: string;
  defaultRepsOrTime: string;
  equipment: string;
  videoUrl: string;
  imageUrl: string;
}

export interface ScaledPrescription {
  sets?: string;
  repsOrTime?: string;
  restSeconds?: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  section: WorkoutSection;
  order: number;
  title?: string;
  description: string;
  whyItMatters: string;
  sets: string;
  repsOrTime: string;
  restSeconds?: number;
  isTimed?: boolean;
  includeInLengths: WorkoutLength[];
  tags: FocusTag[];
  coachingCue: string;
  beginner?: ScaledPrescription;
  intermediate?: ScaledPrescription;
}

export interface WorkoutDay {
  id: string;
  weekday:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  title: string;
  durationRange: string;
  purpose: string;
  effortLevel: string;
  coachingCue: string;
  focusTags: FocusTag[];
  durationTargets: Record<WorkoutLength, number>;
  exercises: WorkoutExercise[];
}

export interface UserSettings {
  lengthTarget: WorkoutLength;
  mode: TrainingMode;
  soundEnabled: boolean;
}

export interface WeeklyTrackerEntry {
  dayId: string;
  completed: boolean;
  completedAt?: string;
  energyRating?: number;
  effortRating?: number;
  notes?: string;
}

export interface WeekTracker {
  weekStart: string;
  entries: Record<string, WeeklyTrackerEntry>;
}

export interface SessionHistoryEntry {
  dayId: string;
  completedAt: string;
  durationMinutes: number;
  energyRating?: number;
  effortRating?: number;
}

export interface SessionSnapshot {
  dayId: string;
  queue: SessionQueueItem[];
  currentIndex: number;
  elapsedSeconds: number;
  completedExerciseIds: string[];
  startedAt: string;
}

export interface SessionQueueItem {
  queueId: string;
  workoutExerciseId: string;
  exerciseId: string;
  name: string;
  section: WorkoutSection;
  sets: string;
  repsOrTime: string;
  restSeconds?: number;
  isTimed: boolean;
  durationSeconds?: number;
  description: string;
  whyItMatters: string;
  coachingCue: string;
  tags: FocusTag[];
}
