import { useRef, useCallback } from 'react';
import { AUDIO_CONFIG } from '../constants/audio';

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeep = useCallback((frequency: number, duration: number, volume: number = AUDIO_CONFIG.BEEP_VOLUME) => {
    try {
      // Create or reuse AudioContext
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as Window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }

      const audioCtx = audioContextRef.current;

      // Resume context if suspended (browser autoplay policy)
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Create gain node for volume control
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      gainNode.connect(audioCtx.destination);

      // Create and configure oscillator
      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      oscillator.connect(gainNode);

      // Play beep for specified duration
      const durationInSeconds = duration / 1000;
      oscillator.start(audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + durationInSeconds);
      oscillator.stop(audioCtx.currentTime + durationInSeconds);
    } catch (error) {
      // Gracefully degrade - app still works without audio
      console.warn('Audio playback failed:', error);
    }
  }, []);

  return { playBeep };
};
