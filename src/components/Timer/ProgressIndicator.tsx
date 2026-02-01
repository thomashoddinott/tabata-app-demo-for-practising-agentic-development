type ProgressIndicatorProps = {
  readonly current: number;
  readonly total: number;
};

export const ProgressIndicator = ({ current, total }: ProgressIndicatorProps) => {
  return (
    <div
      className="text-white text-2xl font-normal py-4 text-center"
      data-testid="progress-indicator"
    >
      {current}/{total}
    </div>
  );
};
