import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Timer } from './Timer';

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display initial prepare phase with 10 seconds', () => {
    render(<Timer />);

    expect(screen.getByText('Prepare')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should countdown when started', () => {
    render(<Timer />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('should transition to work phase after prepare completes', () => {
    render(<Timer />);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });
});
