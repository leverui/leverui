import type { JSX } from 'solid-js';
import type { Command } from '../src/components/command-exports';

/** Render the same published Command tree for server and client hydration. */
export function renderCommandHydrationTree(components: { Command: typeof Command }): JSX.Element;
