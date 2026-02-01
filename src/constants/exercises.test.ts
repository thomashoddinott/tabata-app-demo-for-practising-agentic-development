import { describe, it, expect } from 'vitest';
import { EXERCISES } from './exercises';

describe('EXERCISES', () => {
  it('should contain exactly 10 exercises', () => {
    expect(EXERCISES).toHaveLength(10);
  });

  it('should contain only non-empty strings', () => {
    EXERCISES.forEach((exercise) => {
      expect(typeof exercise).toBe('string');
      expect(exercise.length).toBeGreaterThan(0);
    });
  });

  it('should contain expected exercises', () => {
    expect(EXERCISES).toContain('Push-ups');
    expect(EXERCISES).toContain('Squats');
    expect(EXERCISES).toContain('Burpees');
    expect(EXERCISES).toContain('Lunges');
    expect(EXERCISES).toContain('Mountain Climbers');
    expect(EXERCISES).toContain('Plank');
    expect(EXERCISES).toContain('Jumping Jacks');
    expect(EXERCISES).toContain('High Knees');
    expect(EXERCISES).toContain('Bicycle Crunches');
    expect(EXERCISES).toContain('Jump Squats');
  });
});
