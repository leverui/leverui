import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Button, CloseButton, IconButton } from '../index';

/** Keep default Button compositions native without a styling provider. */
function verifiesProviderFreeActions(): void {
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');

  /** Render three default action forms with authored CSS selectors. */
  function Example(): JSX.Element {
    return (
      <>
        <Button size={size()} variant="outline" colorPalette="blue">
          Save
        </Button>
        <IconButton aria-label="Options">⋯</IconButton>
        <CloseButton />
      </>
    );
  }

  render(Example);
  const button = screen.getByRole('button', { name: 'Save' });
  const icon = screen.getByRole('button', { name: 'Options' });
  const close = screen.getByRole('button', { name: 'Close' });
  expect([...button.classList]).toEqual(['lui-button']);
  expect(button.getAttribute('data-size')).toBe('sm');
  expect(button.getAttribute('data-variant')).toBe('outline');
  expect(button.getAttribute('data-lui-color-palette')).toBe('blue');
  expect(icon.classList.contains('lui-icon-button')).toBe(true);
  expect(close.classList.contains('lui-close-button')).toBe(true);

  setSize('lg');
  flush();
  expect(screen.getByRole('button', { name: 'Save' })).toBe(button);
  expect(button.getAttribute('data-size')).toBe('lg');
}

it(
  'renders Button, IconButton, and CloseButton without a styling provider',
  verifiesProviderFreeActions,
);
