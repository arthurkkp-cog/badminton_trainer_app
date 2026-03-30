import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Badge } from "./badge";
import { Card } from "./card";
import { MotionDemo } from "./motion-demo";
import { colors, spacing, typography } from "../constants/theme";
import { Exercise, FocusTag } from "../types/models";

interface ExerciseRowProps {
  exercise: Exercise;
  prescription: string;
  description: string;
  whyItMatters: string;
  coachingCue: string;
  checked: boolean;
  tags: FocusTag[];
  onToggle?: () => void;
}

export function ExerciseRow({
  exercise,
  prescription,
  description,
  whyItMatters,
  coachingCue,
  checked,
  tags,
  onToggle,
}: ExerciseRowProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text style={styles.name}>{exercise.name}</Text>
          <Text style={styles.prescription}>{prescription}</Text>
        </View>
        {onToggle ? (
          <Pressable onPress={onToggle} hitSlop={10} style={styles.checkbox}>
            <Ionicons
              name={checked ? "checkmark-circle" : "ellipse-outline"}
              size={26}
              color={checked ? colors.primary : colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.body}>{description}</Text>
      <MotionDemo imageUrl={exercise.imageUrl} videoUrl={exercise.videoUrl} style={styles.image} />
      <Text style={styles.meta}>Why it matters: {whyItMatters}</Text>
      <Text style={styles.meta}>Cue: {coachingCue}</Text>
      <Pressable onPress={() => Linking.openURL(exercise.videoUrl)} style={styles.linkButton}>
        <Ionicons name="play-circle" size={18} color={colors.primary} />
        <Text style={styles.links}>Open demo video</Text>
      </Pressable>
      <View style={styles.tags}>
        {tags.map((tag) => (
          <Badge key={`${exercise.id}-${tag}`} tag={tag} />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: "700",
  },
  prescription: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  body: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
  },
  meta: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  links: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  checkbox: {
    paddingTop: 2,
  },
});
