import { type JSX } from '@solidjs/web';
import type { Demo, DemoMeta } from './demo-types';
import { Bleed, Box, Heading, Stack, Text } from '../src';
import { withLayoutInset } from './examples/example-frame';
import './bleed-examples.css';

/** Compare the same card without and with Bleed, so the change is visible. */
function BleedBasic(): JSX.Element {
  return (
    <div class="bleed-gallery-compare">
      <Box class="bleed-gallery-card bleed-gallery-card--wide">
        <Box class="bleed-gallery-pattern bleed-gallery-pattern--tall">Banner</Box>
        <Stack class="bleed-gallery-copy">
          <Heading size="md">Without Bleed</Heading>
          <Text>The banner stays inside the card's padding, like the text.</Text>
        </Stack>
      </Box>
      <Box class="bleed-gallery-card bleed-gallery-card--wide">
        <Bleed inline="10">
          <Box class="bleed-gallery-pattern bleed-gallery-pattern--tall">Banner</Box>
        </Bleed>
        <Stack class="bleed-gallery-copy">
          <Heading size="md">With Bleed</Heading>
          <Text>The banner runs past the padding to both edges. The text stays put.</Text>
        </Stack>
      </Box>
    </div>
  );
}

/** Use the block prop to extend a surface beyond vertical padding. */
function BleedVertical(): JSX.Element {
  return (
    <Box class="bleed-gallery-card bleed-gallery-card--wide">
      <Bleed block="10">
        <Box class="bleed-gallery-pattern bleed-gallery-pattern--tall">Bleed</Box>
      </Bleed>
    </Box>
  );
}

/** Use inlineStart, inlineEnd, blockStart, and blockEnd for one-sided bleed. */
function BleedWithDirection(): JSX.Element {
  return (
    <Stack gap="8">
      <Box class="bleed-gallery-card bleed-gallery-card--narrow">
        <Bleed inlineStart="8">
          <Box class="bleed-gallery-pattern bleed-gallery-pattern--short">inlineStart</Box>
        </Bleed>
      </Box>
      <Box class="bleed-gallery-card bleed-gallery-card--narrow">
        <Bleed inlineEnd="8">
          <Box class="bleed-gallery-pattern bleed-gallery-pattern--short">inlineEnd</Box>
        </Bleed>
      </Box>
      <Box class="bleed-gallery-card bleed-gallery-card--narrow">
        <Bleed blockStart="8">
          <Box class="bleed-gallery-pattern bleed-gallery-pattern--short">blockStart</Box>
        </Bleed>
      </Box>
      <Box class="bleed-gallery-card bleed-gallery-card--narrow">
        <Bleed blockEnd="8">
          <Box class="bleed-gallery-pattern bleed-gallery-pattern--short">blockEnd</Box>
        </Bleed>
      </Box>
    </Stack>
  );
}

export const meta = {
  component: BleedBasic,
  decorators: [withLayoutInset],
  parameters: { guide: { outerInset: true } },
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: BleedBasic };
export const Vertical: Story = {
  render: BleedVertical,
  parameters: {
    guide: {
      description: 'Use the `block` prop to make the element bleed vertically.',
    },
  },
};
export const Direction: Story = {
  render: BleedWithDirection,
  parameters: {
    guide: {
      description:
        'Use the `inlineStart`, `inlineEnd`, `blockStart`, and `blockEnd` props to make the element bleed in a specific direction.',
    },
  },
};
