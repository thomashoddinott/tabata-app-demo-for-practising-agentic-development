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
