import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with the provided remaining time', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 10 }));
    
    expect(result.current.remainingTime).toBe(10);
  });

  it('should decrement remaining time by 1 second when timer is active', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 10 }));
    
    // Start the timer
    act(() => {
      result.current.start();
    });

    // Advance time by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.remainingTime).toBe(9);
    
    // Advance another second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.remainingTime).toBe(8);
  });

  it('should stop at 0 and not go negative', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 2 }));
    
    act(() => {
      result.current.start();
    });

    // Advance to 1 second remaining
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remainingTime).toBe(1);

    // Advance to 0 seconds remaining
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remainingTime).toBe(0);

    // Advance past 0 - should stay at 0
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remainingTime).toBe(0);
  });

  it('should pause the timer and stop countdown', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 10 }));
    
    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.remainingTime).toBe(8);

    // Pause the timer
    act(() => {
      result.current.pause();
    });

    // Advance time - timer should not decrement
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.remainingTime).toBe(8);
  });

  it('should resume the timer after pause', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 10 }));
    
    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.remainingTime).toBe(8);

    // Pause
    act(() => {
      result.current.pause();
    });

    // Resume
    act(() => {
      result.current.start();
    });

    // Timer should continue from where it paused
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remainingTime).toBe(7);
  });
});
