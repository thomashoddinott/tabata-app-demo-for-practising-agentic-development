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
  DEBUG_CONFIG: {
    PREPARE_DURATION: 3,
    WORK_DURATION: 3,
    REST_DURATION: 3,
    TOTAL_INTERVALS: 10,
  },
}));

import { DEBUG_CONFIG } from '../constants/tabata';

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

  it('should expose isActive state that reflects timer running status', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 10 }));
    
    // Initially, timer should not be active
    expect(result.current.isActive).toBe(false);
    
    // After starting, timer should be active
    act(() => {
      result.current.start();
    });
    expect(result.current.isActive).toBe(true);
    
    // After pausing, timer should not be active
    act(() => {
      result.current.pause();
    });
    expect(result.current.isActive).toBe(false);
    
    // Can be restarted
    act(() => {
      result.current.start();
    });
    expect(result.current.isActive).toBe(true);
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

describe('useTimer - Config Parameter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should use debug config when provided', () => {
    const { result } = renderHook(() => useTimer({ config: DEBUG_CONFIG }));

    expect(result.current.remainingTime).toBe(3); // Debug prepare duration
    expect(result.current.phase).toBe('prepare');
  });

  it('should transition from prepare to work with debug durations', () => {
    const { result } = renderHook(() => useTimer({ config: DEBUG_CONFIG }));

    act(() => result.current.start());

    // Advance through debug prepare phase (3 seconds)
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.phase).toBe('work');
    expect(result.current.remainingTime).toBe(3); // Debug work duration
  });

  it('should transition from work to rest with debug durations', () => {
    const { result } = renderHook(() => useTimer({ config: DEBUG_CONFIG }));

    act(() => result.current.start());

    // Advance through prepare (3s) + work (3s) = 6s
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(result.current.phase).toBe('rest');
    expect(result.current.remainingTime).toBe(3); // Debug rest duration
  });
});

