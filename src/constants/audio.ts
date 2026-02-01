export const AUDIO_CONFIG = {
  BEEP_FREQUENCY: 1000, // Hz - single tone for all phases (US-7)
  BEEP_DURATION: 150, // ms - short and punchy
  BEEP_VOLUME: 0.3, // 30% volume
  FINAL_BEEP_DURATION: 300, // ms - longer for phase transition
  FINAL_BEEP_VOLUME: 0.5, // 50% volume - louder for phase transition
} as const;
