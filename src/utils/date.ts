const weekdayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const getTodayWeekday = (date = new Date()) => {
  const jsDay = date.getDay();
  return weekdayOrder[(jsDay + 6) % 7];
};

export const getTodayDayId = (date = new Date()) => getTodayWeekday(date).toLowerCase();

export const getWeekStart = (date = new Date()) => {
  const local = new Date(date);
  const day = local.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  local.setHours(0, 0, 0, 0);
  local.setDate(local.getDate() + diff);
  return local.toISOString().slice(0, 10);
};

export const formatFriendlyDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

export const isSameCalendarDay = (a: string, b: string) =>
  new Date(a).toDateString() === new Date(b).toDateString();

export const calculateStreak = (completedAtDates: string[]) => {
  if (completedAtDates.length === 0) {
    return 0;
  }

  const sortedUnique = [...new Set(completedAtDates.map((date) => new Date(date).toDateString()))]
    .map((date) => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const latest = new Date(sortedUnique[0]);
  latest.setHours(0, 0, 0, 0);

  if (latest.getTime() !== today.getTime() && latest.getTime() !== yesterday.getTime()) {
    return 0;
  }

  let streak = 1;
  for (let index = 0; index < sortedUnique.length - 1; index += 1) {
    const current = new Date(sortedUnique[index]);
    const next = new Date(sortedUnique[index + 1]);
    current.setHours(0, 0, 0, 0);
    next.setHours(0, 0, 0, 0);
    const expected = new Date(current);
    expected.setDate(current.getDate() - 1);
    if (next.getTime() === expected.getTime()) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};
