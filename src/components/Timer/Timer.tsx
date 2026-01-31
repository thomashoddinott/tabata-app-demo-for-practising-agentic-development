import { useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';

export const Timer = () => {
  const { phase, remainingTime, start } = useTimer();

  useEffect(() => {
    start();
  }, [start]);

  const phaseColors = {
    prepare: 'bg-prepare',
    work: 'bg-work',
    rest: 'bg-prepare',
  };

  const phaseLabels = {
    prepare: 'Prepare',
    work: 'Work',
    rest: 'Rest',
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${phaseColors[phase]}`}>
      <div className="text-white text-center">
        <h1 className="text-5xl font-light mb-8">
          {phaseLabels[phase]}
        </h1>
        <div className="text-9xl font-bold">
          {remainingTime}
        </div>
      </div>
    </div>
  );
};
