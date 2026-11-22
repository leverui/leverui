import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  ListboxBasic,
  ListboxControlled,
  ListboxDisabledItem,
  ListboxStore,
} from './examples/listbox-gallery-selection';
import {
  ListboxCheckmark,
  ListboxExtendedSelect,
  ListboxGrouped,
  ListboxMultiselect,
} from './examples/listbox-gallery-collections';
import { ListboxSelectAll } from './examples/listbox-gallery-select-all';
import {
  ListboxDescription,
  ListboxHorizontal,
  ListboxIcon,
} from './examples/listbox-gallery-presentations';
import { ListboxInput, ListboxKeyboardPriority } from './examples/listbox-gallery-inputs';
import { ListboxPopover } from './examples/listbox-gallery-popover';
import { ListboxDialog } from './examples/listbox-gallery-dialog';
import { ListboxVirtualized } from './examples/listbox-gallery-virtualized';
import { ListboxImageExplorer } from './examples/listbox-gallery-image-explorer';
import { ListboxTransferList } from './examples/listbox-gallery-transfer';
import { ListboxEmojiGrid } from './examples/listbox-gallery-emoji';
import { guide } from './listbox-guide-copy';

export const meta = {
  component: ListboxBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { name: 'Basic', render: ListboxBasic };
export const Controlled: Story = {
  name: 'Controlled',
  render: ListboxControlled,
  parameters: guide.controlled,
};
export const DisabledItem: Story = {
  name: 'DisabledItem',
  render: ListboxDisabledItem,
  parameters: guide.disabledItem,
};
export const ExtendedSelect: Story = {
  name: 'ExtendedSelect',
  render: ListboxExtendedSelect,
  parameters: guide.extendedSelect,
};
export const Grouped: Story = {
  name: 'Grouped',
  render: ListboxGrouped,
  parameters: guide.grouped,
};
export const Horizontal: Story = {
  name: 'Horizontal',
  render: ListboxHorizontal,
  parameters: guide.horizontal,
};
export const ImageExplorer: Story = {
  name: 'ImageExplorer',
  render: ListboxImageExplorer,
  parameters: guide.imageExplorer,
};
export const Multiselect: Story = {
  name: 'Multiselect',
  render: ListboxMultiselect,
  parameters: guide.multiselect,
};
export const SelectAll: Story = {
  name: 'SelectAll',
  render: ListboxSelectAll,
  parameters: guide.selectAll,
};
export const TransferList: Story = {
  name: 'TransferList',
  render: ListboxTransferList,
  parameters: guide.transferList,
};
export const Virtualized: Story = {
  name: 'Virtualized',
  render: ListboxVirtualized,
  parameters: guide.virtualized,
};
export const Checkmark: Story = {
  name: 'Checkmark',
  render: ListboxCheckmark,
  parameters: guide.checkmark,
};
export const Description: Story = {
  name: 'Description',
  render: ListboxDescription,
  parameters: guide.description,
};
export const Dialog: Story = {
  name: 'Dialog',
  render: ListboxDialog,
  parameters: guide.dialog,
};
export const EmojiGrid: Story = {
  name: 'EmojiGrid',
  render: ListboxEmojiGrid,
  parameters: guide.emojiGrid,
};
export const Icon: Story = { name: 'Icon', render: ListboxIcon, parameters: guide.icon };
export const Input: Story = {
  name: 'Input',
  render: ListboxInput,
  parameters: guide.input,
};
export const KeyboardPriority: Story = {
  name: 'KeyboardPriority',
  render: ListboxKeyboardPriority,
  parameters: guide.keyboardPriority,
};
export const Popover: Story = {
  name: 'Popover',
  render: ListboxPopover,
  parameters: guide.popover,
};
export const Store: Story = {
  name: 'Store',
  render: ListboxStore,
  parameters: guide.store,
};
