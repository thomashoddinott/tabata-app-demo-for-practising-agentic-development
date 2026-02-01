import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, renderHook } from '@testing-library/react';
import { Timer } from './Timer';
import * as useRandomExercisesModule from '../../hooks/useRandomExercises';
import { resetExerciseList } from '../../hooks/useRandomExercises';
import { useAudio } from '../../hooks/useAudio';

// Mock the constants modules with test-specific values (independent of production constants)
vi.mock('../../constants/exercises', () => ({
  EXERCISES: [
    'Push-ups',
    'Squats',
    'Burpees',
    'Lunges',
    'Mountain Climbers',
    'Plank',
    'Jumping Jacks',
    'High Knees',
    'Bicycle Crunches',
    'Jump Squats',
  ],
}));

// Import the mocked EXERCISES to use in assertions
import { EXERCISES } from '../../constants/exercises';

vi.mock('../../constants/tabata', () => ({
  TABATA_CONFIG: {
    PREPARE_DURATION: 5,
    WORK_DURATION: 5,
    REST_DURATION: 5,
    TOTAL_INTERVALS: 10,
  },
  DEBUG_CONFIG: {
    PREPARE_DURATION: 3,
    WORK_DURATION: 3,
    REST_DURATION: 3,
    TOTAL_INTERVALS: 10,
  },
}));

import { DEBUG_CONFIG, TABATA_CONFIG } from '../../constants/tabata';

vi.mock('../../constants/audio', () => ({
  AUDIO_CONFIG: {
    PREPARE_FREQUENCY: 800,
    WORK_FREQUENCY: 1200,
    BEEP_DURATION: 150,
    BEEP_VOLUME: 0.3,
    FINAL_BEEP_DURATION: 300,
    FINAL_BEEP_VOLUME: 0.5,
  },
}));

