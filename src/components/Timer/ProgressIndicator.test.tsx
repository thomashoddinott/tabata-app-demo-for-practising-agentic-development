import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressIndicator } from './ProgressIndicator';

describe('ProgressIndicator', () => {
  it('should display progress in X/Y format', () => {
    render(<ProgressIndicator current={1} total={8} />);

    const indicator = screen.getByTestId('progress-indicator');
    expect(indicator).toHaveTextContent('1/8');
  });

  it('should show correct values when props update', () => {
    const { rerender } = render(<ProgressIndicator current={1} total={8} />);

    expect(screen.getByTestId('progress-indicator')).toHaveTextContent('1/8');

    rerender(<ProgressIndicator current={3} total={8} />);
    expect(screen.getByTestId('progress-indicator')).toHaveTextContent('3/8');

    rerender(<ProgressIndicator current={8} total={8} />);
    expect(screen.getByTestId('progress-indicator')).toHaveTextContent('8/8');
  });

  it('should use white text styling', () => {
    render(<ProgressIndicator current={1} total={8} />);

    const indicator = screen.getByTestId('progress-indicator');
    expect(indicator).toHaveClass('text-white');
  });

  it('should be centered', () => {
    render(<ProgressIndicator current={1} total={8} />);

    const indicator = screen.getByTestId('progress-indicator');
    expect(indicator).toHaveClass('text-center');
  });

  it('should handle zero progress', () => {
    render(<ProgressIndicator current={0} total={8} />);

    expect(screen.getByTestId('progress-indicator')).toHaveTextContent('0/8');
  });
});
