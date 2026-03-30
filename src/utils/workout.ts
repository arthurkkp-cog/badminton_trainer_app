import { exerciseMap } from "../data/exercises";
import {
  SessionQueueItem,
  TrainingMode,
  WorkoutDay,
  WorkoutExercise,
  WorkoutLength,
} from "../types/models";

const parseDurationSeconds = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (normalized.includes("min")) {
    return Number.parseInt(normalized, 10) * 60;
  }
  if (normalized.includes("sec")) {
    return Number.parseInt(normalized, 10);
  }
  return undefined;
};

const resolvePrescription = (exercise: WorkoutExercise, mode: TrainingMode) => {
  const override = exercise[mode];
  return {
    sets: override?.sets ?? exercise.sets,
    repsOrTime: override?.repsOrTime ?? exercise.repsOrTime,
    restSeconds: override?.restSeconds ?? exercise.restSeconds,
  };
};

export const getWorkoutExercises = (
  workoutDay: WorkoutDay,
  lengthTarget: WorkoutLength,
  mode: TrainingMode
) =>
  workoutDay.exercises
    .filter((exercise) => exercise.includeInLengths.includes(lengthTarget))
    .sort((a, b) => a.order - b.order)
    .map((exercise) => {
      const prescription = resolvePrescription(exercise, mode);
      return {
        ...exercise,
        ...prescription,
      };
    });

export const estimateSessionMinutes = (workoutDay: WorkoutDay, lengthTarget: WorkoutLength) =>
  workoutDay.durationTargets[lengthTarget];

export const buildSessionQueue = (
  workoutDay: WorkoutDay,
  lengthTarget: WorkoutLength,
  mode: TrainingMode
): SessionQueueItem[] =>
  getWorkoutExercises(workoutDay, lengthTarget, mode).map((workoutExercise) => {
    const exercise = exerciseMap[workoutExercise.exerciseId];
    const durationSeconds = workoutExercise.isTimed
      ? parseDurationSeconds(workoutExercise.repsOrTime)
      : undefined;

    return {
      queueId: `${workoutExercise.id}-${lengthTarget}-${mode}`,
      workoutExerciseId: workoutExercise.id,
      exerciseId: workoutExercise.exerciseId,
      name: exercise.name,
      section: workoutExercise.section,
      sets: workoutExercise.sets,
      repsOrTime: workoutExercise.repsOrTime,
      restSeconds: workoutExercise.restSeconds,
      isTimed: Boolean(workoutExercise.isTimed),
      durationSeconds,
      description: workoutExercise.description,
      whyItMatters: workoutExercise.whyItMatters,
      coachingCue: workoutExercise.coachingCue,
      tags: workoutExercise.tags,
    };
  });
