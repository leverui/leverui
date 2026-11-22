import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Tabs } from '../src';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['line', 'subtle', 'enclosed', 'outline', 'plain'] as const;
const orientations = ['horizontal', 'vertical'] as const;
const cases = sizes.flatMap(
  /** Pair each finite size with every standard variant and orientation. */
  (size) =>
    variants.flatMap(
      /** Include both layout directions for one appearance. */
      (variant) =>
        orientations.map(
          /** Pair one appearance with each keyboard and layout direction. */
          (orientation) => ({ size, variant, orientation }),
        ),
    ),
);

interface TabsCase {
  size: (typeof sizes)[number];
  variant: (typeof variants)[number];
  orientation: (typeof orientations)[number];
  fitted?: boolean;
  justify?: 'start' | 'center' | 'end';
  palette?: 'teal';
  id?: string;
}

/** Render one selected Tabs composition with authored CSS. */
function TabsVisualCase(props: TabsCase): JSX.Element {
  return (
    <Tabs.Root
      defaultValue="first"
      size={props.size}
      variant={props.variant}
      orientation={props.orientation}
      fitted={props.fitted}
      justify={props.justify}
      colorPalette={props.palette}
      data-testid={`${props.id ?? `tabs-css-${props.size}-${props.variant}-${props.orientation}`}-authored`}
    >
      <Tabs.List aria-label="Tabs appearance">
        <Tabs.Trigger value="first">First</Tabs.Trigger>
        <Tabs.Trigger value="second">Second</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="first">First panel</Tabs.Content>
      <Tabs.Content value="second">Second panel</Tabs.Content>
    </Tabs.Root>
  );
}

/** Expose every finite appearance and both unstyled paths for browser checks. */
function TabsCssContract(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
        <For each={cases}>
          {
            /** Keep every finite appearance under the same token scope. */
            (selection) => <TabsVisualCase {...selection} />
          }
        </For>
        <TabsVisualCase
          size="md"
          variant="line"
          orientation="horizontal"
          fitted
          justify="center"
          id="tabs-css-fitted"
        />
        <TabsVisualCase
          size="md"
          variant="line"
          orientation="horizontal"
          palette="teal"
          id="tabs-css-teal"
        />
        <Tabs.Root unstyled defaultValue="first" data-testid="tabs-css-unstyled-root">
          <Tabs.List aria-label="Unstyled tabs">
            <Tabs.Trigger value="first">First</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="first">First panel</Tabs.Content>
        </Tabs.Root>
        <Tabs.Root defaultValue="first" data-testid="tabs-css-unstyled-trigger">
          <Tabs.List aria-label="Partially unstyled tabs">
            <Tabs.Trigger value="first" unstyled>
              First
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="first">First panel</Tabs.Content>
        </Tabs.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Internal/Tabs CSS Contract',
  component: TabsCssContract,
} satisfies Meta<typeof TabsCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: TabsCssContract };
