import { useEffect, useRef } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { useRandomExercises } from '../../hooks/useRandomExercises';
import { useAudio } from '../../hooks/useAudio';
import { AUDIO_CONFIG } from '../../constants/audio';

export const Timer = () => {
  const { phase, remainingTime, start, currentInterval } = useTimer();
  const { playBeep } = useAudio();
  const prevPhaseRef = useRef(phase);

  // Determine which exercise to display based on the phase:
  // - prepare: show exercise 1 (first exercise)
  // - work: show exercise for current interval
  // - rest: show exercise for next interval (preview what's coming)
  const exerciseInterval = phase === 'prepare' ? 1 : phase === 'rest' ? currentInterval + 1 : currentInterval;
  const exercise = useRandomExercises(exerciseInterval);

  useEffect(() => {
    start();
  }, [start]);

  // Play countdown beeps at 3, 2, 1 seconds
  useEffect(() => {
    if ([3, 2, 1].includes(remainingTime)) {
      playBeep(AUDIO_CONFIG.BEEP_FREQUENCY, AUDIO_CONFIG.BEEP_DURATION);
    }
  }, [remainingTime, playBeep]);

  // Play final beep on phase transition (longer and louder)
  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      playBeep(
        AUDIO_CONFIG.BEEP_FREQUENCY,
        AUDIO_CONFIG.FINAL_BEEP_DURATION,
        AUDIO_CONFIG.FINAL_BEEP_VOLUME
      );
      prevPhaseRef.current = phase;
    }
  }, [phase, playBeep]);

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
        <div data-testid="exercise-display" className="text-4xl font-medium uppercase mb-8">
          {exercise}
        </div>
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
