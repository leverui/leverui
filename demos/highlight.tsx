import type { Demo, DemoMeta } from './demo-types';
import {
  HighlightBasic,
  HighlightMultiple,
  HighlightSearchQuery,
  HighlightWithCustomStyle,
} from './examples/highlight-standard';
import { HighlightWithSquiggle } from './examples/highlight-squiggle';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: HighlightBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: HighlightBasic };
export const Multiple: Story = {
  render: HighlightMultiple,
  parameters: {
    guide: {
      description: 'Pass an array of strings to the `query` prop to highlight multiple substrings.',
    },
  },
};
export const CustomStyle: Story = {
  name: 'CustomStyle',
  render: HighlightWithCustomStyle,
  parameters: {
    guide: {
      description: 'Use the `markStyle` prop to customize the style of the highlighted text.',
    },
  },
};
export const SearchQuery: Story = {
  name: 'SearchQuery',
  render: HighlightSearchQuery,
  parameters: {
    guide: { description: 'Use the highlight component to highlight search query results.' },
  },
};
export const Squiggle: Story = {
  render: HighlightWithSquiggle,
  parameters: {
    guide: {
      description:
        "Here's an example of how to render a custom squiggle image around the highlighted text. Useful for a more fancy effect.",
    },
  },
};
