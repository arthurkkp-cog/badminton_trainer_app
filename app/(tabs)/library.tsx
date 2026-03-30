import React, { useMemo, useState } from "react";
import { Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../src/components/screen";
import { SectionTitle } from "../../src/components/section-title";
import { Card } from "../../src/components/card";
import { colors, spacing, typography } from "../../src/constants/theme";
import { exercises } from "../../src/data/exercises";
import { useAppStore } from "../../src/store/app-store";

export default function LibraryScreen() {
  const { favorites, toggleFavorite } = useAppStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return exercises;
    }
    return exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(normalized) ||
        exercise.category.toLowerCase().includes(normalized)
    );
  }, [query]);

  return (
    <Screen>
      <SectionTitle
        eyebrow="Exercise library"
        title="Movement bank"
        subtitle="Every plan exercise is stored here with its badminton-specific purpose and media placeholders."
      />

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search exercises or categories"
        placeholderTextColor={colors.textMuted}
        style={styles.search}
      />

      {filtered.map((exercise) => {
        const favorite = favorites.includes(exercise.id);
        return (
          <Card key={exercise.id} style={styles.exerciseCard}>
            <Image source={{ uri: exercise.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.row}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.name}>{exercise.name}</Text>
                <Text style={styles.category}>
                  {exercise.category} • {exercise.equipment}
                </Text>
              </View>
              <Pressable onPress={() => toggleFavorite(exercise.id)} hitSlop={10}>
                <Ionicons
                  name={favorite ? "star" : "star-outline"}
                  size={24}
                  color={favorite ? colors.warning : colors.textMuted}
                />
              </Pressable>
            </View>
            <Text style={styles.body}>{exercise.description}</Text>
            <Text style={styles.meta}>Benefit: {exercise.badmintonBenefit}</Text>
            <Text style={styles.meta}>
              Default: {exercise.defaultSets} sets • {exercise.defaultRepsOrTime}
            </Text>
            <Pressable onPress={() => Linking.openURL(exercise.videoUrl)} style={styles.linkRow}>
              <Ionicons name="play-circle" size={18} color={colors.primary} />
              <Text style={styles.link}>Open demo video</Text>
            </Pressable>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: spacing.md,
    fontSize: typography.body,
  },
  exerciseCard: {
    gap: spacing.sm,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  name: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: "700",
  },
  category: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  body: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  meta: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  link: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
});
