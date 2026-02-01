export const EXERCISES = [
  'Push-ups',
  'Squats',
  'Burpees',
  'Lunges',
  'Mountain Climbers',
  'Plank',
  'Jumping Jacks',
  'High Knees',
  'Bicycle Crunches',
  'Jump Squats',
] as const;

export type Exercise = typeof EXERCISES[number];
