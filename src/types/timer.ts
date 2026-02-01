export type Phase = 'prepare' | 'work' | 'rest';

export type TimerState = {
  readonly phase: Phase;
  readonly remainingTime: number;
  readonly currentInterval: number;
  readonly isActive: boolean;
};

export type SessionConfig = {
  readonly prepareDuration: number;
  readonly workDuration: number;
  readonly restDuration: number;
  readonly totalIntervals: number;
};

export type IntervalItem = {
  readonly sequentialNumber: number;  // 1-16
  readonly phase: Phase;               // 'prepare' | 'work' | 'rest'
  readonly duration: number;           // seconds
  readonly workInterval: number | null; // null for prepare, 1-8 for work/rest
};
