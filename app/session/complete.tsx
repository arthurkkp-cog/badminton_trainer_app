import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card } from "../../src/components/card";
import { PrimaryButton } from "../../src/components/primary-button";
import { RatingSelector } from "../../src/components/rating-selector";
import { Screen } from "../../src/components/screen";
import { SectionTitle } from "../../src/components/section-title";
import { colors, spacing, typography } from "../../src/constants/theme";
import { useAppStore } from "../../src/store/app-store";

export default function SessionCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ dayId: string; durationMinutes?: string }>();
  const { completeSession } = useAppStore();
  const [energyRating, setEnergyRating] = useState<number | undefined>();
  const [effortRating, setEffortRating] = useState<number | undefined>();
  const [notes, setNotes] = useState("");

  const finish = async () => {
    await completeSession({
      dayId: params.dayId,
      energyRating,
      effortRating,
      notes: notes.trim() || undefined,
    });
    router.replace("/(tabs)");
  };

  return (
    <Screen>
      <SectionTitle
        eyebrow="Session complete"
        title="Log the session"
        subtitle={`Finished in about ${params.durationMinutes ?? "--"} minutes. Capture how the work felt while it is fresh.`}
      />

      <Card style={styles.card}>
        <Text style={styles.label}>Energy today (1–5)</Text>
        <RatingSelector max={5} value={energyRating} onChange={setEnergyRating} />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Effort today (1–10)</Text>
        <RatingSelector max={10} value={effortRating} onChange={setEffortRating} />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="What felt sharp? What felt heavy?"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </Card>

      <View style={styles.actions}>
        <PrimaryButton label="Save session" onPress={finish} />
        <PrimaryButton label="Skip notes" secondary onPress={finish} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: "700",
  },
  input: {
    minHeight: 120,
    borderRadius: 18,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    padding: spacing.md,
    textAlignVertical: "top",
  },
  actions: {
    gap: spacing.md,
  },
});
