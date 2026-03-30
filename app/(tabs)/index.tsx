import React, { useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "../../src/components/card";
import { Badge } from "../../src/components/badge";
import { PrimaryButton } from "../../src/components/primary-button";
import { ProgressBar } from "../../src/components/progress-bar";
import { ProgressRing } from "../../src/components/progress-ring";
import { Screen } from "../../src/components/screen";
import { SectionTitle } from "../../src/components/section-title";
import { colors, radii, spacing, typography } from "../../src/constants/theme";
import { exerciseMap } from "../../src/data/exercises";
import { weeklyPlanMap } from "../../src/data/workouts";
import { useAppStore } from "../../src/store/app-store";
import { estimateSessionMinutes, getWorkoutExercises } from "../../src/utils/workout";

export default function HomeScreen() {
  const router = useRouter();
  const { todayDayId, tracker, settings, streakCount, sessionSnapshot, favorites } = useAppStore();

  const todayWorkout = weeklyPlanMap[todayDayId];
  const completedCount = Object.values(tracker.entries).filter((entry) => entry.completed).length;
  const weeklyProgress = completedCount / 7;
  const todayExercises = getWorkoutExercises(todayWorkout, settings.lengthTarget, settings.mode);
  const favoriteExercises = useMemo(
    () => favorites.map((id) => exerciseMap[id]).filter(Boolean).slice(0, 3),
    [favorites]
  );

  return (
    <Screen>
      <SectionTitle
        eyebrow="Badminton Daily Trainer"
        title="Today’s work"
        subtitle="Structured badminton fitness for clean movement, strong lungs, and disciplined reps."
      />

      <LinearGradient colors={["#183525", "#0E1713"]} style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={{ flex: 1, gap: spacing.sm }}>
            <Text style={styles.heroEyebrow}>{todayWorkout.weekday}</Text>
            <Text style={styles.heroTitle}>{todayWorkout.title}</Text>
            <Text style={styles.heroBody}>{todayWorkout.purpose}</Text>
          </View>
          <ProgressRing
            progress={weeklyProgress}
            label={`${completedCount}/7`}
            sublabel="week"
            size={92}
          />
        </View>

        <View style={styles.badges}>
          {todayWorkout.focusTags.map((tag) => (
            <Badge key={tag} tag={tag} />
          ))}
        </View>

        <View style={styles.statRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{estimateSessionMinutes(todayWorkout, settings.lengthTarget)} min</Text>
            <Text style={styles.statLabel}>Session target</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{streakCount}</Text>
            <Text style={styles.statLabel}>Day streak</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{todayWorkout.focusTags[0]}</Text>
            <Text style={styles.statLabel}>Focus</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <PrimaryButton
            label={sessionSnapshot?.dayId === todayDayId ? "Resume Workout" : "Start Workout"}
            onPress={() => router.push(`/session/${todayDayId}`)}
          />
          <PrimaryButton
            label="View Plan"
            secondary
            onPress={() => router.push(`/workout/${todayDayId}`)}
          />
        </View>
      </LinearGradient>

      <Card>
        <Text style={styles.cardTitle}>Today widget</Text>
        {todayExercises[0] ? (
          <Image
            source={{ uri: exerciseMap[todayExercises[0].exerciseId]?.imageUrl }}
            style={styles.todayImage}
            resizeMode="cover"
          />
        ) : null}
        <Text style={styles.cardBody}>
          {todayExercises.length} exercises • {todayWorkout.effortLevel} • Cue: {todayWorkout.coachingCue}
        </Text>
        <ProgressBar progress={weeklyProgress} />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Weekly progress</Text>
        <Text style={styles.cardBody}>Completed {completedCount} of 7 planned training days.</Text>
        <View style={styles.progressList}>
          {Object.values(tracker.entries).map((entry) => (
            <View key={entry.dayId} style={styles.progressPill}>
              <Text style={styles.progressPillText}>
                {entry.dayId.slice(0, 3).toUpperCase()} {entry.completed ? "✓" : "•"}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Favorite exercises</Text>
        {favoriteExercises.length > 0 ? (
          <View style={styles.favoriteList}>
            {favoriteExercises.map((exercise) => (
              <View key={exercise.id} style={styles.favoriteItem}>
                <Text style={styles.favoriteName}>{exercise.name}</Text>
                <Text style={styles.favoriteMeta}>{exercise.category}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.cardBody}>
            Star exercises in the Library to pin them here for faster reuse.
          </Text>
        )}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Tracker note</Text>
        <Text style={styles.cardBody}>
          {tracker.entries[todayDayId]?.notes
            ? tracker.entries[todayDayId]?.notes
            : "Finish a session today to log energy, effort, and notes."}
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  heroTop: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  heroEyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  heroTitle: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: "800",
  },
  heroBody: {
    color: colors.textMuted,
    lineHeight: 21,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  statRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  statBlock: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: radii.md,
    padding: spacing.md,
    gap: 4,
  },
  statValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  buttonRow: {
    gap: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  cardBody: {
    color: colors.textMuted,
    lineHeight: 21,
  },
  todayImage: {
    width: "100%",
    height: 172,
    borderRadius: radii.md,
    backgroundColor: colors.backgroundAlt,
    marginBottom: spacing.sm,
  },
  progressList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  progressPill: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  progressPillText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  favoriteList: {
    gap: spacing.sm,
  },
  favoriteItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  favoriteName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  favoriteMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
});
