import { calculateStreak, getTodayDayId, getWeekStart } from "./date";

describe("date utils", () => {
  it("returns monday as ISO week start", () => {
    expect(getWeekStart(new Date("2026-03-29T15:00:00.000Z"))).toBe("2026-03-23");
    expect(getWeekStart(new Date("2026-03-24T15:00:00.000Z"))).toBe("2026-03-23");
  });

  it("maps js weekday to app day id", () => {
    expect(getTodayDayId(new Date("2026-03-23T12:00:00.000Z"))).toBe("monday");
    expect(getTodayDayId(new Date("2026-03-29T12:00:00.000Z"))).toBe("sunday");
  });

  it("calculates streak across consecutive days", () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    expect(
      calculateStreak([today.toISOString(), yesterday.toISOString(), twoDaysAgo.toISOString()])
    ).toBe(3);
  });
});
