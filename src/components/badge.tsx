import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, focusMeta, radii, spacing } from "../constants/theme";
import { FocusTag } from "../types/models";

export function Badge({ tag }: { tag: FocusTag }) {
  const meta = focusMeta[tag];
  return (
    <View style={[styles.badge, { backgroundColor: `${meta.color}18`, borderColor: `${meta.color}55` }]}>
      <Text style={styles.badgeText}>
        {meta.emoji} {tag}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
});
