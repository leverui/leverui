import { type JSX } from '@solidjs/web';
import { Input, Listbox, Text, createListCollection, useFilter, useListCollection } from '../src';
import { renderFilterTree, renderKeyboardPriorityTree } from './listbox-input-tree';

const components = {
  Input,
  Listbox,
  Text,
  createListCollection,
  useFilter,
  useListCollection,
};

/** Mount the filterable guide tree from source exports. */
export function ListboxFilterExample(): JSX.Element {
  return renderFilterTree(components);
}

/** Mount the navigation-priority guide tree from source exports. */
export function ListboxKeyboardPriorityExample(): JSX.Element {
  return renderKeyboardPriorityTree(components);
}
