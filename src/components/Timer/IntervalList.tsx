import type { IntervalItem } from '../../types/timer';

type IntervalListProps = {
  readonly intervals: readonly IntervalItem[];
  readonly currentSequentialNumber: number;
};

export const IntervalList = ({ intervals, currentSequentialNumber }: IntervalListProps) => {
  return (
    <div
      className="w-full max-h-64 overflow-y-auto px-4"
      data-testid="interval-list"
    >
      {intervals.map((interval) => {
        const isCurrent = interval.sequentialNumber === currentSequentialNumber;
        const phaseLabel = interval.phase.charAt(0).toUpperCase() + interval.phase.slice(1);

        return (
          <div
            key={interval.sequentialNumber}
            data-testid={`interval-item-${interval.sequentialNumber}`}
            className={`
              text-white text-xl py-2 border-b border-white/30 text-center
              ${isCurrent ? 'font-bold' : 'font-normal'}
            `}
          >
            {interval.sequentialNumber}. {phaseLabel}: {interval.duration}
          </div>
        );
      })}
    </div>
  );
};
