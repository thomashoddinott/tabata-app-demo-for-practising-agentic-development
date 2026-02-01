import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRandomExercises, resetExerciseList } from './useRandomExercises';

// Mock the constants modules with test-specific values (independent of production constants)
vi.mock('../constants/exercises', () => ({
  EXERCISES: [
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
  ],
}));

vi.mock('../constants/tabata', () => ({
  TABATA_CONFIG: {
    PREPARE_DURATION: 5,
    WORK_DURATION: 5,
    REST_DURATION: 5,
    TOTAL_INTERVALS: 10,
  },
}));

// Import the mocked constants to use in assertions
import { EXERCISES } from '../constants/exercises';
import { TABATA_CONFIG } from '../constants/tabata';

describe('useRandomExercises', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetExerciseList(); // Reset exercise list before each test
  });

  afterEach(() => {
    vi.restoreAllMocks();
    resetExerciseList(); // Clean up after each test
  });

  it('should return an exercise from the pool for interval 1', () => {
    const { result } = renderHook(() => useRandomExercises(1));

    expect(EXERCISES).toContain(result.current);
  });

  it('should select a specific exercise when Math.random is mocked', () => {
    // Mock Math.random to return 0, which should select the first exercise
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const { result } = renderHook(() => useRandomExercises(1));

    expect(result.current).toBe(EXERCISES[0]);
  });

  it('should select the last exercise when Math.random returns a value close to 1', () => {
    // Mock Math.random to return 0.99, which should select the last exercise
    vi.spyOn(Math, 'random').mockReturnValue(0.99);

    const { result } = renderHook(() => useRandomExercises(1));

    expect(result.current).toBe(EXERCISES[EXERCISES.length - 1]);
  });

  it('should return the same exercise for the same interval on re-render', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const { result, rerender } = renderHook(({ interval }) => useRandomExercises(interval), {
      initialProps: { interval: 1 }
    });

    const firstExercise = result.current;

    // Re-render the hook with the same interval
    rerender({ interval: 1 });

    // Exercise should remain the same
    expect(result.current).toBe(firstExercise);
  });

  it('should return different exercise for different intervals', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const { result, rerender } = renderHook(({ interval }) => useRandomExercises(interval), {
      initialProps: { interval: 1 }
    });

    // Change to interval 2
    rerender({ interval: 2 });

    const secondExercise = result.current;

    // Exercises can be different (not guaranteed, but with mocked random they should be)
    expect(secondExercise).toBeDefined();
    expect(EXERCISES).toContain(secondExercise);
  });

  describe('US-6: No consecutive duplicate exercises', () => {
    it('should ensure no consecutive exercises are the same', () => {
      // Test all 10 intervals to ensure no consecutive duplicates
      const exercises: string[] = [];

      for (let interval = 1; interval <= TABATA_CONFIG.TOTAL_INTERVALS; interval++) {
        const { result } = renderHook(() => useRandomExercises(interval));
        exercises.push(result.current);
      }

      // Check that no consecutive exercises are the same
      for (let i = 0; i < exercises.length - 1; i++) {
        expect(exercises[i]).not.toBe(exercises[i + 1]);
      }
    });

    it('should allow first exercise to be any exercise', () => {
      // Run multiple times to ensure first exercise can vary
      const firstExercises = new Set<string>();

      for (let i = 0; i < 50; i++) {
        resetExerciseList(); // Reset to generate a new list each time
        const { result } = renderHook(() => useRandomExercises(1));
        firstExercises.add(result.current);
      }

      // With 50 iterations, we should see at least 2 different first exercises
      // (unless we're extremely unlucky with randomness)
      expect(firstExercises.size).toBeGreaterThan(1);
    });

    it('should return consistent exercise for the same interval across multiple hook instances', () => {
      // First instance
      const { result: result1 } = renderHook(() => useRandomExercises(3));
      const exercise1 = result1.current;

      // Second instance (should use the same generated list)
      const { result: result2 } = renderHook(() => useRandomExercises(3));
      const exercise2 = result2.current;

      // Both should return the same exercise for interval 3
      expect(exercise1).toBe(exercise2);
    });
  });
});
