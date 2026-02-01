import { useState } from 'react';
import { EXERCISES } from '../constants/exercises';
import type { Exercise } from '../constants/exercises';

export const useRandomExercises = (): Exercise => {
  const [exercise] = useState(() => {
    const randomIndex = Math.floor(Math.random() * EXERCISES.length);
    return EXERCISES[randomIndex];
  });

  return exercise;
};
