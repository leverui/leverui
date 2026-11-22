import { type JSX } from '@solidjs/web';
import {
  Center,
  Flex,
  IconButton,
  Listbox,
  VisuallyHidden,
  VStack,
  createListCollection,
} from '../src';
import { renderListboxTransferTree } from './listbox-transfer-tree';

/** Render the interactive guide example from current Lever UI source. */
export function ListboxTransferExample(): JSX.Element {
  return renderListboxTransferTree({
    Center,
    Flex,
    IconButton,
    Listbox,
    VisuallyHidden,
    VStack,
    createListCollection,
  });
}
