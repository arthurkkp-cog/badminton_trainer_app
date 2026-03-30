import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Badge } from "./badge";
import { Card } from "./card";
import { colors, radii, spacing, typography } from "../constants/theme";
import { WorkoutDay } from "../types/models";

interface DayCardProps {
  day: WorkoutDay;
  completed: boolean;
  estimatedMinutes: number;
  imageUrl?: string;
  onPress: () => void;
}

export function DayCard({ day, completed, estimatedMinutes, imageUrl, onPress }: DayCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" /> : null}
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.weekday}>{day.weekday}</Text>
            <Text style={styles.title}>{day.title}</Text>
          </View>
          <View style={[styles.statusPill, completed && styles.statusComplete]}>
            <Text style={styles.statusText}>{completed ? "Done" : `${estimatedMinutes} min`}</Text>
          </View>
        </View>
        <Text style={styles.purpose}>{day.purpose}</Text>
        <View style={styles.badges}>
          {day.focusTags.map((tag) => (
            <Badge key={`${day.id}-${tag}`} tag={tag} />
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.detail}>Effort {day.effortLevel}</Text>
          <Text style={styles.detail}>Cue: {day.coachingCue}</Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  image: {
    width: "100%",
    height: 132,
    borderRadius: radii.md,
    backgroundColor: colors.backgroundAlt,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  weekday: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: "700",
  },
  statusPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.backgroundAlt,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusComplete: {
    backgroundColor: "#173523",
  },
  statusText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  purpose: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  footer: {
    gap: 6,
  },
  detail: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "500",
  },
});
