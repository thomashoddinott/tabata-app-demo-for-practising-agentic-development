import { useMemo } from 'react';
import { EXERCISES } from '../constants/exercises';
import type { Exercise } from '../constants/exercises';
import { TABATA_CONFIG, type TabataConfig } from '../constants/tabata';

// Generate a list of exercises with no consecutive duplicates
const generateExerciseList = (count: number): Exercise[] => {
  const exerciseList: Exercise[] = [];
  let previousExercise: Exercise | null = null;

  for (let i = 0; i < count; i++) {
    let availableExercises = [...EXERCISES];

    // If there's a previous exercise, remove it from available options
    if (previousExercise !== null) {
      availableExercises = availableExercises.filter(ex => ex !== previousExercise);
    }

    // Select a random exercise from available options
    const randomIndex = Math.floor(Math.random() * availableExercises.length);
    const selectedExercise = availableExercises[randomIndex];

    exerciseList.push(selectedExercise);
    previousExercise = selectedExercise;
  }

  return exerciseList;
};

// Module-level cache for the exercise list
let cachedExerciseList: Exercise[] | null = null;

// Function to get or create the exercise list
const getExerciseList = (config: TabataConfig): Exercise[] => {
  if (cachedExerciseList === null) {
    cachedExerciseList = generateExerciseList(config.TOTAL_INTERVALS);
  }
  return cachedExerciseList;
};

// Function to reset the exercise list (useful for testing and new sessions)
export const resetExerciseList = (): void => {
  cachedExerciseList = null;
};

export const useRandomExercises = (currentInterval: number, config: TabataConfig = TABATA_CONFIG): Exercise => {
  const exerciseList = useMemo(() => getExerciseList(config), [config]);

  // Return the exercise for the current interval (intervals are 1-indexed)
  return exerciseList[currentInterval - 1];
};
