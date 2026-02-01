import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
import { resetExerciseList } from './hooks/useRandomExercises';

// Mock the constants modules with test-specific values (independent of production constants)
vi.mock('./constants/exercises', () => ({
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

// Import the mocked EXERCISES to use in assertions
import { EXERCISES } from './constants/exercises';

vi.mock('./constants/tabata', () => ({
  TABATA_CONFIG: {
    PREPARE_DURATION: 5,
    WORK_DURATION: 5,
    REST_DURATION: 5,
    TOTAL_INTERVALS: 10,
  },
}));

describe('App - Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetExerciseList();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    resetExerciseList();
  });

  it('should display Home screen with Start button initially', () => {
    render(<App />);

    const startButton = screen.getByRole('button', { name: /start/i });
    expect(startButton).toBeInTheDocument();
  });

  it('should show Timer screen when Start button is clicked', () => {
    render(<App />);

    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);

    expect(screen.getByText('Prepare')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should start timer automatically after clicking Start', () => {
    render(<App />);

    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should display exercise during all phases (prepare, work, and rest)', () => {
    render(<App />);

    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);

    // Should display exercise 1 during prepare phase
    const exerciseDisplayDuringPrepare = screen.getByTestId('exercise-display');
    expect(exerciseDisplayDuringPrepare).toBeInTheDocument();
    const exercise1 = exerciseDisplayDuringPrepare.textContent;
    expect(EXERCISES).toContain(exercise1);

    // Advance to work phase (5s)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Should display exercise 1 during work phase (same as prepare)
    const exerciseDisplayDuringWork = screen.getByTestId('exercise-display');
    expect(exerciseDisplayDuringWork).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(exerciseDisplayDuringWork).toHaveTextContent(exercise1!);

    // Advance to rest phase (5s)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Should display exercise 2 during rest phase (preview of next exercise)
    const exerciseDisplayDuringRest = screen.getByTestId('exercise-display');
    expect(exerciseDisplayDuringRest).toBeInTheDocument();
    expect(screen.getByText('Rest')).toBeInTheDocument();
    const exercise2 = exerciseDisplayDuringRest.textContent;
    expect(EXERCISES).toContain(exercise2);
    // Exercise 2 should be different from exercise 1 (no consecutive duplicates)
    expect(exercise2).not.toBe(exercise1);
  });
});
