import { weeklyPlanMap } from "../data/workouts";
import { buildSessionQueue, getWorkoutExercises } from "./workout";

describe("workout utils", () => {
  it("trims accessories for shorter workouts", () => {
    const monday = weeklyPlanMap.monday;
    const shortVersion = getWorkoutExercises(monday, 30, "beginner");
    const longVersion = getWorkoutExercises(monday, 60, "beginner");

    expect(shortVersion.length).toBeLessThan(longVersion.length);
    expect(shortVersion.some((exercise) => exercise.exerciseId === "calf-raises")).toBe(false);
    expect(longVersion.some((exercise) => exercise.exerciseId === "calf-raises")).toBe(true);
  });

  it("scales prescriptions by mode", () => {
    const friday = weeklyPlanMap.friday;
    const beginner = getWorkoutExercises(friday, 45, "beginner").find(
      (exercise) => exercise.exerciseId === "six-corner-footwork"
    );
    const intermediate = getWorkoutExercises(friday, 45, "intermediate").find(
      (exercise) => exercise.exerciseId === "six-corner-footwork"
    );

    expect(beginner?.sets).toBe("4");
    expect(intermediate?.sets).toBe("6");
  });

  it("builds a session queue with parsed timed durations", () => {
    const tuesday = weeklyPlanMap.tuesday;
    const queue = buildSessionQueue(tuesday, 45, "beginner");
    const timed = queue.find((item) => item.isTimed);

    expect(queue.length).toBeGreaterThan(0);
    expect(timed?.durationSeconds).toBeGreaterThan(0);
  });
});
