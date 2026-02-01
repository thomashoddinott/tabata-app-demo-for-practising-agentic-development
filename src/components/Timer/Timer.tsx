import { useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { useRandomExercises } from '../../hooks/useRandomExercises';

export const Timer = () => {
  const { phase, remainingTime, start } = useTimer();
  const exercise = useRandomExercises();

  useEffect(() => {
    start();
  }, [start]);

  const showExercise = phase === 'prepare' || phase === 'rest';

  const phaseColors = {
    prepare: 'bg-prepare',
    work: 'bg-work',
    rest: 'bg-rest',
  };

  const phaseLabels = {
    prepare: 'Prepare',
    work: 'Work',
    rest: 'Rest',
  };

  return (
    <div
      data-testid="timer-container"
      className={`min-h-screen flex flex-col items-center justify-center ${phaseColors[phase]}`}
    >
      <div className="text-white text-center">
        {showExercise && (
          <div data-testid="exercise-display" className="text-4xl font-medium uppercase mb-8">
            {exercise}
          </div>
        )}
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
