import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Timer } from './Timer';
import * as useRandomExercisesModule from '../../hooks/useRandomExercises';
import { EXERCISES } from '../../constants/exercises';

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

    it('should NOT display exercise during work phase', () => {
      vi.spyOn(useRandomExercisesModule, 'useRandomExercises').mockReturnValue('Squats');

      render(<Timer />);

      // Advance through prepare (5s) to get to work
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      const exerciseDisplay = screen.queryByTestId('exercise-display');
      expect(exerciseDisplay).not.toBeInTheDocument();
    });

    it('should display an exercise from the EXERCISES pool', () => {
      render(<Timer />);

      const exerciseDisplay = screen.getByTestId('exercise-display');
      const exerciseText = exerciseDisplay.textContent;

      expect(EXERCISES).toContain(exerciseText as typeof EXERCISES[number]);
    });
  });
});
