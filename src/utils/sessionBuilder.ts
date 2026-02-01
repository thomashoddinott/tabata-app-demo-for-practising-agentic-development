import { TABATA_CONFIG } from '../constants/tabata';
import type { Phase, IntervalItem } from '../types/timer';

/**
 * Builds the complete session structure for a Tabata workout.
 * Session structure: 1 prepare + (8 work + 7 rest) = 16 total phases
 * @returns Array of all intervals in the session with sequential numbering
 */
export const buildSessionIntervals = (): readonly IntervalItem[] => {
  const intervals: IntervalItem[] = [];
  let sequentialNumber = 1;

  // 1. Prepare phase (once at start)
  intervals.push({
    sequentialNumber: sequentialNumber++,
    phase: 'prepare',
    duration: TABATA_CONFIG.PREPARE_DURATION,
    workInterval: null,
  });

  // 2. Work/Rest cycles (8 rounds)
  for (let i = 1; i <= TABATA_CONFIG.TOTAL_INTERVALS; i++) {
    // Work phase
    intervals.push({
      sequentialNumber: sequentialNumber++,
      phase: 'work',
      duration: TABATA_CONFIG.WORK_DURATION,
      workInterval: i,
    });

    // Rest phase (skip after last work interval)
    if (i < TABATA_CONFIG.TOTAL_INTERVALS) {
      intervals.push({
        sequentialNumber: sequentialNumber++,
        phase: 'rest',
        duration: TABATA_CONFIG.REST_DURATION,
        workInterval: i,
      });
    }
  }

  return intervals;
};

/**
 * Calculates the current sequential number (1-16) based on phase and work interval.
 * Used to determine which interval to highlight in the UI.
 *
 * Mapping:
 * - Prepare → 1
 * - Work interval N → 1 + (N-1)*2 + 1 = N*2
 * - Rest after interval N → 1 + (N-1)*2 + 2 = N*2 + 1
 *
 * @param phase Current phase ('prepare', 'work', or 'rest')
 * @param currentInterval Current work interval number (1-8)
 * @returns Sequential number (1-16)
 */
export const getCurrentSequentialNumber = (
  phase: Phase,
  currentInterval: number
): number => {
  if (phase === 'prepare') {
    return 1;
  }

  // After prepare (1), each work interval has 2 phases: work + rest
  // Interval 1: work=2, rest=3
  // Interval 2: work=4, rest=5
  const baseIndex = 1 + (currentInterval - 1) * 2;

  if (phase === 'work') {
    return baseIndex + 1; // 2, 4, 6, 8...
  } else {
    // rest
    return baseIndex + 2; // 3, 5, 7, 9...
  }
};
