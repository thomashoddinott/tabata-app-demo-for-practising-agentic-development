import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Home } from './Home';

describe('Home', () => {
  it('should render a Start button', () => {
    render(<Home onStart={vi.fn()} onStartDebug={vi.fn()} />);

    const startButton = screen.getByRole('button', { name: /^start$/i });
    expect(startButton).toBeInTheDocument();
  });

  it('should call onStart when Start button is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(<Home onStart={onStart} onStartDebug={vi.fn()} />);

    const startButton = screen.getByRole('button', { name: /^start$/i });
    await user.click(startButton);

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('should render debug start button', () => {
    render(<Home onStart={vi.fn()} onStartDebug={vi.fn()} />);

    const debugButton = screen.getByRole('button', { name: /debug/i });
    expect(debugButton).toBeInTheDocument();
    expect(debugButton).toHaveTextContent('Debug');
  });

  it('should call onStartDebug when debug button is clicked', async () => {
    const user = userEvent.setup();
    const onStartDebug = vi.fn();
    render(<Home onStart={vi.fn()} onStartDebug={onStartDebug} />);

    const debugButton = screen.getByRole('button', { name: /debug/i });
    await user.click(debugButton);

    expect(onStartDebug).toHaveBeenCalledTimes(1);
  });

  it('should have both buttons with same size styling', () => {
    render(<Home onStart={vi.fn()} onStartDebug={vi.fn()} />);

    const startButton = screen.getByRole('button', { name: /^start$/i });
    const debugButton = screen.getByRole('button', { name: /debug/i });

    // Both should have the same size classes
    expect(startButton).toHaveClass('px-8', 'py-4', 'text-2xl');
    expect(debugButton).toHaveClass('px-8', 'py-4', 'text-2xl');
  });
});
