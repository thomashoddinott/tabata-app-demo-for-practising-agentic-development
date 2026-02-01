import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Timer } from './Timer';
import * as useRandomExercisesModule from '../../hooks/useRandomExercises';
import { EXERCISES } from '../../constants/exercises';
import { resetExerciseList } from '../../hooks/useRandomExercises';

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetExerciseList(); // Reset exercise list before each test
  });

  afterEach(() => {
    vi.restoreAllMocks();
    resetExerciseList(); // Clean up after each test
  });

  it('should display initial prepare phase with 5 seconds', () => {
    render(<Timer />);

    expect(screen.getByText('Prepare')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should countdown when started', () => {
    render(<Timer />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should transition to work phase after prepare completes', () => {
    render(<Timer />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display blue background during prepare phase', () => {
    render(<Timer />);

    const container = screen.getByTestId('timer-container');
    expect(container).toHaveClass('bg-prepare');
  });

  it('should display red background during work phase', () => {
    render(<Timer />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const container = screen.getByTestId('timer-container');
    expect(container).toHaveClass('bg-work');
  });

  it('should display green background during rest phase', () => {
    render(<Timer />);

    // Advance through prepare (5s) and work (5s) to get to rest
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    const container = screen.getByTestId('timer-container');
    expect(container).toHaveClass('bg-rest');
  });

  describe('Exercise Display', () => {
    it('should display exercise during prepare phase', () => {
      vi.spyOn(useRandomExercisesModule, 'useRandomExercises').mockReturnValue('Burpees');

      render(<Timer />);

      const exerciseDisplay = screen.getByTestId('exercise-display');
      expect(exerciseDisplay).toBeInTheDocument();
      expect(exerciseDisplay).toHaveTextContent('Burpees');
    });

    it('should display exercise during rest phase', () => {
      vi.spyOn(useRandomExercisesModule, 'useRandomExercises').mockReturnValue('Push-ups');

      render(<Timer />);

      // Advance through prepare (5s) and work (5s) to get to rest
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      const exerciseDisplay = screen.getByTestId('exercise-display');
      expect(exerciseDisplay).toBeInTheDocument();
      expect(exerciseDisplay).toHaveTextContent('Push-ups');
    });

    it('should display exercise during work phase', () => {
      vi.spyOn(useRandomExercisesModule, 'useRandomExercises').mockReturnValue('Squats');

      render(<Timer />);

      // Advance through prepare (5s) to get to work
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      const exerciseDisplay = screen.getByTestId('exercise-display');
      expect(exerciseDisplay).toBeInTheDocument();
      expect(exerciseDisplay).toHaveTextContent('Squats');
    });

    it('should display an exercise from the EXERCISES pool', () => {
      render(<Timer />);

      const exerciseDisplay = screen.getByTestId('exercise-display');
      const exerciseText = exerciseDisplay.textContent;

      expect(EXERCISES).toContain(exerciseText as typeof EXERCISES[number]);
    });
  });

  describe('US-6: No Exercise Repetition', () => {
    it('should show exercise 1 during prepare and work of interval 1', () => {
      render(<Timer />);

      const exerciseDisplay = screen.getByTestId('exercise-display');

      // Prepare phase - should show exercise 1
      const exerciseDuringPrepare = exerciseDisplay.textContent || '';

      // Advance to work phase
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Work phase - should still show exercise 1
      const exerciseDuringWork = exerciseDisplay.textContent || '';

      expect(exerciseDuringPrepare).toBe(exerciseDuringWork);
      expect(EXERCISES).toContain(exerciseDuringPrepare as typeof EXERCISES[number]);
    });

    it('should show exercise 2 during rest after interval 1 and during work of interval 2', () => {
      render(<Timer />);

      const exerciseDisplay = screen.getByTestId('exercise-display');

      // Skip prepare phase
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Skip work phase
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Now in rest phase - should show exercise 2 (next exercise)
      const exerciseDuringRest = exerciseDisplay.textContent || '';

      // Advance to work phase of interval 2
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Work phase of interval 2 - should still show exercise 2
      const exerciseDuringWork2 = exerciseDisplay.textContent || '';

      expect(exerciseDuringRest).toBe(exerciseDuringWork2);
      expect(EXERCISES).toContain(exerciseDuringRest as typeof EXERCISES[number]);
    });

    it('should display different exercises between work intervals', () => {
      render(<Timer />);

      const exerciseDisplay = screen.getByTestId('exercise-display');

      // Advance to work phase of interval 1
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      const exercise1 = exerciseDisplay.textContent || '';

      // Advance through work (5s) and rest (5s) to get to work of interval 2
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      const exercise2 = exerciseDisplay.textContent || '';

      // Verify exercises are different
      expect(exercise1).not.toBe(exercise2);
      expect(EXERCISES).toContain(exercise1 as typeof EXERCISES[number]);
      expect(EXERCISES).toContain(exercise2 as typeof EXERCISES[number]);
    });

    it('should ensure no consecutive duplicates across multiple intervals', () => {
      render(<Timer />);

      const exerciseDisplay = screen.getByTestId('exercise-display');
      const exercisesDuringWork: string[] = [];

      // Advance to work phase of interval 1
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Capture exercises during work phase for first 4 intervals
      for (let i = 0; i < 4; i++) {
        exercisesDuringWork.push(exerciseDisplay.textContent || '');

        // Advance through work (5s) and rest (5s) to next work phase
        act(() => {
          vi.advanceTimersByTime(10000);
        });
      }

      // Verify no consecutive duplicates
      for (let i = 0; i < exercisesDuringWork.length - 1; i++) {
        expect(exercisesDuringWork[i]).not.toBe(exercisesDuringWork[i + 1]);
      }
    });
  });
});
