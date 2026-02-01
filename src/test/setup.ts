import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Audio API for jsdom environment
const mockOscillator = {
  type: 'sine',
  frequency: { setValueAtTime: vi.fn() },
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  disconnect: vi.fn(),
};

const mockGainNode = {
  gain: {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
  connect: vi.fn(),
  disconnect: vi.fn(),
};

const mockAudioContext = {
  state: 'running',
  currentTime: 0,
  createOscillator: vi.fn(() => ({ ...mockOscillator })),
  createGain: vi.fn(() => ({ ...mockGainNode })),
  destination: {},
  resume: vi.fn(),
};

// @ts-expect-error - Mocking browser API
window.AudioContext = vi.fn(function() {
  return { ...mockAudioContext };
});
// @ts-expect-error - Mocking browser API
window.webkitAudioContext = vi.fn(function() {
  return { ...mockAudioContext };
});
