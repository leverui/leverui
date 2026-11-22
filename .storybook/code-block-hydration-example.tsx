import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  CodeBlockCode,
  CodeBlockCodeText,
  CodeBlockCollapseTrigger,
  CodeBlockContent,
  CodeBlockPropsProvider,
  CodeBlockRoot,
} from '../dist/index.js';
import { renderCodeBlockHydrationTree } from './code-block-hydration-tree';

/** Attach Code Block behavior to its server-rendered native nodes. */
export function hydrateCodeBlockExample(target: HTMLElement): void {
  /** Mark the host only after Solid has hydrated the tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared block inside the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderCodeBlockHydrationTree({
      CodeBlockRoot,
      CodeBlockContent,
      CodeBlockCode,
      CodeBlockCodeText,
      CodeBlockCollapseTrigger,
      CodeBlockPropsProvider,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
