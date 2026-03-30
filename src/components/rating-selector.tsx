import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "../constants/theme";

export function RatingSelector({
  max,
  value,
  onChange,
}: {
  max: number;
  value?: number;
  onChange: (next: number) => void;
}) {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, index) => index + 1).map((item) => {
        const active = value === item;
        return (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            style={[styles.pill, active && styles.active]}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>{item}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  pill: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.text,
    fontWeight: "700",
  },
  activeLabel: {
    color: colors.background,
  },
});
