import { useState, useEffect, useRef } from 'react';

type UseTimerParams = {
  readonly initialTime: number;
};

type UseTimerResult = {
  readonly remainingTime: number;
  readonly start: () => void;
  readonly pause: () => void;
};

export const useTimer = ({ initialTime }: UseTimerParams): UseTimerResult => {
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

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
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const start = () => {
    setIsActive(true);
  };

  const pause = () => {
    setIsActive(false);
  };

  return {
    remainingTime,
    start,
    pause,
  };
};
