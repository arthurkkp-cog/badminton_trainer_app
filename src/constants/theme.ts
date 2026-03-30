export const colors = {
  background: "#0A0F0C",
  backgroundAlt: "#121A15",
  card: "#121814",
  cardAlt: "#18211B",
  border: "#26342B",
  text: "#F4F7F4",
  textMuted: "#A2B3A7",
  primary: "#42D77D",
  primaryDark: "#1FAE58",
  accent: "#D8FFE5",
  warning: "#F5B942",
  danger: "#FF6B6B",
  white: "#FFFFFF",
  shadow: "rgba(0,0,0,0.28)",
  track: "#223028",
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const typography = {
  hero: 34,
  h1: 28,
  h2: 22,
  h3: 18,
  body: 15,
  caption: 13,
};

export const shadows = {
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
};

export const focusMeta: Record<string, { emoji: string; color: string }> = {
  Footwork: { emoji: "👣", color: "#42D77D" },
  Power: { emoji: "⚡️", color: "#F5B942" },
  Endurance: { emoji: "🫁", color: "#72D0FF" },
  Mobility: { emoji: "🧘", color: "#B391FF" },
  Recovery: { emoji: "🌿", color: "#74E5B1" },
  Strength: { emoji: "🏋️", color: "#FF8A65" },
  Speed: { emoji: "💨", color: "#FFD166" },
  Balance: { emoji: "🎯", color: "#8BD3DD" },
  Skills: { emoji: "🏸", color: "#7BE495" },
  Core: { emoji: "🧱", color: "#C9E265" },
};
