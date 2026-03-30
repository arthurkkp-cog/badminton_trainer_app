import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Card } from "../../src/components/card";
import { MotionDemo } from "../../src/components/motion-demo";
import { PrimaryButton } from "../../src/components/primary-button";
import { Screen } from "../../src/components/screen";
import { SectionTitle } from "../../src/components/section-title";
import { colors, radii, spacing, typography } from "../../src/constants/theme";
import { exerciseMap } from "../../src/data/exercises";
import { weeklyPlanMap } from "../../src/data/workouts";
import { useAppStore } from "../../src/store/app-store";
import { SessionQueueItem } from "../../src/types/models";
import { buildSessionQueue, estimateSessionMinutes } from "../../src/utils/workout";

function formatSeconds(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(safe % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function SessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ dayId: string }>();
  const { settings } = useAppStore();
  const workoutDay = weeklyPlanMap[params.dayId];
  const defaultQueue = useMemo(
    () => buildSessionQueue(workoutDay, settings.lengthTarget, settings.mode),
    [settings.lengthTarget, settings.mode, workoutDay]
  );

  const [queue, setQueue] = useState<SessionQueueItem[]>(defaultQueue);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(defaultQueue[0]?.durationSeconds ?? null);
  const [isRunning, setIsRunning] = useState(true);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    setQueue(defaultQueue);
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setCompletedIds([]);
    setSecondsLeft(defaultQueue[0]?.durationSeconds ?? null);
    initializedRef.current = true;
  }, [defaultQueue]);

  const currentItem = queue[currentIndex];
  const nextItem = queue[currentIndex + 1];
  const currentExercise = currentItem ? exerciseMap[currentItem.exerciseId] : undefined;
  const nextExercise = nextItem ? exerciseMap[nextItem.exerciseId] : undefined;

  useEffect(() => {
    if (!isRunning || !currentItem) {
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((value) => value + 1);

      if (currentItem.isTimed) {
        setSecondsLeft((value) => {
          if (value === null) {
            return currentItem.durationSeconds ?? null;
          }
          if (value <= 1) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            advance();
            return currentItem.durationSeconds ?? null;
          }
          return value - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentItem, isRunning]);

  const advance = () => {
    setCompletedIds((current) =>
      currentItem && !current.includes(currentItem.workoutExerciseId)
        ? [...current, currentItem.workoutExerciseId]
        : current
    );

    if (currentIndex >= queue.length - 1) {
      setIsRunning(false);
      router.replace({
        pathname: "/session/complete",
        params: {
          dayId: workoutDay.id,
          durationMinutes: String(Math.max(1, Math.round(elapsedSeconds / 60))),
        },
      });
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setSecondsLeft(queue[nextIndex]?.durationSeconds ?? null);
  };

  const skip = () => {
    Haptics.selectionAsync();
    advance();
  };

  const togglePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRunning((value) => !value);
  };

  if (!currentItem) {
    return (
      <Screen>
        <SectionTitle title="Session unavailable" subtitle="No queue was generated for this workout." />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionTitle
        eyebrow={workoutDay.weekday}
        title="Workout mode"
        subtitle={`${workoutDay.title} • ${estimateSessionMinutes(
          workoutDay,
          settings.lengthTarget
        )} min target`}
      />

      <Card style={styles.timerCard}>
        <Text style={styles.stepLabel}>
          Exercise {currentIndex + 1} of {queue.length}
        </Text>
        <Text style={styles.exerciseName}>{currentItem.name}</Text>
        {currentExercise ? (
          <View style={styles.movementWrapper}>
            <Text style={styles.movementTitle}>Movement demo</Text>
            <MotionDemo
              imageUrl={currentExercise.imageUrl}
              videoUrl={currentExercise.videoUrl}
              style={styles.movementImage}
            />
            <Text style={styles.movementHint}>Auto-looping form preview</Text>
          </View>
        ) : null}
        <View style={styles.timerCircle}>
          <Text style={styles.timerValue}>
            {currentItem.isTimed ? formatSeconds(secondsLeft ?? currentItem.durationSeconds ?? 0) : currentItem.repsOrTime}
          </Text>
          <Text style={styles.timerMeta}>{currentItem.isTimed ? "countdown" : `${currentItem.sets} sets`}</Text>
        </View>
        <Text style={styles.detailText}>{currentItem.description}</Text>
        <Text style={styles.detailText}>Why it matters: {currentItem.whyItMatters}</Text>
        <Text style={styles.detailText}>Cue: {currentItem.coachingCue}</Text>
      </Card>

      <Card style={styles.queueCard}>
        <Text style={styles.queueTitle}>Next up</Text>
        {nextExercise ? (
          <MotionDemo
            imageUrl={nextExercise.imageUrl}
            videoUrl={nextExercise.videoUrl}
            style={styles.nextImage}
          />
        ) : null}
        <Text style={styles.queueName}>{nextItem ? nextItem.name : "Completion screen"}</Text>
        <Text style={styles.queueMeta}>
          {nextItem ? `${nextItem.sets} sets • ${nextItem.repsOrTime}` : "Log energy, effort, and notes."}
        </Text>
        <Text style={styles.queueMeta}>Elapsed: {formatSeconds(elapsedSeconds)}</Text>
      </Card>

      <View style={styles.controls}>
        <PrimaryButton label={isRunning ? "Pause" : "Resume"} secondary onPress={togglePause} />
        <PrimaryButton label={currentItem.isTimed ? "Skip" : "Complete exercise"} onPress={skip} />
      </View>

      {currentItem.restSeconds ? (
        <Card>
          <Text style={styles.queueTitle}>Suggested rest</Text>
          <Text style={styles.queueMeta}>{currentItem.restSeconds} seconds between sets.</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  timerCard: {
    alignItems: "center",
    gap: spacing.md,
  },
  stepLabel: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  exerciseName: {
    color: colors.text,
    fontSize: typography.h1,
    fontWeight: "800",
    textAlign: "center",
  },
  movementWrapper: {
    width: "100%",
    gap: spacing.sm,
  },
  movementTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
    textAlign: "left",
    width: "100%",
  },
  movementImage: {
    width: "100%",
    height: 170,
    borderRadius: radii.md,
    backgroundColor: colors.backgroundAlt,
  },
  movementHint: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 10,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundAlt,
    padding: spacing.lg,
  },
  timerValue: {
    color: colors.text,
    fontSize: 42,
    fontWeight: "800",
    textAlign: "center",
  },
  timerMeta: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  detailText: {
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  queueCard: {
    gap: spacing.sm,
  },
  queueTitle: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: "700",
  },
  queueName: {
    color: colors.primary,
    fontSize: typography.h2,
    fontWeight: "700",
  },
  queueMeta: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  nextImage: {
    width: "100%",
    height: 120,
    borderRadius: radii.md,
    backgroundColor: colors.backgroundAlt,
    marginBottom: spacing.xs,
  },
  controls: {
    gap: spacing.md,
  },
});
