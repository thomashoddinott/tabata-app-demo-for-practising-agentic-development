import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRandomExercises } from './useRandomExercises';
import { EXERCISES } from '../constants/exercises';

describe('useRandomExercises', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return an exercise from the pool', () => {
    const { result } = renderHook(() => useRandomExercises());

    expect(EXERCISES).toContain(result.current);
  });

  it('should select a specific exercise when Math.random is mocked', () => {
    // Mock Math.random to return 0, which should select the first exercise
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const { result } = renderHook(() => useRandomExercises());

    expect(result.current).toBe(EXERCISES[0]);
  });

  it('should select the last exercise when Math.random returns a value close to 1', () => {
    // Mock Math.random to return 0.99, which should select the last exercise
    vi.spyOn(Math, 'random').mockReturnValue(0.99);

    const { result } = renderHook(() => useRandomExercises());

    expect(result.current).toBe(EXERCISES[EXERCISES.length - 1]);
  });

  it('should not change exercise on re-render', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const { result, rerender } = renderHook(() => useRandomExercises());

    const firstExercise = result.current;

    // Re-render the hook
    rerender();

    // Exercise should remain the same
    expect(result.current).toBe(firstExercise);
  });
});
