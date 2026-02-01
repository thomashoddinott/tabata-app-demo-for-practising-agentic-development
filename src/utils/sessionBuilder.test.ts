import { describe, it, expect } from 'vitest';
import { buildSessionIntervals, getCurrentSequentialNumber } from './sessionBuilder';
import { TABATA_CONFIG } from '../constants/tabata';

describe('buildSessionIntervals', () => {
  it('should generate 20 total phases for 10 work rounds', () => {
    const intervals = buildSessionIntervals();
    // 1 prepare + 10 work + 9 rest = 20 total
    expect(intervals).toHaveLength(20);
  });

  it('should start with prepare phase', () => {
    const intervals = buildSessionIntervals();
    expect(intervals[0]).toEqual({
      sequentialNumber: 1,
      phase: 'prepare',
      duration: TABATA_CONFIG.PREPARE_DURATION,
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

    // Last interval should be work phase (interval 10)
    expect(lastInterval.phase).toBe('work');
    expect(lastInterval.workInterval).toBe(10);
  });

  it('should use correct durations from TABATA_CONFIG', () => {
    const intervals = buildSessionIntervals();

    // Check prepare duration
    expect(intervals[0].duration).toBe(TABATA_CONFIG.PREPARE_DURATION);

    // Check work durations
    const workIntervals = intervals.filter(i => i.phase === 'work');
    workIntervals.forEach(interval => {
      expect(interval.duration).toBe(TABATA_CONFIG.WORK_DURATION);
    });

    // Check rest durations
    const restIntervals = intervals.filter(i => i.phase === 'rest');
    restIntervals.forEach(interval => {
      expect(interval.duration).toBe(TABATA_CONFIG.REST_DURATION);
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

    // Last work interval should be 8
    expect(intervals[15].workInterval).toBe(8);
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

  it('should return 20 for work interval 10', () => {
    const result = getCurrentSequentialNumber('work', 10);
    expect(result).toBe(20);
  });

  it('should return 15 for rest after interval 7', () => {
    const result = getCurrentSequentialNumber('rest', 7);
    expect(result).toBe(15);
  });
});
