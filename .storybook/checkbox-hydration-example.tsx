import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxGroup,
  CheckboxLabel,
  CheckboxRoot,
  CheckboxRootProvider,
  useCheckbox,
} from '../src';
import { renderCheckboxHydrationTree } from './checkbox-hydration-tree';

/** Attach the Checkbox tree to the published server markup. */
export function hydrateCheckboxExample(target: HTMLElement): void {
  /** Mark completion after Solid mounts the hydrated tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree inside Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderCheckboxHydrationTree({
      CheckboxControl,
      CheckboxHiddenInput,
      CheckboxIndicator,
      CheckboxGroup,
      CheckboxLabel,
      CheckboxRoot,
      CheckboxRootProvider,
      useCheckbox,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
