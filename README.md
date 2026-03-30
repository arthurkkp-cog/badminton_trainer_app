# Badminton Daily Trainer

An iPhone-first Expo React Native mini app for structured 30–60 minute badminton training. It focuses on footwork, explosiveness, endurance, balance, recovery, and disciplined daily execution without any backend.

## Stack

- Expo + React Native
- Expo Router
- TypeScript
- AsyncStorage for local persistence only
- Safe-area-aware iPhone layout

## Features

- Home screen with a widget-style Today card, weekly progress, streak, and favorites
- 7-day badminton training plan with seeded workouts
- Workout detail screen with warm-up, main blocks, cooldown, and completion checkboxes
- Exercise library with badminton-specific benefits and favorite toggling
- Timer mode with pause, resume, skip, next preview, and completion logging
- Weekly tracker with completed days, energy rating, effort rating, and notes
- Settings for workout length, mode, timer cues, and progress reset

## Project structure

```text
app/
  (tabs)/
  workout/
  session/
src/
  components/
  constants/
  data/
  store/
  test/
  types/
  utils/
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Expo:

   ```bash
   npm run start
   ```

3. Open on iPhone with Expo Go:
   - Install Expo Go from the App Store.
   - Make sure your Mac and iPhone are on the same network.
   - Scan the QR code shown by Expo in the terminal or browser.

## Useful scripts

```bash
npm run start
npm run ios
npm run android
npm run test
```

## Data and customization

- Exercise seed data lives in `/Users/arthurpoon/Documents/GitHub/badminton_trainer_app/src/data/exercises.ts:1`
- Exercise media mapping lives in `/Users/arthurpoon/Documents/GitHub/badminton_trainer_app/src/data/media.ts:1`
- Weekly plan seed data lives in `/Users/arthurpoon/Documents/GitHub/badminton_trainer_app/src/data/workouts.ts:1`
- App theme tokens live in `/Users/arthurpoon/Documents/GitHub/badminton_trainer_app/src/constants/theme.ts:1`
- AsyncStorage persistence is centralized in `/Users/arthurpoon/Documents/GitHub/badminton_trainer_app/src/store/storage.ts:1`

To customize media later:

- Replace entries in `src/data/media.ts` or override `videoUrl` and `imageUrl` in the exercise seed data.
- Keep the same exercise IDs so screens continue resolving references without changes.

## Local persistence

The app stores the following locally in AsyncStorage:

- user settings
- current week tracker
- session history for streaks
- favorite exercises
- in-progress session snapshot

No backend or account system is used in this version.

## Notes

- The weekly tracker rolls over Monday to Sunday.
- Beginner and intermediate use the same 7-day template with scaled prescriptions.
- 30 / 45 / 60 minute targets trim or expand accessory work rather than rewriting each day.

## Next improvements

1. Add real exercise video thumbnails and motion demos.
2. Add adaptive load suggestions based on energy, effort, and missed sessions.
3. Add notification reminders, achievements, and Apple Health integration.
