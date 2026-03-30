const exerciseGif = (id: string) => `https://static.exercisedb.dev/media/${id}.gif`;

const youtubeSearch = (query: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

const badmintonVideoSearch = (query: string) => youtubeSearch(`${query} badminton drill demo`);

export const mediaByExerciseId: Record<string, { imageUrl: string; videoUrl: string }> = {
  squats: {
    imageUrl: exerciseGif("5BZHW9s"),
    videoUrl: exerciseGif("5BZHW9s"),
  },
  "reverse-lunges": {
    imageUrl: exerciseGif("SSsBDwB"),
    videoUrl: exerciseGif("SSsBDwB"),
  },
  "glute-bridge": {
    imageUrl: exerciseGif("u0cNiij"),
    videoUrl: exerciseGif("u0cNiij"),
  },
  "calf-raises": {
    imageUrl: exerciseGif("bJYHBIN"),
    videoUrl: exerciseGif("bJYHBIN"),
  },
  "jump-squats": {
    imageUrl: exerciseGif("LIlE5Tn"),
    videoUrl: exerciseGif("LIlE5Tn"),
  },
  "skater-hops": {
    imageUrl: exerciseGif("zfNHMN9"),
    videoUrl: exerciseGif("zfNHMN9"),
  },
  "agility-line-drills": {
    imageUrl: exerciseGif("mweqJin"),
    videoUrl: exerciseGif("mweqJin"),
  },
  "dead-bug": {
    imageUrl: exerciseGif("iny3m5y"),
    videoUrl: exerciseGif("iny3m5y"),
  },
  "side-plank": {
    imageUrl: exerciseGif("5VXmnV5"),
    videoUrl: exerciseGif("5VXmnV5"),
  },
  "mountain-climbers": {
    imageUrl: exerciseGif("RJgzwny"),
    videoUrl: exerciseGif("RJgzwny"),
  },
  "push-ups": {
    imageUrl: exerciseGif("I4hDWkc"),
    videoUrl: exerciseGif("I4hDWkc"),
  },
  "band-rows": {
    imageUrl: exerciseGif("km0sQC0"),
    videoUrl: exerciseGif("km0sQC0"),
  },
  "shoulder-taps": {
    imageUrl: exerciseGif("yRpV5TC"),
    videoUrl: exerciseGif("yRpV5TC"),
  },
  "band-pull-aparts": {
    imageUrl: exerciseGif("sTfvVsG"),
    videoUrl: exerciseGif("sTfvVsG"),
  },
  "external-rotations": {
    imageUrl: exerciseGif("FWdVhcW"),
    videoUrl: exerciseGif("FWdVhcW"),
  },
  "scapular-push-ups": {
    imageUrl: exerciseGif("pvBMLHA"),
    videoUrl: exerciseGif("pvBMLHA"),
  },
  burpees: {
    imageUrl: exerciseGif("dK9394r"),
    videoUrl: exerciseGif("dK9394r"),
  },
  "bicycle-crunches": {
    imageUrl: exerciseGif("tZkGYZ9"),
    videoUrl: exerciseGif("tZkGYZ9"),
  },
  "single-leg-rdl": {
    imageUrl: exerciseGif("gKozT8X"),
    videoUrl: exerciseGif("gKozT8X"),
  },
  "plank-shoulder-taps": {
    imageUrl: exerciseGif("h1ezqSu"),
    videoUrl: exerciseGif("h1ezqSu"),
  },
  "bird-dog": {
    imageUrl: exerciseGif("qBcKorM"),
    videoUrl: exerciseGif("qBcKorM"),
  },
  "shadow-badminton": {
    imageUrl: exerciseGif("hoXt6wv"),
    videoUrl: badmintonVideoSearch("shadow badminton"),
  },
  "six-corner-footwork": {
    imageUrl: exerciseGif("IBj3nsn"),
    videoUrl: badmintonVideoSearch("6 corner footwork"),
  },
  "split-step": {
    imageUrl: exerciseGif("e1e76I2"),
    videoUrl: exerciseGif("e1e76I2"),
  },
  "mobility-flow": {
    imageUrl: exerciseGif("DFGXwZr"),
    videoUrl: exerciseGif("DFGXwZr"),
  },
  "stretch-drills": {
    imageUrl: exerciseGif("99rWm7w"),
    videoUrl: exerciseGif("99rWm7w"),
  },
};
