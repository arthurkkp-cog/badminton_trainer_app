import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "../../app/(tabs)/index";

jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    LinearGradient: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

jest.mock("../store/app-store", () => ({
  useAppStore: () => ({
    todayDayId: "monday",
    tracker: {
      weekStart: "2026-03-23",
      entries: {
        monday: { dayId: "monday", completed: true },
        tuesday: { dayId: "tuesday", completed: false },
        wednesday: { dayId: "wednesday", completed: false },
        thursday: { dayId: "thursday", completed: false },
        friday: { dayId: "friday", completed: false },
        saturday: { dayId: "saturday", completed: false },
        sunday: { dayId: "sunday", completed: false },
      },
    },
    settings: { lengthTarget: 45, mode: "beginner", soundEnabled: true },
    streakCount: 2,
    sessionSnapshot: null,
    favorites: ["squats"],
  }),
}));

describe("HomeScreen", () => {
  it("renders today workout summary", () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText("Today’s work")).toBeTruthy();
    expect(getByText("Footwork + Lower Body Strength")).toBeTruthy();
    expect(getByText("Start Workout")).toBeTruthy();
    expect(getByText("Favorite exercises")).toBeTruthy();
  });
});
