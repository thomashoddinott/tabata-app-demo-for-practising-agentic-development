import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntervalList } from './IntervalList';
import type { IntervalItem } from '../../types/timer';

describe('IntervalList', () => {
  const mockIntervals: IntervalItem[] = [
    { sequentialNumber: 1, phase: 'prepare', duration: 5, workInterval: null },
    { sequentialNumber: 2, phase: 'work', duration: 60, workInterval: 1 },
    { sequentialNumber: 3, phase: 'rest', duration: 10, workInterval: 1 },
    { sequentialNumber: 4, phase: 'work', duration: 60, workInterval: 2 },
    { sequentialNumber: 5, phase: 'rest', duration: 10, workInterval: 2 },
    { sequentialNumber: 6, phase: 'work', duration: 60, workInterval: 3 },
  ];

  it('should render all provided intervals', () => {
    render(<IntervalList intervals={mockIntervals} currentSequentialNumber={1} />);

    const list = screen.getByTestId('interval-list');
    expect(list).toBeInTheDocument();

    // Should have 6 interval items
    expect(screen.getByTestId('interval-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('interval-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('interval-item-3')).toBeInTheDocument();
    expect(screen.getByTestId('interval-item-4')).toBeInTheDocument();
    expect(screen.getByTestId('interval-item-5')).toBeInTheDocument();
    expect(screen.getByTestId('interval-item-6')).toBeInTheDocument();
  });

  it('should display interval in correct format "N. Phase: Duration"', () => {
    render(<IntervalList intervals={mockIntervals} currentSequentialNumber={1} />);

    expect(screen.getByTestId('interval-item-1')).toHaveTextContent('1. Prepare: 5');
    expect(screen.getByTestId('interval-item-2')).toHaveTextContent('2. Work: 60');
    expect(screen.getByTestId('interval-item-3')).toHaveTextContent('3. Rest: 10');
    expect(screen.getByTestId('interval-item-4')).toHaveTextContent('4. Work: 60');
  });

  it('should capitalize phase names correctly', () => {
    render(<IntervalList intervals={mockIntervals} currentSequentialNumber={1} />);

    // Check that phases are capitalized
    expect(screen.getByTestId('interval-item-1')).toHaveTextContent('Prepare');
    expect(screen.getByTestId('interval-item-2')).toHaveTextContent('Work');
    expect(screen.getByTestId('interval-item-3')).toHaveTextContent('Rest');
  });

  it('should apply bold styling to current interval', () => {
    render(<IntervalList intervals={mockIntervals} currentSequentialNumber={2} />);

    const currentInterval = screen.getByTestId('interval-item-2');
    expect(currentInterval).toHaveClass('font-bold');
  });

  it('should not apply bold styling to non-current intervals', () => {
    render(<IntervalList intervals={mockIntervals} currentSequentialNumber={2} />);

    const interval1 = screen.getByTestId('interval-item-1');
    const interval3 = screen.getByTestId('interval-item-3');
    const interval4 = screen.getByTestId('interval-item-4');

    expect(interval1).toHaveClass('font-normal');
    expect(interval3).toHaveClass('font-normal');
    expect(interval4).toHaveClass('font-normal');
  });

  it('should show divider lines between intervals', () => {
    render(<IntervalList intervals={mockIntervals} currentSequentialNumber={1} />);

    const intervals = screen.getAllByTestId(/^interval-item-/);

    // Each interval should have a border-b class for dividers
    intervals.forEach(interval => {
      expect(interval).toHaveClass('border-b');
    });
  });

  it('should be scrollable', () => {
    render(<IntervalList intervals={mockIntervals} currentSequentialNumber={1} />);

    const list = screen.getByTestId('interval-list');
    expect(list).toHaveClass('overflow-y-auto');
  });

  it('should use white text color', () => {
    render(<IntervalList intervals={mockIntervals} currentSequentialNumber={1} />);

    const intervals = screen.getAllByTestId(/^interval-item-/);

    intervals.forEach(interval => {
      expect(interval).toHaveClass('text-white');
    });
  });

  it('should handle empty intervals array', () => {
    render(<IntervalList intervals={[]} currentSequentialNumber={1} />);

    const list = screen.getByTestId('interval-list');
    expect(list).toBeInTheDocument();

    // Should not have any interval items
    const intervals = screen.queryAllByTestId(/^interval-item-/);
    expect(intervals).toHaveLength(0);
  });
});
