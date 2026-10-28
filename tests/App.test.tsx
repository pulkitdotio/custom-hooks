import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { hooks, repository } from '../src/examples/catalog';

function navigate(name: string) {
  fireEvent.click(
    within(screen.getByRole('navigation', { name: 'Hooks' })).getByRole(
      'link',
      { name: new RegExp(name) },
    ),
  );
}

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  document.documentElement.dataset.theme = 'dark';
});

describe('playground', () => {
  it('renders the collection and operates every toggle action', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(
      within(screen.getByRole('navigation', { name: 'Hooks' })).getAllByRole(
        'link',
      ),
    ).toHaveLength(10);
    const toggle = screen.getByRole('switch', {
      name: 'Workspace notifications',
    });
    expect(toggle).toBeChecked();
    await user.click(toggle);
    expect(toggle).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Set true' }));
    expect(toggle).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Set false' }));
    expect(toggle).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Toggle value' }));
    expect(toggle).toBeChecked();
  });

  it('filters hooks, handles empty results, and clears search', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Search hooks' });
    await user.type(input, 'counter');
    expect(
      within(screen.getByRole('navigation', { name: 'Hooks' })).getAllByRole(
        'link',
      ),
    ).toHaveLength(1);
    await user.clear(input);
    await user.type(input, 'no-such-hook');
    expect(screen.getByText('No hooks found.')).toBeVisible();
    await user.click(
      screen.getAllByRole('button', { name: 'Clear search' })[0]!,
    );
    expect(
      within(screen.getByRole('navigation', { name: 'Hooks' })).getAllByRole(
        'link',
      ),
    ).toHaveLength(10);
  });

  it('supports direct hash links and previous/next navigation', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/#useCounter');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'useCounter',
    );
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'useToggle',
    );
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Next hook' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'useCounter',
    );
    navigate('useCopyToClipboard');
    expect(screen.getByRole('button', { name: 'Next hook' })).toBeDisabled();
  });

  it('changes and persists the theme', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await user.click(
      screen.getByRole('button', { name: 'Switch to light theme' }),
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(localStorage.getItem('custom-hooks:theme')).toBe('"light"');
    unmount();
    render(<App />);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    await user.click(
      screen.getByRole('button', { name: 'Switch to dark theme' }),
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('operates counter steps and reset', async () => {
    const user = userEvent.setup();
    render(<App />);
    navigate('useCounter');
    await user.selectOptions(screen.getByLabelText('Step amount'), '5');
    await user.click(screen.getByRole('button', { name: 'Increase count' }));
    expect(screen.getByLabelText('Counter value')).toHaveTextContent('5');
    await user.click(screen.getByRole('button', { name: 'Decrease count' }));
    expect(screen.getByLabelText('Counter value')).toHaveTextContent('0');
    await user.click(screen.getByRole('button', { name: 'Increase count' }));
    await user.click(screen.getByRole('button', { name: 'Reset counter' }));
    expect(screen.getByLabelText('Counter value')).toHaveTextContent('0');
  });

  it('shows live input before the actual debounced value', () => {
    vi.useFakeTimers();
    render(<App />);
    navigate('useDebounce');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your search' }), {
      target: { value: 'react' },
    });
    expect(screen.getByLabelText('Live value')).toHaveTextContent('react');
    expect(screen.getByLabelText('Debounced value')).toHaveTextContent('—');
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByLabelText('Debounced value')).toHaveTextContent('react');
  });

  it('persists a note across remounts and removes it on reset', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    navigate('useLocalStorage');
    await user.clear(screen.getByLabelText('A note for later'));
    await user.type(screen.getByLabelText('A note for later'), 'A useful note');
    expect(localStorage.getItem('custom-hooks:demo:note')).toBe(
      '"A useful note"',
    );
    unmount();
    render(<App />);
    expect(screen.getByLabelText('A note for later')).toHaveValue(
      'A useful note',
    );
    await user.click(screen.getByRole('button', { name: 'Reset note' }));
    expect(screen.getByLabelText('A note for later')).toHaveValue(
      'Make something useful.',
    );
    expect(localStorage.getItem('custom-hooks:demo:note')).toBeNull();
  });

  it('displays the media-query fallback and previous values', async () => {
    const user = userEvent.setup();
    render(<App />);
    navigate('useMediaQuery');
    expect(screen.getByLabelText('Media query matches')).toHaveTextContent(
      'false',
    );
    navigate('usePrevious');
    expect(screen.getByLabelText('Previous count')).toHaveTextContent('—');
    await user.click(screen.getByRole('button', { name: 'Update value' }));
    expect(screen.getByLabelText('Previous count')).toHaveTextContent('0');
    expect(screen.getByLabelText('Current count')).toHaveTextContent('1');
  });

  it('opens the dropdown, selects an option, and closes on outside interaction or Escape', async () => {
    const user = userEvent.setup();
    render(<App />);
    navigate('useOnClickOutside');
    await user.click(
      screen.getByRole('button', { name: 'Personal workspace' }),
    );
    await user.click(screen.getByRole('button', { name: 'Side projects' }));
    expect(screen.getByLabelText('Popover state')).toHaveTextContent('closed');
    await user.click(screen.getByRole('button', { name: 'Side projects' }));
    await user.click(screen.getByRole('heading', { level: 1 }));
    expect(screen.getByLabelText('Popover state')).toHaveTextContent('closed');
    const trigger = screen.getByRole('button', { name: 'Side projects' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
    expect(screen.getByLabelText('Popover state')).toHaveTextContent('closed');
  });

  it('listens for real keyboard events and clears the last key', async () => {
    const user = userEvent.setup();
    render(<App />);
    navigate('useEventListener');
    await user.keyboard('k');
    expect(screen.getByLabelText('Last pressed key')).toHaveTextContent('k');
    await user.click(screen.getByRole('button', { name: 'Clear key' }));
    expect(screen.getByLabelText('Last pressed key')).toHaveTextContent('?');
  });

  it('starts, pauses, and resets the real interval hook', () => {
    vi.useFakeTimers();
    render(<App />);
    navigate('useInterval');
    fireEvent.click(screen.getByRole('button', { name: 'Start timer' }));
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByLabelText('Elapsed seconds')).toHaveTextContent('00:02');
    fireEvent.click(screen.getByRole('button', { name: 'Pause timer' }));
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByLabelText('Elapsed seconds')).toHaveTextContent('00:02');
    fireEvent.click(screen.getByRole('button', { name: 'Reset timer' }));
    expect(screen.getByLabelText('Elapsed seconds')).toHaveTextContent('00:00');
  });

  it('copies the usage example through the Clipboard API', async () => {
    const user = userEvent.setup();
    const write = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue(undefined);
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(write).toHaveBeenCalledWith(hooks[0]!.code);
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeVisible();
  });

  it('copies edited text and reports permission failure in the demo', async () => {
    const user = userEvent.setup();
    const write = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('Denied'));
    render(<App />);
    navigate('useCopyToClipboard');
    await user.clear(screen.getByLabelText('Something worth copying'));
    await user.type(
      screen.getByLabelText('Something worth copying'),
      'Hello hooks',
    );
    await user.click(screen.getByRole('button', { name: 'Copy text' }));
    expect(write).toHaveBeenCalledWith('Hello hooks');
    expect(screen.getByLabelText('Copy status')).toHaveTextContent('copied');
    await user.click(screen.getByRole('button', { name: 'Copy text' }));
    expect(screen.getByLabelText('Copy status')).toHaveTextContent('failed');
    expect(screen.getByText(/Allow clipboard access/)).toBeVisible();
  });

  it('links every hook to its own source and documentation', () => {
    render(<App />);
    expect(
      screen.getByRole('link', { name: 'View on GitHub' }),
    ).toHaveAttribute('href', repository);
    for (const hook of hooks) {
      navigate(hook.name);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        hook.name,
      );
      expect(screen.getByRole('link', { name: 'Read docs' })).toHaveAttribute(
        'href',
        `${repository}/blob/main/docs/hooks/${hook.name}.md`,
      );
      expect(
        screen.getByRole('link', { name: 'View hook source' }),
      ).toHaveAttribute(
        'href',
        `${repository}/blob/main/src/hooks/${hook.name}.ts`,
      );
    }
  });
});
