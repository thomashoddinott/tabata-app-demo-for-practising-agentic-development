export const AUDIO_CONFIG = {
  PREPARE_FREQUENCY: 800, // Hz - lower tone for prepare/rest phases (US-8)
  WORK_FREQUENCY: 1200, // Hz - higher tone for work phase (US-8)
  BEEP_DURATION: 150, // ms - short and punchy
  BEEP_VOLUME: 0.3, // 30% volume
  FINAL_BEEP_DURATION: 300, // ms - longer for phase transition
  FINAL_BEEP_VOLUME: 0.5, // 50% volume - louder for phase transition
} as const;
