import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  FloatingPanelBody,
  FloatingPanelCloseTrigger,
  FloatingPanelContent,
  FloatingPanelHeader,
  FloatingPanelPositioner,
  FloatingPanelRoot,
  FloatingPanelTitle,
  FloatingPanelTrigger,
  Portal,
} from '../src';
import { renderFloatingPanelHydrationTree } from './floating-panel-hydration-tree';

/** Attach the Floating Panel client tree to published server markup. */
export function hydrateFloatingPanelExample(target: HTMLElement, initialOpen = false): void {
  /** Mark hydration after Solid attaches to the existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree in Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderFloatingPanelHydrationTree(
      {
        FloatingPanelBody,
        FloatingPanelCloseTrigger,
        FloatingPanelContent,
        FloatingPanelHeader,
        FloatingPanelPositioner,
        FloatingPanelRoot,
        FloatingPanelTitle,
        FloatingPanelTrigger,
        Portal,
      },
      initialOpen,
    );
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
