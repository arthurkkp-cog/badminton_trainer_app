import React from "react";
import { useRouter } from "expo-router";
import { Screen } from "../../src/components/screen";
import { SectionTitle } from "../../src/components/section-title";
import { exerciseMap } from "../../src/data/exercises";
import { weeklyPlan } from "../../src/data/workouts";
import { useAppStore } from "../../src/store/app-store";
import { DayCard } from "../../src/components/day-card";
import { estimateSessionMinutes, getWorkoutExercises } from "../../src/utils/workout";

export default function WeeklyPlanScreen() {
  const router = useRouter();
  const { tracker, settings } = useAppStore();

  return (
    <Screen>
      <SectionTitle
        eyebrow="7-day plan"
        title="Weekly training map"
        subtitle="Each day keeps one clear quality in focus while staying realistic for a normal user."
      />
      {weeklyPlan.map((day) => {
        const previewExercise = getWorkoutExercises(day, settings.lengthTarget, settings.mode)[0];
        const previewImage = previewExercise
          ? exerciseMap[previewExercise.exerciseId]?.imageUrl
          : undefined;
        return (
        <DayCard
          key={day.id}
          day={day}
          completed={tracker.entries[day.id]?.completed ?? false}
          estimatedMinutes={estimateSessionMinutes(day, settings.lengthTarget)}
          imageUrl={previewImage}
          onPress={() => router.push(`/workout/${day.id}`)}
        />
        );
      })}
    </Screen>
  );
}