describe('Timer', () => {
  const mockPlayBeep = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    resetExerciseList(); // Reset exercise list before each test
    mockPlayBeep.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    resetExerciseList(); // Clean up after each test
  });

  it('should display initial prepare phase with 5 seconds', () => {
    render(<Timer playBeep={mockPlayBeep} />);

    expect(screen.getByText('Prepare')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should countdown when started', () => {
    render(<Timer playBeep={mockPlayBeep} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should transition to work phase after prepare completes', () => {
    render(<Timer playBeep={mockPlayBeep} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display blue background during prepare phase', () => {
    render(<Timer playBeep={mockPlayBeep} />);

    const container = screen.getByTestId('timer-container');
    expect(container).toHaveClass('bg-prepare');
  });

  it('should display red background during work phase', () => {
    render(<Timer playBeep={mockPlayBeep} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const container = screen.getByTestId('timer-container');
    expect(container).toHaveClass('bg-work');
  });

  it('should display green background during rest phase', () => {
    render(<Timer playBeep={mockPlayBeep} />);

    // Advance through prepare (5s) and work (5s) to get to rest
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    const container = screen.getByTestId('timer-container');
    expect(container).toHaveClass('bg-rest');
  });

  describe('Exercise Display', () => {
    it('should display exercise during prepare phase', () => {
      vi.spyOn(useRandomExercisesModule, 'useRandomExercises').mockReturnValue('Burpees');

      render(<Timer playBeep={mockPlayBeep} />);

      const exerciseDisplay = screen.getByTestId('exercise-display');
      expect(exerciseDisplay).toBeInTheDocument();
      expect(exerciseDisplay).toHaveTextContent('Burpees');
    });

    it('should display exercise during rest phase', () => {
      vi.spyOn(useRandomExercisesModule, 'useRandomExercises').mockReturnValue('Push-ups');

      render(<Timer playBeep={mockPlayBeep} />);

      // Advance through prepare (5s) and work (5s) to get to rest
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      const exerciseDisplay = screen.getByTestId('exercise-display');
      expect(exerciseDisplay).toBeInTheDocument();
      expect(exerciseDisplay).toHaveTextContent('Push-ups');
    });

    it('should display exercise during work phase', () => {
      vi.spyOn(useRandomExercisesModule, 'useRandomExercises').mockReturnValue('Squats');

      render(<Timer playBeep={mockPlayBeep} />);

      // Advance through prepare (5s) to get to work
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      const exerciseDisplay = screen.getByTestId('exercise-display');
      expect(exerciseDisplay).toBeInTheDocument();
      expect(exerciseDisplay).toHaveTextContent('Squats');
    });

    it('should display an exercise from the EXERCISES pool', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      const exerciseDisplay = screen.getByTestId('exercise-display');
      const exerciseText = exerciseDisplay.textContent;

      expect(EXERCISES).toContain(exerciseText);
    });
  });

  describe('US-6: No Exercise Repetition', () => {
    it('should show exercise 1 during prepare and work of interval 1', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      const exerciseDisplay = screen.getByTestId('exercise-display');

      // Prepare phase - should show exercise 1
      const exerciseDuringPrepare = exerciseDisplay.textContent || '';

      // Advance to work phase
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Work phase - should still show exercise 1
      const exerciseDuringWork = exerciseDisplay.textContent || '';

      expect(exerciseDuringPrepare).toBe(exerciseDuringWork);
      expect(EXERCISES).toContain(exerciseDuringPrepare);
    });

    it('should show exercise 2 during rest after interval 1 and during work of interval 2', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      const exerciseDisplay = screen.getByTestId('exercise-display');

      // Skip prepare phase
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Skip work phase
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Now in rest phase - should show exercise 2 (next exercise)
      const exerciseDuringRest = exerciseDisplay.textContent || '';

      // Advance to work phase of interval 2
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Work phase of interval 2 - should still show exercise 2
      const exerciseDuringWork2 = exerciseDisplay.textContent || '';

      expect(exerciseDuringRest).toBe(exerciseDuringWork2);
      expect(EXERCISES).toContain(exerciseDuringRest);
    });

    it('should display different exercises between work intervals', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      const exerciseDisplay = screen.getByTestId('exercise-display');

      // Advance to work phase of interval 1
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      const exercise1 = exerciseDisplay.textContent || '';

      // Advance through work (5s) and rest (5s) to get to work of interval 2
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      const exercise2 = exerciseDisplay.textContent || '';

      // Verify exercises are different
      expect(exercise1).not.toBe(exercise2);
      expect(EXERCISES).toContain(exercise1);
      expect(EXERCISES).toContain(exercise2);
    });

    it('should ensure no consecutive duplicates across multiple intervals', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      const exerciseDisplay = screen.getByTestId('exercise-display');
      const exercisesDuringWork: string[] = [];

      // Advance to work phase of interval 1
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Capture exercises during work phase for first 4 intervals
      for (let i = 0; i < 4; i++) {
        exercisesDuringWork.push(exerciseDisplay.textContent || '');

        // Advance through work (5s) and rest (5s) to next work phase
        act(() => {
          vi.advanceTimersByTime(10000);
        });
      }

      // Verify no consecutive duplicates
      for (let i = 0; i < exercisesDuringWork.length - 1; i++) {
        expect(exercisesDuringWork[i]).not.toBe(exercisesDuringWork[i + 1]);
      }
    });
  });

  describe('US-7 & US-8: Audio Feedback', () => {
    type MockOscillator = {
      type: OscillatorType;
      frequency: { setValueAtTime: ReturnType<typeof vi.fn> };
      connect: ReturnType<typeof vi.fn>;
      start: ReturnType<typeof vi.fn>;
      stop: ReturnType<typeof vi.fn>;
      disconnect: ReturnType<typeof vi.fn>;
    };

    type MockGainNode = {
      gain: {
        setValueAtTime: ReturnType<typeof vi.fn>;
        exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
      };
      connect: ReturnType<typeof vi.fn>;
      disconnect: ReturnType<typeof vi.fn>;
    };

    type MockAudioContext = {
      state: AudioContextState;
      currentTime: number;
      createOscillator: ReturnType<typeof vi.fn>;
      createGain: ReturnType<typeof vi.fn>;
      destination: AudioDestinationNode;
      resume: ReturnType<typeof vi.fn>;
    };

    let mockAudioContext: MockAudioContext;
    let mockOscillator: MockOscillator;
    let mockGainNode: MockGainNode;
    let audioPlayBeep: (frequency: number, duration: number, volume?: number) => void;

    beforeEach(() => {
      // Create fresh audio mocks for each test
      mockOscillator = {
        type: 'sine',
        frequency: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        disconnect: vi.fn(),
      };

      mockGainNode = {
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
        disconnect: vi.fn(),
      };

      mockAudioContext = {
        state: 'running',
        currentTime: 0,
        createOscillator: vi.fn(() => mockOscillator),
        createGain: vi.fn(() => mockGainNode),
        destination: {} as AudioDestinationNode,
        resume: vi.fn(),
      };

      window.AudioContext = vi.fn(function() {
        return mockAudioContext;
      }) as unknown as typeof AudioContext;

      // Create a real playBeep function using useAudio hook
      const { result } = renderHook(() => useAudio());
      audioPlayBeep = result.current.playBeep;
    });

    it('should play beep when countdown reaches 3 seconds during prepare phase', () => {
      render(<Timer playBeep={audioPlayBeep} />);

      // Advance to 3 seconds remaining (from 5 to 3)
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    it('should play beep when countdown reaches 2 seconds', () => {
      render(<Timer playBeep={audioPlayBeep} />);

      // Advance to 2 seconds remaining
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    it('should play beep when countdown reaches 1 second', () => {
      render(<Timer playBeep={audioPlayBeep} />);

      // Advance to 1 second remaining
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    it('should play beep at 0 seconds (phase transition)', () => {
      render(<Timer playBeep={audioPlayBeep} />);

      // Clear previous calls
      mockAudioContext.createOscillator.mockClear();

      // Advance to 0 seconds (phase transition)
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    it('should play beeps during work phase', () => {
      render(<Timer playBeep={audioPlayBeep} />);

      // Advance through prepare phase to work phase
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Clear calls from prepare phase
      mockAudioContext.createOscillator.mockClear();

      // Advance to 3 seconds remaining in work phase
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    it('should play beeps during rest phase', () => {
      render(<Timer playBeep={audioPlayBeep} />);

      // Advance through prepare and work phases to rest
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Clear calls from previous phases
      mockAudioContext.createOscillator.mockClear();

      // Advance to 3 seconds remaining in rest phase
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    it('should play total of 4 beeps per phase (at 3, 2, 1, 0 seconds)', () => {
      render(<Timer playBeep={audioPlayBeep} />);

      // Count beeps during prepare phase
      const initialCallCount = mockAudioContext.createOscillator.mock.calls.length;

      // Advance through entire prepare phase second by second to ensure all effects run
      act(() => {
        vi.advanceTimersByTime(1000); // 4 seconds remaining
      });
      act(() => {
        vi.advanceTimersByTime(1000); // 3 seconds remaining - beep!
      });
      act(() => {
        vi.advanceTimersByTime(1000); // 2 seconds remaining - beep!
      });
      act(() => {
        vi.advanceTimersByTime(1000); // 1 second remaining - beep!
      });
      act(() => {
        vi.advanceTimersByTime(1000); // 0 seconds - phase transition beep!
      });

      const finalCallCount = mockAudioContext.createOscillator.mock.calls.length;
      const beepsPlayed = finalCallCount - initialCallCount;

      // Should have beeps at: 3, 2, 1, 0 = 4 beeps
      expect(beepsPlayed).toBe(4);
    });

    it('should play final beep with louder volume on phase transition', () => {
      render(<Timer playBeep={audioPlayBeep} />);

      // Clear previous calls
      mockGainNode.gain.setValueAtTime.mockClear();

      // Advance to phase transition
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // The most recent call should be the final beep with higher volume (0.5)
      const calls = mockGainNode.gain.setValueAtTime.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toBe(0.5); // FINAL_BEEP_VOLUME
    });

    it('should play final beep with longer duration on phase transition', () => {
      render(<Timer playBeep={audioPlayBeep} />);

      // Clear previous calls
      mockOscillator.stop.mockClear();

      // Advance to phase transition
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // The most recent stop call should use 0.3 seconds (300ms FINAL_BEEP_DURATION)
      const calls = mockOscillator.stop.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toBe(mockAudioContext.currentTime + 0.3);
    });

    describe('US-8: Different Tones for Phase Types', () => {
      it('should use prepare tone frequency during prepare phase countdown', () => {
        render(<Timer playBeep={audioPlayBeep} />);

        // Clear previous calls
        mockOscillator.frequency.setValueAtTime.mockClear();

        // Advance to 3 seconds remaining in prepare phase
        act(() => {
          vi.advanceTimersByTime(2000);
        });

        // Should use prepare frequency (800Hz)
        expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
          800,
          mockAudioContext.currentTime
        );
      });

      it('should use work tone frequency during work phase countdown', () => {
        render(<Timer playBeep={audioPlayBeep} />);

        // Advance through prepare phase to work phase
        act(() => {
          vi.advanceTimersByTime(5000);
        });

        // Clear previous calls
        mockOscillator.frequency.setValueAtTime.mockClear();

        // Advance to 3 seconds remaining in work phase
        act(() => {
          vi.advanceTimersByTime(2000);
        });

        // Should use work frequency (1200Hz)
        expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
          1200,
          mockAudioContext.currentTime
        );
      });

      it('should use rest tone frequency during rest phase countdown', () => {
        render(<Timer playBeep={audioPlayBeep} />);

        // Advance through prepare and work phases to rest
        act(() => {
          vi.advanceTimersByTime(10000);
        });

        // Clear previous calls
        mockOscillator.frequency.setValueAtTime.mockClear();

        // Advance to 3 seconds remaining in rest phase
        act(() => {
          vi.advanceTimersByTime(2000);
        });

        // Should use rest frequency (800Hz, same as prepare)
        expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
          800,
          mockAudioContext.currentTime
        );
      });

      it('should use prepare tone for phase transition beep from prepare to work', () => {
        render(<Timer playBeep={audioPlayBeep} />);

        // Clear previous calls
        mockOscillator.frequency.setValueAtTime.mockClear();

        // Advance to phase transition (end of prepare)
        act(() => {
          vi.advanceTimersByTime(5000);
        });

        // Should use prepare frequency for the transition beep
        expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
          800,
          mockAudioContext.currentTime
        );
      });

      it('should use work tone for phase transition beep from work to rest', () => {
        render(<Timer playBeep={audioPlayBeep} />);

        // Advance to end of prepare phase
        act(() => {
          vi.advanceTimersByTime(5000);
        });

        // Clear previous calls
        mockOscillator.frequency.setValueAtTime.mockClear();

        // Advance to end of work phase (transition to rest)
        act(() => {
          vi.advanceTimersByTime(5000);
        });

        // Should use work frequency for the transition beep
        expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
          1200,
          mockAudioContext.currentTime
        );
      });
    });
  });

  describe('US-9/10: Session Progress and Upcoming Intervals', () => {
    it('should display interval list at bottom of screen', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      const intervalList = screen.getByTestId('interval-list');
      expect(intervalList).toBeInTheDocument();
    });

    it('should show current interval + next 5 intervals (6 total visible)', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      // During prepare phase (sequential #1), should show intervals 1-6
      expect(screen.getByTestId('interval-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('interval-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('interval-item-3')).toBeInTheDocument();
      expect(screen.getByTestId('interval-item-4')).toBeInTheDocument();
      expect(screen.getByTestId('interval-item-5')).toBeInTheDocument();
      expect(screen.getByTestId('interval-item-6')).toBeInTheDocument();

      // Should not show interval 7 yet
      expect(screen.queryByTestId('interval-item-7')).not.toBeInTheDocument();
    });

    it('should highlight current interval in bold', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      // During prepare phase, interval 1 should be bold
      const interval1 = screen.getByTestId('interval-item-1');
      expect(interval1).toHaveClass('font-bold');

      // Other intervals should not be bold
      const interval2 = screen.getByTestId('interval-item-2');
      expect(interval2).toHaveClass('font-normal');
    });

    it('should display progress indicator below interval list', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      const progressIndicator = screen.getByTestId('progress-indicator');
      expect(progressIndicator).toBeInTheDocument();
    });

    it('should show 0/10 progress during prepare phase', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      const progressIndicator = screen.getByTestId('progress-indicator');
      expect(progressIndicator).toHaveTextContent('0/10');
    });

    it('should show 1/10 progress during first work interval', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      // Advance through prepare (5s) to first work interval
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      const progressIndicator = screen.getByTestId('progress-indicator');
      expect(progressIndicator).toHaveTextContent('1/10');
    });

    it('should show 2/10 progress during second work interval', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      // Advance through prepare (5s) + work (5s) + rest (5s) to second work interval
      act(() => {
        vi.advanceTimersByTime(15000);
      });

      const progressIndicator = screen.getByTestId('progress-indicator');
      expect(progressIndicator).toHaveTextContent('2/10');
    });

    it('should update visible intervals as session progresses', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      // Start: prepare phase, showing intervals 1-6
      expect(screen.getByTestId('interval-item-1')).toBeInTheDocument();
      expect(screen.queryByTestId('interval-item-7')).not.toBeInTheDocument();

      // Advance through prepare (5s) to work interval 1 (sequential #2)
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Now showing intervals 2-7
      expect(screen.queryByTestId('interval-item-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('interval-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('interval-item-7')).toBeInTheDocument();

      // Current interval (2) should be bold
      const interval2 = screen.getByTestId('interval-item-2');
      expect(interval2).toHaveClass('font-bold');
    });

    it('should display intervals in correct format "N. Phase: Duration"', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      // Check first few intervals
      expect(screen.getByTestId('interval-item-1')).toHaveTextContent('1. Prepare: 5');
      expect(screen.getByTestId('interval-item-2')).toHaveTextContent('2. Work: 5');
      expect(screen.getByTestId('interval-item-3')).toHaveTextContent('3. Rest: 5');
    });

    it('should update highlighted interval when transitioning to rest phase', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      // Advance through prepare (5s) and work (5s) to rest (sequential #3)
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Interval 3 (rest) should now be bold
      const interval3 = screen.getByTestId('interval-item-3');
      expect(interval3).toHaveClass('font-bold');
      expect(interval3).toHaveTextContent('3. Rest: 5');

      // Interval 4 (next work) should not be bold
      const interval4 = screen.getByTestId('interval-item-4');
      expect(interval4).toHaveClass('font-normal');
    });

    it('should show correct progress during rest phase', () => {
      render(<Timer playBeep={mockPlayBeep} />);

      // Advance through prepare (5s) and work (5s) to rest
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // During rest after interval 1, should still show 1/10
      const progressIndicator = screen.getByTestId('progress-indicator');
      expect(progressIndicator).toHaveTextContent('1/10');
    });
  });

  describe('Debug Mode Indicator', () => {
    it('should show wrench emoji when debug mode is active', () => {
      render(<Timer playBeep={mockPlayBeep} config={DEBUG_CONFIG} isDebugMode={true} />);

      const wrenchEmoji = screen.getByTitle('Debug Mode');
      expect(wrenchEmoji).toBeInTheDocument();
      expect(wrenchEmoji).toHaveTextContent('🔧');
    });

    it('should not show wrench emoji when debug mode is inactive', () => {
      render(<Timer playBeep={mockPlayBeep} config={TABATA_CONFIG} isDebugMode={false} />);

      const wrenchEmoji = screen.queryByTitle('Debug Mode');
      expect(wrenchEmoji).not.toBeInTheDocument();
    });
  });
});
