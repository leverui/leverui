import type { Demo, DemoMeta } from './demo-types';
import { ProseBasic } from './examples/prose-basic';
import { ProseSink } from './examples/prose-sink';
import { ProseWithBlockquote } from './examples/prose-with-blockquote';
import { ProseWithList } from './examples/prose-with-list';
import { ProseWithMarkdown } from './examples/prose-with-markdown';
import { ProseWithSizes } from './examples/prose-with-sizes';
import { ProseWithTable } from './examples/prose-with-table';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: ProseBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: ProseBasic };
export const Sizes: Story = {
  render: ProseWithSizes,
  parameters: guide('Use the `size` prop to change the size of the `Prose` component'),
};
export const Blockquote: Story = {
  render: ProseWithBlockquote,
  parameters: guide(
    'Blockquote elements are styled to match the design language of the `Blockquote` component.',
  ),
};
export const List: Story = {
  render: ProseWithList,
  parameters: guide(
    'List elements are styled to match the design language of the `List` component.',
  ),
};
export const SolidMarkdown: Story = {
  render: ProseWithMarkdown,
  parameters: guide(
    "Here's an example of rendering Markdown content with the `micromark` library.",
  ),
};
export const Table: Story = {
  render: ProseWithTable,
  parameters: guide(
    'The table elements are styled to match the design language of the `Table` component.',
  ),
};
export const Sink: Story = { render: ProseSink };
