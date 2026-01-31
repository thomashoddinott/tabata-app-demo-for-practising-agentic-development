import { useState, useEffect, useRef } from 'react';
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

export const useTimer = (params?: UseTimerParams): UseTimerResult => {
  const [phase, setPhase] = useState<Phase>('prepare');
  const [currentInterval, setCurrentInterval] = useState(1);
  const [remainingTime, setRemainingTime] = useState(
    params?.initialTime ?? TABATA_CONFIG.PREPARE_DURATION
  );
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Use refs to track current values for interval callback
  const phaseRef = useRef<Phase>(phase);
  const currentIntervalRef = useRef(currentInterval);

  // Keep refs in sync with state
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    currentIntervalRef.current = currentInterval;
  }, [currentInterval]);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          return 0;
        }
        const newTime = prev - 1;

        // Handle phase transitions when timer reaches 0
        if (newTime === 0 && params === undefined) {
          const currentPhase = phaseRef.current;
          const interval = currentIntervalRef.current;

          if (currentPhase === 'prepare') {
            phaseRef.current = 'work';  // Update ref immediately
            setPhase('work');
            return TABATA_CONFIG.WORK_DURATION;
          } else if (currentPhase === 'work') {
            if (interval < TABATA_CONFIG.TOTAL_INTERVALS) {
              phaseRef.current = 'rest';  // Update ref immediately
              setPhase('rest');
              return TABATA_CONFIG.REST_DURATION;
            }
          } else if (currentPhase === 'rest') {
            phaseRef.current = 'work';  // Update ref immediately
            currentIntervalRef.current = interval + 1;  // Update ref immediately
            setPhase('work');
            setCurrentInterval(interval + 1);
            return TABATA_CONFIG.WORK_DURATION;
          }
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, params]);

  const start = () => {
    setIsActive(true);
  };

  const pause = () => {
    setIsActive(false);
  };

  return {
    remainingTime,
    phase,
    currentInterval,
    start,
    pause,
  };
};
