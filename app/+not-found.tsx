import React from "react";
import { useRouter } from "expo-router";
import { Screen } from "../src/components/screen";
import { SectionTitle } from "../src/components/section-title";
import { PrimaryButton } from "../src/components/primary-button";

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <Screen>
      <SectionTitle
        eyebrow="Lost shuttle"
        title="Screen not found"
        subtitle="The route does not exist. Return to the training dashboard."
      />
      <PrimaryButton label="Go Home" onPress={() => router.replace("/(tabs)")} />
    </Screen>
  );
}
