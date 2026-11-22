import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Demo, DemoMeta } from './demo-types';
import { Box, Flex, Spacer as LeverUISpacer } from '../src';
import { withComponentInset } from './examples/example-frame';
import './flex-examples.css';

/** Arrange three patterned boxes in a horizontal flex row. */
function FlexBasic(): JSX.Element {
  return (
    <Flex class="flex-example-gap-4">
      <Box class="flex-example-pattern" />
      <Box class="flex-example-pattern" />
      <Box class="flex-example-pattern" />
    </Flex>
  );
}

/** Vertically center boxes of different heights. */
function FlexWithAlign(): JSX.Element {
  return (
    <Flex class="flex-example-gap-4" align="center">
      <Box class="flex-example-pattern flex-example-pattern--short" />
      <Box class="flex-example-pattern flex-example-pattern--medium" />
      <Box class="flex-example-pattern" />
    </Flex>
  );
}

/** Push the final box aside with automatic logical margin. */
function FlexWithAutoMargin(): JSX.Element {
  return (
    <Flex class="flex-example-gap-4" justify="space-between">
      <Box class="flex-example-pattern flex-example-pattern--width-40" />
      <Box class="flex-example-pattern flex-example-pattern--width-40 flex-example-pattern--margin-end" />
      <Box class="flex-example-pattern flex-example-pattern--width-40" />
    </Flex>
  );
}

/** Stack flex items vertically while preserving the gap. */
function FlexWithDirection(): JSX.Element {
  return (
    <Flex class="flex-example-gap-4" direction="column">
      <Box class="flex-example-pattern" />
      <Box class="flex-example-pattern" />
      <Box class="flex-example-pattern" />
    </Flex>
  );
}

/** Compare the four horizontal justification modes. */
function FlexWithJustify(): JSX.Element {
  return (
    <Flex direction="column" class="flex-example-gap-8">
      <For each={['flex-start', 'center', 'flex-end', 'space-between'] as const}>
        {/** Render one justification row. */}
        {(justify) => (
          <Flex class="flex-example-gap-4" justify={justify}>
            <Box class="flex-example-pattern flex-example-pattern--width-120" />
            <Box class="flex-example-pattern flex-example-pattern--width-120">{justify}</Box>
            <Box class="flex-example-pattern flex-example-pattern--width-120" />
          </Flex>
        )}
      </For>
    </Flex>
  );
}

/** Show visual order independently of source order. */
function FlexWithOrder(): JSX.Element {
  return (
    <Flex class="flex-example-gap-4">
      <Box class="flex-example-pattern flex-example-pattern--order-1">1</Box>
      <Box class="flex-example-pattern flex-example-pattern--order-3">2</Box>
      <Box class="flex-example-pattern flex-example-pattern--order-2">3</Box>
    </Flex>
  );
}

/** Separate two colored boxes with a flexible spacer. */
function FlexWithSpacer(): JSX.Element {
  return (
    <Flex>
      <Box class="flex-example-box flex-example-box--red">Box 1</Box>
      <LeverUISpacer />
      <Box class="flex-example-box flex-example-box--green">Box 2</Box>
    </Flex>
  );
}

/** Wrap fixed-width patterned boxes onto another line. */
function FlexWithWrap(): JSX.Element {
  return (
    <Flex class="flex-example-gap-4 flex-example-max-width" wrap="wrap">
      <Box class="flex-example-pattern flex-example-pattern--width-200" />
      <Box class="flex-example-pattern flex-example-pattern--width-200" />
      <Box class="flex-example-pattern flex-example-pattern--width-200" />
    </Flex>
  );
}

export const meta = {
  component: FlexBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = {
  render: FlexBasic,
};
export const Align: Story = {
  render: FlexWithAlign,
  parameters: {
    guide: {
      description: 'Use `align` to position children on the cross axis.',
    },
  },
};
export const AutoMargin: Story = {
  name: 'AutoMargin',
  render: FlexWithAutoMargin,
  parameters: {
    guide: {
      description: 'Push a flex item away from its siblings with auto margin.',
    },
  },
};
export const Direction: Story = {
  render: FlexWithDirection,
  parameters: {
    guide: {
      description: 'Use `direction` to change the flex direction.',
    },
  },
};
export const Justify: Story = {
  render: FlexWithJustify,
  parameters: {
    guide: {
      description: 'Use `justify` to align children on the main axis.',
    },
  },
};
export const Order: Story = {
  render: FlexWithOrder,
  parameters: {
    guide: {
      description: 'Use CSS `order` to change the visual order of children.',
    },
  },
};
export const Spacer: Story = {
  render: FlexWithSpacer,
  parameters: {
    guide: {
      description: 'Use `Spacer` to fill space between two flex items.',
    },
  },
};
export const Wrap: Story = {
  render: FlexWithWrap,
  parameters: {
    guide: {
      description: 'Use `wrap` when children should move to another line.',
    },
  },
};
