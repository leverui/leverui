import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  StepsCompletedContent,
  StepsContent,
  StepsIndicator,
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsRoot,
  StepsTrigger,
} from '../dist/index.js';
import { renderStepsHydrationTree } from './steps-hydration-tree';

/** Attach the published client Steps entry to its server-rendered nodes. */
export function hydrateStepsExample(target: HTMLElement): void {
  /** Mark the existing host after Solid attaches its owner. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same tree used by the server entry. */
  function renderExample(): JSX.Element {
    const tree = renderStepsHydrationTree({
      StepsCompletedContent,
      StepsContent,
      StepsIndicator,
      StepsItem,
      StepsList,
      StepsNextTrigger,
      StepsRoot,
      StepsTrigger,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
