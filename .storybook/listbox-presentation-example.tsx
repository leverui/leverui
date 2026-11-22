import { type JSX } from '@solidjs/web';
import { Box, Checkmark, Listbox, Text, createListCollection } from '../src';
import {
  renderCheckmarkTree,
  renderDescriptionTree,
  renderIconTree,
} from './listbox-presentation-tree';

const components = { Box, Checkmark, Listbox, Text, createListCollection };

/** Mount the shared checkmark tree from source exports in Storybook. */
export function ListboxCheckmarkExample(): JSX.Element {
  return renderCheckmarkTree(components);
}

/** Mount the shared description tree from source exports in Storybook. */
export function ListboxDescriptionExample(): JSX.Element {
  return renderDescriptionTree(components);
}

/** Mount the shared icon tree from source exports in Storybook. */
export function ListboxIconExample(): JSX.Element {
  return renderIconTree(components);
}
