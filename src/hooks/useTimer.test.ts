import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  it('should initialize with the provided remaining time', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 10 }));
    
    expect(result.current.remainingTime).toBe(10);
  });
});
