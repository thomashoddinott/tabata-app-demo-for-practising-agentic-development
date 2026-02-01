import { useReducer, useEffect, useRef, useCallback } from 'react';
import type { Phase } from '../types/timer';
import { TABATA_CONFIG } from '../constants/tabata';

type UseTimerParams = {
  readonly initialTime?: number;
};

type UseTimerResult = {
  readonly remainingTime: number;
  readonly phase: Phase;
  readonly currentInterval: number;
  readonly start: () => void;
  readonly pause: () => void;
};

type TimerState = {
  phase: Phase;
  currentInterval: number;
  remainingTime: number;
  isActive: boolean;
  isSessionMode: boolean;
};

type TimerAction =
  | { type: 'TICK' }
  | { type: 'START' }
  | { type: 'PAUSE' };

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'START':
      return { ...state, isActive: true };

    case 'PAUSE':
      return { ...state, isActive: false };

    case 'TICK': {
      if (state.remainingTime <= 0) {
        return state;
      }

      const newRemainingTime = state.remainingTime - 1;

      // Handle phase transitions only in session mode
      if (newRemainingTime === 0 && state.isSessionMode) {
        if (state.phase === 'prepare') {
          return {
            ...state,
            phase: 'work',
            remainingTime: TABATA_CONFIG.WORK_DURATION,
          };
        } else if (state.phase === 'work') {
          if (state.currentInterval < TABATA_CONFIG.TOTAL_INTERVALS) {
            return {
              ...state,
              phase: 'rest',
              remainingTime: TABATA_CONFIG.REST_DURATION,
            };
          } else {
            return { ...state, remainingTime: 0 };
          }
        } else if (state.phase === 'rest') {
          return {
            ...state,
            phase: 'work',
            currentInterval: state.currentInterval + 1,
            remainingTime: TABATA_CONFIG.WORK_DURATION,
          };
        }
      }

      return { ...state, remainingTime: newRemainingTime };
    }

    default:
      return state;
  }
};

export const useTimer = (params?: UseTimerParams): UseTimerResult => {
  const initialState: TimerState = {
    phase: 'prepare',
    currentInterval: 1,
    remainingTime: params?.initialTime ?? TABATA_CONFIG.PREPARE_DURATION,
    isActive: false,
    isSessionMode: params === undefined,
  };

  const [state, dispatch] = useReducer(timerReducer, initialState);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!state.isActive) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isActive]);

  const start = useCallback(() => {
    dispatch({ type: 'START' });
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);

  return {
    remainingTime: state.remainingTime,
    phase: state.phase,
    currentInterval: state.currentInterval,
    start,
    pause,
  };
};
