import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "../../src/components/screen";
import { SectionTitle } from "../../src/components/section-title";
import { Card } from "../../src/components/card";
import { Badge } from "../../src/components/badge";
import { PrimaryButton } from "../../src/components/primary-button";
import { ExerciseRow } from "../../src/components/exercise-row";
import { colors, spacing, typography } from "../../src/constants/theme";
import { exerciseMap } from "../../src/data/exercises";
import { weeklyPlanMap } from "../../src/data/workouts";
import { useAppStore } from "../../src/store/app-store";
import { WorkoutSection } from "../../src/types/models";
import { estimateSessionMinutes, getWorkoutExercises } from "../../src/utils/workout";

const sectionLabels: Record<WorkoutSection, string> = {
  warmup: "Warm-up",
  main: "Main workout blocks",
  cooldown: "Cooldown",
};

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ dayId: string }>();
  const { settings, tracker } = useAppStore();
  const workoutDay = weeklyPlanMap[params.dayId];
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const workoutExercises = useMemo(
    () => getWorkoutExercises(workoutDay, settings.lengthTarget, settings.mode),
    [settings.lengthTarget, settings.mode, workoutDay]
  );

  const grouped = {
    warmup: workoutExercises.filter((exercise) => exercise.section === "warmup"),
    main: workoutExercises.filter((exercise) => exercise.section === "main"),
    cooldown: workoutExercises.filter((exercise) => exercise.section === "cooldown"),
  };

  const trackerEntry = tracker.entries[workoutDay.id];

  return (
    <Screen>
      <SectionTitle
        eyebrow={workoutDay.weekday}
        title={workoutDay.title}
        subtitle={`${workoutDay.purpose} This session targets about ${estimateSessionMinutes(
          workoutDay,
          settings.lengthTarget
        )} minutes in ${settings.mode} mode.`}
      />

      <Card style={styles.summaryCard}>
        <View style={styles.badges}>
          {workoutDay.focusTags.map((tag) => (
            <Badge key={tag} tag={tag} />
          ))}
        </View>
        <Text style={styles.summaryLine}>Duration range: {workoutDay.durationRange}</Text>
        <Text style={styles.summaryLine}>Effort: {workoutDay.effortLevel}</Text>
        <Text style={styles.summaryLine}>Coaching cue: {workoutDay.coachingCue}</Text>
        {trackerEntry?.completed ? (
          <Text style={styles.summaryNote}>
            Completed this week • energy {trackerEntry.energyRating ?? "-"} / 5 • effort{" "}
            {trackerEntry.effortRating ?? "-"} / 10
          </Text>
        ) : null}
      </Card>

      {(["warmup", "main", "cooldown"] as WorkoutSection[]).map((section) => (
        <View key={section} style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>{sectionLabels[section]}</Text>
          {grouped[section].map((workoutExercise) => {
            const exercise = exerciseMap[workoutExercise.exerciseId];
            return (
              <ExerciseRow
                key={workoutExercise.id}
                exercise={exercise}
                prescription={`${workoutExercise.sets} sets • ${workoutExercise.repsOrTime}${
                  workoutExercise.restSeconds ? ` • ${workoutExercise.restSeconds}s rest` : ""
                }`}
                description={workoutExercise.description}
                whyItMatters={workoutExercise.whyItMatters}
                coachingCue={workoutExercise.coachingCue}
                checked={checkedIds.includes(workoutExercise.id)}
                tags={workoutExercise.tags}
                onToggle={() =>
                  setCheckedIds((current) =>
                    current.includes(workoutExercise.id)
                      ? current.filter((id) => id !== workoutExercise.id)
                      : [...current, workoutExercise.id]
                  )
                }
              />
            );
          })}
        </View>
      ))}

      <PrimaryButton label="Start workout mode" onPress={() => router.push(`/session/${workoutDay.id}`)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    gap: spacing.sm,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  summaryLine: {
    color: colors.text,
    fontSize: typography.body,
  },
  summaryNote: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  sectionBlock: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: "700",
  },
});
