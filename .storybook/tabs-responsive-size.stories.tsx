import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Tabs } from '../src';

const size = {
  base: 'sm',
  sm: 'lg',
  md: 'md',
  lg: 'sm',
  xl: 'lg',
  '2xl': 'md',
} as const;

/** Render every responsive size through authored Tabs CSS. */
function ResponsiveSizeCase(): JSX.Element {
  return (
    <>
      <Tabs.Root defaultValue="first" size={size} data-testid="tabs-size-authored">
        <Tabs.List aria-label="Responsive tabs">
          <Tabs.Trigger value="first">First</Tabs.Trigger>
          <Tabs.Trigger value="second">Second</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="first">First panel</Tabs.Content>
        <Tabs.Content value="second">Second panel</Tabs.Content>
      </Tabs.Root>
    </>
  );
}

const meta = {
  title: 'Internal/Tabs Responsive Size',
  component: ResponsiveSizeCase,
} satisfies Meta<typeof ResponsiveSizeCase>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: ResponsiveSizeCase };
