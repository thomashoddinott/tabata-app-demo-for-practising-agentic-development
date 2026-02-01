import { describe, it, expect, vi } from 'vitest';
import { buildSessionIntervals, getCurrentSequentialNumber } from './sessionBuilder';

// Mock the TABATA_CONFIG module with test-specific values (independent of production constants)
vi.mock('../constants/tabata', () => ({
  TABATA_CONFIG: {
    PREPARE_DURATION: 5,
    WORK_DURATION: 60,
    REST_DURATION: 10,
    TOTAL_INTERVALS: 8,
  },
  DEBUG_CONFIG: {
    PREPARE_DURATION: 3,
    WORK_DURATION: 3,
    REST_DURATION: 3,
    TOTAL_INTERVALS: 8,
  },
}));

import { DEBUG_CONFIG } from '../constants/tabata';

describe('buildSessionIntervals', () => {
  it('should generate 16 total phases for 8 work rounds', () => {
    const intervals = buildSessionIntervals();
    // 1 prepare + 8 work + 7 rest = 16 total
    expect(intervals).toHaveLength(16);
  });

  it('should start with prepare phase', () => {
    const intervals = buildSessionIntervals();
    expect(intervals[0]).toEqual({
      sequentialNumber: 1,
      phase: 'prepare',
      duration: 5,
      workInterval: null,
    });
  });

  it('should alternate work and rest phases after prepare', () => {
    const intervals = buildSessionIntervals();

    // After prepare (index 0), should be work-rest-work-rest pattern
    expect(intervals[1].phase).toBe('work');
    expect(intervals[2].phase).toBe('rest');
    expect(intervals[3].phase).toBe('work');
    expect(intervals[4].phase).toBe('rest');
    expect(intervals[5].phase).toBe('work');
    expect(intervals[6].phase).toBe('rest');
  });

  it('should not include rest after final work interval', () => {
    const intervals = buildSessionIntervals();
    const lastInterval = intervals[intervals.length - 1];

    // Last interval should be work phase (interval 8)
    expect(lastInterval.phase).toBe('work');
    expect(lastInterval.workInterval).toBe(8);
  });

  it('should use correct durations', () => {
    const intervals = buildSessionIntervals();

    // Check prepare duration (5s)
    expect(intervals[0].duration).toBe(5);

    // Check work durations (60s)
    const workIntervals = intervals.filter(i => i.phase === 'work');
    workIntervals.forEach(interval => {
      expect(interval.duration).toBe(60);
    });

    // Check rest durations (10s)
    const restIntervals = intervals.filter(i => i.phase === 'rest');
    restIntervals.forEach(interval => {
      expect(interval.duration).toBe(10);
    });
  });

  it('should assign correct work interval numbers', () => {
    const intervals = buildSessionIntervals();

    // Prepare should have null
    expect(intervals[0].workInterval).toBeNull();

    // First work interval should be 1
    expect(intervals[1].workInterval).toBe(1);

    // First rest (after interval 1) should be 1
    expect(intervals[2].workInterval).toBe(1);

    // Second work interval should be 2
    expect(intervals[3].workInterval).toBe(2);

    // Last work interval (8th) should be at index 15
    const lastWorkInterval = intervals[intervals.length - 1];
    expect(lastWorkInterval.workInterval).toBe(8);
  });

  it('should assign sequential numbers correctly', () => {
    const intervals = buildSessionIntervals();

    intervals.forEach((interval, index) => {
      expect(interval.sequentialNumber).toBe(index + 1);
    });
  });
});

describe('getCurrentSequentialNumber', () => {
  it('should return 1 for prepare phase', () => {
    const result = getCurrentSequentialNumber('prepare', 1);
    expect(result).toBe(1);
  });

  it('should return 2 for work interval 1', () => {
    const result = getCurrentSequentialNumber('work', 1);
    expect(result).toBe(2);
  });

  it('should return 3 for rest after interval 1', () => {
    const result = getCurrentSequentialNumber('rest', 1);
    expect(result).toBe(3);
  });

  it('should return 4 for work interval 2', () => {
    const result = getCurrentSequentialNumber('work', 2);
    expect(result).toBe(4);
  });

  it('should return 5 for rest after interval 2', () => {
    const result = getCurrentSequentialNumber('rest', 2);
    expect(result).toBe(5);
  });

  it('should return 16 for work interval 8', () => {
    const result = getCurrentSequentialNumber('work', 8);
    expect(result).toBe(16);
  });

  it('should return 13 for rest after interval 6', () => {
    const result = getCurrentSequentialNumber('rest', 6);
    expect(result).toBe(13);
  });
});

describe('buildSessionIntervals with config parameter', () => {
  it('should use debug config durations when provided', () => {
    const intervals = buildSessionIntervals(DEBUG_CONFIG);

    // Check prepare duration (3s)
    expect(intervals[0].duration).toBe(3);

    // Check work durations (3s)
    const workIntervals = intervals.filter(i => i.phase === 'work');
    workIntervals.forEach(interval => {
      expect(interval.duration).toBe(3);
    });

    // Check rest durations (3s)
    const restIntervals = intervals.filter(i => i.phase === 'rest');
    restIntervals.forEach(interval => {
      expect(interval.duration).toBe(3);
    });
  });

  it('should start with prepare phase using debug config', () => {
    const intervals = buildSessionIntervals(DEBUG_CONFIG);
    expect(intervals[0]).toEqual({
      sequentialNumber: 1,
      phase: 'prepare',
      duration: 3,
      workInterval: null,
    });
  });
});
