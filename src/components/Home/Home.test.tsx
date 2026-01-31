import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Home } from './Home';

describe('Home', () => {
  it('should render a Start button', () => {
    render(<Home onStart={vi.fn()} />);

    const startButton = screen.getByRole('button', { name: /start/i });
    expect(startButton).toBeInTheDocument();
  });

  it('should call onStart when Start button is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(<Home onStart={onStart} />);

    const startButton = screen.getByRole('button', { name: /start/i });
    await user.click(startButton);

    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
