import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { PasswordInput, PasswordStrengthMeter } from '../dist/index.js';
import { renderPasswordHydrationTree } from './password-input-hydration-tree';

/** Attach Password Input and Strength Meter to published server markup. */
export function hydratePasswordInputExample(target: HTMLElement): void {
  /** Signal that the browser has attached to the existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree inside Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderPasswordHydrationTree({ PasswordInput, PasswordStrengthMeter });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
