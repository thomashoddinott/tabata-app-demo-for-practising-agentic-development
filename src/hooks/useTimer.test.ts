import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';

// Mock the TABATA_CONFIG module with test-specific values (independent of production constants)
vi.mock('../constants/tabata', () => ({
  TABATA_CONFIG: {
    PREPARE_DURATION: 5,
    WORK_DURATION: 5,
    REST_DURATION: 5,
    TOTAL_INTERVALS: 10,
  },
}));

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

describe('useTimer - Phase Transitions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should start in prepare phase with 5 seconds', () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.phase).toBe('prepare');
    expect(result.current.remainingTime).toBe(5);
  });

  it('should transition from prepare phase to work phase when timer reaches 0', () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.phase).toBe('prepare');
    expect(result.current.remainingTime).toBe(5);

    act(() => {
      result.current.start();
    });

    // Advance through prepare phase (5 seconds)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.phase).toBe('work');
    expect(result.current.remainingTime).toBe(5);
  });

  it('should transition from work phase to rest phase when timer reaches 0', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    // Advance through prepare phase (5 seconds)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.phase).toBe('work');
    expect(result.current.currentInterval).toBe(1);

    // Advance through work phase (5 seconds)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.phase).toBe('rest');
    expect(result.current.remainingTime).toBe(5);
    expect(result.current.currentInterval).toBe(1);
  });

  it('should transition from rest phase to work phase and increment interval', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    // Advance through prepare (5s) + work (5s) + rest (5s) = 15s
    act(() => {
      vi.advanceTimersByTime(15000);
    });

    expect(result.current.phase).toBe('work');
    expect(result.current.remainingTime).toBe(5);
    expect(result.current.currentInterval).toBe(2);
  });

  it('should complete session after 10th work interval', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    // Advance through entire session:
    // Initial prepare: 5s
    // Then 10 intervals of (work 5s + rest 5s) = 10 * 10s = 100s
    // But the last interval has no rest, so: 5 + (9 * 10) + 5 = 100s
    act(() => {
      vi.advanceTimersByTime(5000); // Prepare
    });

    // Complete 9 full work+rest cycles
    for (let i = 0; i < 9; i++) {
      act(() => {
        vi.advanceTimersByTime(10000); // Work (5s) + Rest (5s)
      });
    }

    expect(result.current.currentInterval).toBe(10);
    expect(result.current.phase).toBe('work');
    expect(result.current.remainingTime).toBe(5);

    // Complete final work interval
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.phase).toBe('work');
    expect(result.current.remainingTime).toBe(0);
    expect(result.current.currentInterval).toBe(10);
  });
});
