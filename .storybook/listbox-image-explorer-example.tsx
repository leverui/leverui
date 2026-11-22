import { type JSX } from '@solidjs/web';
import { Box, Flex, Image, Listbox, Text, VisuallyHidden, createListCollection } from '../src';
import { renderImageExplorerTree } from './listbox-image-explorer-tree';

const components = {
  Box,
  Flex,
  Image,
  Listbox,
  Text,
  VisuallyHidden,
  createListCollection,
};

/** Mount the controlled image explorer from source package exports. */
export function ListboxImageExplorerExample(): JSX.Element {
  return renderImageExplorerTree(components);
}
