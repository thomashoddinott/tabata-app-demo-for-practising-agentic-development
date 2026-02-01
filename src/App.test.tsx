import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
import { EXERCISES } from './constants/exercises';

describe('App - Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

    // Should display exercise during prepare phase
    const exerciseDisplayDuringPrepare = screen.getByTestId('exercise-display');
    expect(exerciseDisplayDuringPrepare).toBeInTheDocument();
    const exerciseText = exerciseDisplayDuringPrepare.textContent;
    expect(EXERCISES).toContain(exerciseText as typeof EXERCISES[number]);

    // Advance to work phase (5s)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Should display exercise during work phase
    const exerciseDisplayDuringWork = screen.getByTestId('exercise-display');
    expect(exerciseDisplayDuringWork).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    // Should show the same exercise
    expect(exerciseDisplayDuringWork).toHaveTextContent(exerciseText!);

    // Advance to rest phase (5s)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Should display exercise during rest phase
    const exerciseDisplayDuringRest = screen.getByTestId('exercise-display');
    expect(exerciseDisplayDuringRest).toBeInTheDocument();
    expect(screen.getByText('Rest')).toBeInTheDocument();
    // Should show the same exercise
    expect(exerciseDisplayDuringRest).toHaveTextContent(exerciseText!);
  });
});
