import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Checkmark, Flex, Kbd, Listbox, createListCollection } from '../src';
import { renderExtendedGuide, renderSelectAllGuide } from './listbox-guide-tree';

const components = {
  Box,
  Checkmark,
  Flex,
  Kbd,
  Listbox,
  createListCollection,
};

/** Show the modifier and range-selection example. */
function ExtendedExample() {
  return renderExtendedGuide(components);
}

/** Show the selected, mixed, and cleared header states. */
function SelectAllExample() {
  return renderSelectAllGuide(components);
}

const meta = {
  title: 'Components/Listbox Guide',
  component: ExtendedExample,
} satisfies Meta<typeof ExtendedExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Extended: Story = { render: ExtendedExample };
export const SelectAll: Story = { render: SelectAllExample };
