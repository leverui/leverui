import { type JSX } from '@solidjs/web';
import {
  Button,
  Dialog,
  HStack,
  Kbd,
  Listbox,
  Portal,
  Span,
  useFilter,
  useListCollection,
} from '../src';
import { renderListboxDialog } from './listbox-dialog-tree';

const components = {
  Button,
  Dialog,
  HStack,
  Kbd,
  Listbox,
  Portal,
  Span,
  useFilter,
  useListCollection,
};

/** Render the mounted guide composition from the shared Dialog tree. */
export function DialogListboxExample(props: { gallery?: boolean } = {}): JSX.Element {
  return renderListboxDialog(components, props.gallery ? { gallery: true } : {});
}
