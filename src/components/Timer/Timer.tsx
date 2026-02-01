import { useEffect, useRef, useMemo } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { useRandomExercises } from '../../hooks/useRandomExercises';
import { AUDIO_CONFIG } from '../../constants/audio';
import { TABATA_CONFIG, type TabataConfig } from '../../constants/tabata';
import { IntervalList } from './IntervalList';
import { ProgressIndicator } from './ProgressIndicator';
import { buildSessionIntervals, getCurrentSequentialNumber } from '../../utils/sessionBuilder';

type TimerProps = {
  readonly playBeep: (frequency: number, duration: number, volume?: number) => void;
  readonly config?: TabataConfig;
  readonly isDebugMode?: boolean;
};

export const Timer = ({ playBeep, config = TABATA_CONFIG, isDebugMode = false }: TimerProps) => {
  const { phase, remainingTime, start, currentInterval } = useTimer({ config });
  const prevPhaseRef = useRef(phase);

  // Determine which exercise to display based on the phase:
  // - prepare: show exercise 1 (first exercise)
  // - work: show exercise for current interval
  // - rest: show exercise for next interval (preview what's coming)
  const exerciseInterval = phase === 'prepare' ? 1 : phase === 'rest' ? currentInterval + 1 : currentInterval;
  const exercise = useRandomExercises(exerciseInterval, config);

  useEffect(() => {
    start();
  }, [start]);

  // Play countdown beeps at 3, 2, 1 seconds
  useEffect(() => {
    if ([3, 2, 1].includes(remainingTime)) {
      // Determine frequency based on current phase (US-8)
      const frequency = phase === 'work' ? AUDIO_CONFIG.WORK_FREQUENCY : AUDIO_CONFIG.PREPARE_FREQUENCY;
      playBeep(frequency, AUDIO_CONFIG.BEEP_DURATION);
    }
  }, [remainingTime, playBeep, phase]);

  // Play final beep on phase transition (longer and louder)
  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      // Use the frequency of the phase we're transitioning FROM
      const previousPhase = prevPhaseRef.current;
      const frequency = previousPhase === 'work'
        ? AUDIO_CONFIG.WORK_FREQUENCY
        : AUDIO_CONFIG.PREPARE_FREQUENCY;

      playBeep(
        frequency,
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

  // Build session structure once
  const allIntervals = useMemo(() => buildSessionIntervals(config), [config]);

  // Calculate current position in session
  const currentSequentialNumber = getCurrentSequentialNumber(phase, currentInterval);

  // Get visible intervals (current + next 5)
  const visibleIntervals = useMemo(() => {
    const startIndex = currentSequentialNumber - 1;
    return allIntervals.slice(startIndex, startIndex + 6);
  }, [allIntervals, currentSequentialNumber]);

  return (
    <div
      data-testid="timer-container"
      className={`min-h-screen flex flex-col ${phaseColors[phase]}`}
    >
      {/* Debug mode indicator */}
      {isDebugMode && (
        <div className="absolute top-4 right-4 text-2xl" title="Debug Mode">
          🔧
        </div>
      )}
      {/* Top section - countdown display */}
      <div className="flex-1 flex items-center justify-center">
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

      {/* Bottom section - interval list and progress */}
      <div className="pb-8">
        <IntervalList
          intervals={visibleIntervals}
          currentSequentialNumber={currentSequentialNumber}
        />
        <ProgressIndicator
          current={phase === 'prepare' ? 0 : currentInterval}
          total={config.TOTAL_INTERVALS}
        />
      </div>
    </div>
  );
};
