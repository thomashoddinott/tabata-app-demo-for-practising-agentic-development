type UseTimerParams = {
  readonly initialTime: number;
};

type UseTimerResult = {
  readonly remainingTime: number;
};

export const useTimer = ({ initialTime }: UseTimerParams): UseTimerResult => {
  return {
    remainingTime: initialTime,
  };
};
