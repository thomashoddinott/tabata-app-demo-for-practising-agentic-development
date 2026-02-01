export const EXERCISES = [
  'Push Ups 1',
  'Push Ups 2',
  'Monkey Bars',
  'Pull Ups',
  'Handstand',
  'Air Squats',
  'Kicks',
  'Cartwheels',
  'Free Handstand',
  'Upside Down Sit Ups',
] as const;

export type Exercise = typeof EXERCISES[number];