describe('useTimer - Navigation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('nextInterval', () => {
    it('should jump to next interval work phase from current interval', () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.start());

      // Advance to interval 1 work phase
      act(() => {
        vi.advanceTimersByTime(5000); // Complete prepare
      });

      expect(result.current.currentInterval).toBe(1);
      expect(result.current.phase).toBe('work');

      // Navigate to next interval
      act(() => {
        result.current.nextInterval();
      });

      expect(result.current.currentInterval).toBe(2);
      expect(result.current.phase).toBe('work');
      expect(result.current.remainingTime).toBe(5); // Reset to full work duration
    });

    it('should reset remainingTime to full work duration when jumping forward', () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.start());

      // Advance to middle of work phase
      act(() => {
        vi.advanceTimersByTime(5000); // Prepare complete
        vi.advanceTimersByTime(2000); // 2 seconds into work
      });

      expect(result.current.remainingTime).toBe(3); // 3 seconds remaining

      // Jump to next interval
      act(() => {
        result.current.nextInterval();
      });

      expect(result.current.remainingTime).toBe(5); // Reset to full work duration
    });

    it('should preserve pause state when navigating forward', () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.start());

      // Advance to work phase
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Pause timer
      act(() => {
        result.current.pause();
      });

      expect(result.current.isActive).toBe(false);

      // Navigate forward while paused
      act(() => {
        result.current.nextInterval();
      });

      // Should still be paused
      expect(result.current.isActive).toBe(false);
      expect(result.current.currentInterval).toBe(2);
    });

    it('should indicate when next interval is not available (at interval 10)', () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.start());

      // Fast forward to interval 10
      act(() => {
        vi.advanceTimersByTime(5000); // Prepare
      });

      for (let i = 0; i < 9; i++) {
        act(() => {
          vi.advanceTimersByTime(10000); // Work + Rest
        });
      }

      expect(result.current.currentInterval).toBe(10);
      expect(result.current.canGoNext).toBe(false);
    });

    it('should indicate when next interval is available (before interval 10)', () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.start());

      act(() => {
        vi.advanceTimersByTime(5000); // Prepare
      });

      expect(result.current.currentInterval).toBe(1);
      expect(result.current.canGoNext).toBe(true);
    });
  });

  describe('previousInterval', () => {
    it('should restart current interval when more than 5 seconds have elapsed', () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.start());

      // Advance to interval 2 work phase
      act(() => {
        vi.advanceTimersByTime(5000); // Prepare
        vi.advanceTimersByTime(10000); // Interval 1: work + rest
      });

      expect(result.current.currentInterval).toBe(2);
      expect(result.current.phase).toBe('work');
      expect(result.current.remainingTime).toBe(5);

      // Advance 4 seconds (1 second remaining, 4 elapsed)
      // Elapsed time = 5 - 1 = 4 seconds (not > 5, should go to previous)
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      expect(result.current.remainingTime).toBe(1);

      // Navigate back - since only 4 seconds elapsed, should go to previous interval
      act(() => {
        result.current.previousInterval();
      });

      expect(result.current.currentInterval).toBe(1);
      expect(result.current.phase).toBe('work');
      expect(result.current.remainingTime).toBe(5);
    });

    it('should go to previous interval when 5 or fewer seconds have elapsed', () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.start());

      // Advance to interval 3
      act(() => {
        vi.advanceTimersByTime(5000); // Prepare
        vi.advanceTimersByTime(20000); // Intervals 1-2: (work + rest) * 2
      });

      expect(result.current.currentInterval).toBe(3);
      expect(result.current.phase).toBe('work');

      // Advance 2 seconds (elapsed = 2, which is ≤ 5)
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.remainingTime).toBe(3);

      // Navigate back - should go to previous interval
      act(() => {
        result.current.previousInterval();
      });

      expect(result.current.currentInterval).toBe(2);
      expect(result.current.phase).toBe('work');
      expect(result.current.remainingTime).toBe(5);
    });

    it('should restart current interval when exactly at 5 seconds elapsed threshold', () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.start());

      // Advance to interval 2
      act(() => {
        vi.advanceTimersByTime(5000); // Prepare
        vi.advanceTimersByTime(10000); // Interval 1
      });

      expect(result.current.currentInterval).toBe(2);

      // Don't advance time at all - elapsed = 0, which is ≤ 5
      // Should go to previous interval
      act(() => {
        result.current.previousInterval();
      });

      expect(result.current.currentInterval).toBe(1);
    });

    it('should go to prepare phase when going back from interval 1', () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.start());

      // Advance to work phase of interval 1
      act(() => {
        vi.advanceTimersByTime(5000); // Complete prepare
      });

      expect(result.current.currentInterval).toBe(1);
      expect(result.current.phase).toBe('work');

      // Navigate back from interval 1
      act(() => {
        result.current.previousInterval();
      });

      expect(result.current.currentInterval).toBe(1);
      expect(result.current.phase).toBe('prepare');
      expect(result.current.remainingTime).toBe(5);
    });

    it('should indicate when previous interval is not available (at prepare phase)', () => {
      const { result } = renderHook(() => useTimer());

      // At prepare phase
      expect(result.current.phase).toBe('prepare');
      expect(result.current.canGoPrevious).toBe(false);
    });

    it('should indicate when previous interval is available (after prepare)', () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.start());

      act(() => {
        vi.advanceTimersByTime(5000); // Advance past prepare
      });

      expect(result.current.phase).toBe('work');
      expect(result.current.canGoPrevious).toBe(true);
    });

    it('should preserve pause state when navigating backward', () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.start());

      // Advance to interval 2
      act(() => {
        vi.advanceTimersByTime(5000); // Prepare
        vi.advanceTimersByTime(10000); // Interval 1
      });

      // Pause timer
      act(() => {
        result.current.pause();
      });

      expect(result.current.isActive).toBe(false);

      // Navigate backward while paused
      act(() => {
        result.current.previousInterval();
      });

      // Should still be paused
      expect(result.current.isActive).toBe(false);
      expect(result.current.currentInterval).toBe(1);
    });

    it('should handle smart behavior correctly: restart when >5s elapsed, go back when ≤5s', () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.start());

      // Advance to interval 2, then 4 seconds into work (elapsed = 4s)
      act(() => {
        vi.advanceTimersByTime(5000); // Prepare
        vi.advanceTimersByTime(10000); // Interval 1
        vi.advanceTimersByTime(4000); // 4 seconds into interval 2 work
      });

      expect(result.current.currentInterval).toBe(2);
      expect(result.current.remainingTime).toBe(1); // 5 - 4 = 1

      // Navigate back - elapsed = 4s (≤ 5), should go to interval 1
      act(() => {
        result.current.previousInterval();
      });

      expect(result.current.currentInterval).toBe(1);
      expect(result.current.phase).toBe('work');
      expect(result.current.remainingTime).toBe(5);

      // Now advance to interval 2 again, but this time let 6 seconds elapse
      act(() => {
        vi.advanceTimersByTime(15000); // Complete interval 1 (work 5s + rest 10s = 15s total from work start)
      });

      expect(result.current.currentInterval).toBe(2);

      // Advance 1 second into interval 2 (but we need to wait for work phase)
      // We're currently at work phase with 5s remaining
      // Wait 1 second - elapsed = 1s (≤ 5), should go to previous
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(result.current.remainingTime).toBe(4);

      act(() => {
        result.current.previousInterval();
      });

      // Should go to previous interval
      expect(result.current.currentInterval).toBe(1);
    });
  });
});
