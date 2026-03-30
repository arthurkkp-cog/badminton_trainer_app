import React from "react";
import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import { Card } from "../../src/components/card";
import { PrimaryButton } from "../../src/components/primary-button";
import { Screen } from "../../src/components/screen";
import { SectionTitle } from "../../src/components/section-title";
import { SegmentedControl } from "../../src/components/segmented-control";
import { colors, spacing, typography } from "../../src/constants/theme";
import { useAppStore } from "../../src/store/app-store";

export default function SettingsScreen() {
  const { settings, updateSettings, resetProgress } = useAppStore();

  const confirmReset = () => {
    Alert.alert("Reset progress?", "This clears tracker data, favorites, and active session state.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          resetProgress();
        },
      },
    ]);
  };

  return (
    <Screen>
      <SectionTitle
        eyebrow="Settings"
        title="Training defaults"
        subtitle="Keep the app lightweight now, with settings stored locally for fast Expo Go testing."
      />

      <Card style={styles.card}>
        <Text style={styles.label}>Workout length target</Text>
        <SegmentedControl
          value={settings.lengthTarget}
          onChange={(next) => updateSettings({ lengthTarget: next })}
          options={[
            { label: "30 min", value: 30 },
            { label: "45 min", value: 45 },
            { label: "60 min", value: 60 },
          ]}
        />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Training mode</Text>
        <SegmentedControl
          value={settings.mode}
          onChange={(next) => updateSettings({ mode: next })}
          options={[
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
          ]}
        />
      </Card>

      <Card style={styles.rowCard}>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={styles.label}>Timer cues</Text>
          <Text style={styles.help}>Controls haptic and sound-ready timer cues during workout mode.</Text>
        </View>
        <Switch
          value={settings.soundEnabled}
          onValueChange={(next) => updateSettings({ soundEnabled: next })}
          trackColor={{ true: "#1F7A46", false: "#24352B" }}
          thumbColor={settings.soundEnabled ? colors.primary : "#D2D7D4"}
        />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Reset app progress</Text>
        <Text style={styles.help}>
          Keeps the workout plan and exercise library, but clears completions, notes, streak, favorites, and any in-progress session.
        </Text>
        <PrimaryButton label="Reset Progress" secondary onPress={confirmReset} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: "700",
  },
  help: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});
