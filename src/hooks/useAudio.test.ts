import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAudio } from './useAudio';

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

describe('useAudio', () => {
  let mockOscillator: MockOscillator;
  let mockGainNode: MockGainNode;
  let mockAudioContext: MockAudioContext;

  beforeEach(() => {
    // Create fresh mocks for each test
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return playBeep function', () => {
    const { result } = renderHook(() => useAudio());

    expect(result.current.playBeep).toBeDefined();
    expect(typeof result.current.playBeep).toBe('function');
  });

  it('should create AudioContext when playBeep is called', () => {
    const { result } = renderHook(() => useAudio());

    result.current.playBeep(1000, 150);

    expect(window.AudioContext).toHaveBeenCalled();
  });

  it('should create oscillator with correct frequency', () => {
    const { result } = renderHook(() => useAudio());

    result.current.playBeep(800, 150);

    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
      800,
      mockAudioContext.currentTime
    );
  });

  it('should create and connect gain node', () => {
    const { result } = renderHook(() => useAudio());

    result.current.playBeep(1000, 150);

    expect(mockAudioContext.createGain).toHaveBeenCalled();
    expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
  });

  it('should set gain volume correctly', () => {
    const { result } = renderHook(() => useAudio());

    result.current.playBeep(1000, 150);

    expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(
      expect.any(Number),
      mockAudioContext.currentTime
    );
  });

  it('should connect oscillator to gain node', () => {
    const { result } = renderHook(() => useAudio());

    result.current.playBeep(1000, 150);

    expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
  });

  it('should start and stop oscillator', () => {
    const { result } = renderHook(() => useAudio());

    result.current.playBeep(1000, 150);

    expect(mockOscillator.start).toHaveBeenCalled();
    expect(mockOscillator.stop).toHaveBeenCalled();
  });

  it('should stop oscillator after specified duration', () => {
    const { result } = renderHook(() => useAudio());

    result.current.playBeep(1000, 200);

    expect(mockOscillator.stop).toHaveBeenCalledWith(
      mockAudioContext.currentTime + 0.2
    );
  });

  it('should resume AudioContext if suspended', () => {
    mockAudioContext.state = 'suspended';
    const { result } = renderHook(() => useAudio());

    result.current.playBeep(1000, 150);

    expect(mockAudioContext.resume).toHaveBeenCalled();
  });

  it('should not resume AudioContext if already running', () => {
    mockAudioContext.state = 'running';
    const { result } = renderHook(() => useAudio());

    result.current.playBeep(1000, 150);

    expect(mockAudioContext.resume).not.toHaveBeenCalled();
  });

  it('should handle AudioContext creation failure gracefully', () => {
    window.AudioContext = vi.fn(function() {
      throw new Error('AudioContext not supported');
    }) as unknown as typeof AudioContext;

    const { result } = renderHook(() => useAudio());

    // Should not throw
    expect(() => result.current.playBeep(1000, 150)).not.toThrow();
  });

  it('should reuse existing AudioContext for multiple beeps', () => {
    const { result } = renderHook(() => useAudio());

    result.current.playBeep(1000, 150);
    result.current.playBeep(1200, 150);

    // AudioContext constructor should only be called once
    expect(window.AudioContext).toHaveBeenCalledTimes(1);
  });
});
