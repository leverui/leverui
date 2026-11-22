import { type JSX } from '@solidjs/web';
import type { Demo, DemoMeta } from './demo-types';
import { HeartIcon } from '@lucide/solid';
import { AbsoluteCenter, Box, For, HStack, Span, Spinner, Text, VStack } from '../src';
import './absolute-center-examples.css';

/** Apply the story's inset to one Lever UI example. */
function ExampleFrame(props: { children: JSX.Element }): JSX.Element {
  return <Box class="absolute-center-gallery-frame">{props.children}</Box>;
}

/** Show the basic centered surface used in the story. */
function AbsoluteCenterBasic(): JSX.Element {
  return (
    <ExampleFrame>
      <Box class="absolute-center-gallery-panel absolute-center-gallery-panel--basic">
        <AbsoluteCenter>
          <Box class="absolute-center-gallery-content">Centered content</Box>
        </AbsoluteCenter>
      </Box>
    </ExampleFrame>
  );
}

/** Choose horizontal, vertical, or both (default) with the axis prop. */
function AbsoluteCenterWithAxis(): JSX.Element {
  return (
    <ExampleFrame>
      <VStack gap="6" align="stretch">
        <For each={['horizontal', 'vertical', 'both'] as const}>
          {
            /** Render the panel for one axis. */
            (axis) => (
              <VStack gap="2">
                <Text class="absolute-center-gallery-label">{`<AbsoluteCenter axis="${axis}" />`}</Text>
                <Box class="absolute-center-gallery-panel absolute-center-gallery-panel--axis">
                  <AbsoluteCenter axis={axis}>
                    <Box class="absolute-center-gallery-axis-content">{axis}</Box>
                  </AbsoluteCenter>
                </Box>
              </VStack>
            )
          }
        </For>
      </VStack>
    </ExampleFrame>
  );
}

/** Center an icon badge; the same pattern works for status indicators. */
function AbsoluteCenterWithContent(): JSX.Element {
  return (
    <ExampleFrame>
      <Box class="absolute-center-gallery-panel absolute-center-gallery-panel--heart">
        <AbsoluteCenter>
          <Box class="absolute-center-gallery-heart">
            <HeartIcon />
          </Box>
        </AbsoluteCenter>
      </Box>
    </ExampleFrame>
  );
}

/** Center loading feedback over existing content. */
function AbsoluteCenterWithOverlay(): JSX.Element {
  return (
    <ExampleFrame>
      <Box class="absolute-center-gallery-panel absolute-center-gallery-panel--overlay">
        <Box class="absolute-center-gallery-dimmed" aria-busy="true">
          Your recent orders will show here.
        </Box>
        <AbsoluteCenter class="absolute-center-gallery-overlay">
          <HStack gap="3">
            <Spinner size="sm" colorPalette="blue" />
            <Text class="absolute-center-gallery-loading">Loading...</Text>
          </HStack>
        </AbsoluteCenter>
      </Box>
    </ExampleFrame>
  );
}

/** Use the same axis options in right-to-left layouts. */
function AbsoluteCenterWithRtl(): JSX.Element {
  return (
    <ExampleFrame>
      <VStack gap="6" align="stretch">
        <For each={['horizontal', 'vertical', 'both'] as const}>
          {
            /** Render one right-to-left panel. */
            (axis) => (
              <VStack gap="2" dir="rtl">
                <Text class="absolute-center-gallery-label">RTL ({axis})</Text>
                <Box class="absolute-center-gallery-panel absolute-center-gallery-panel--rtl">
                  <AbsoluteCenter axis={axis}>
                    <HStack gap="2" class="absolute-center-gallery-rtl-content">
                      <Span>البداية</Span>
                    </HStack>
                  </AbsoluteCenter>
                </Box>
              </VStack>
            )
          }
        </For>
      </VStack>
    </ExampleFrame>
  );
}

export const meta = {
  component: AbsoluteCenterBasic,
  parameters: { guide: { selfPadded: true } },
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: AbsoluteCenterBasic };
export const WithAxis: Story = {
  name: 'WithAxis',
  render: AbsoluteCenterWithAxis,
  parameters: {
    guide: {
      description:
        'Control which axis to center on using the axis prop. Options are horizontal, vertical, or both (default).',
    },
  },
};
export const WithContent: Story = {
  name: 'WithContent',
  render: AbsoluteCenterWithContent,
  parameters: {
    guide: {
      description: 'Use AbsoluteCenter with content such as icons, badges, and status indicators.',
    },
  },
};
export const WithOverlay: Story = {
  name: 'WithOverlay',
  render: AbsoluteCenterWithOverlay,
  parameters: {
    guide: {
      description: 'Create a loading overlay or modal-like content centered over existing content.',
    },
  },
};
export const WithRtl: Story = {
  name: 'WithRtl',
  render: AbsoluteCenterWithRtl,
  parameters: {
    guide: {
      description: 'AbsoluteCenter also centers content in right-to-left layouts.',
    },
  },
};
