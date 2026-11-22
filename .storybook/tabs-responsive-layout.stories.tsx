import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Tabs } from '../src';

const fitted = { base: false, sm: true, md: true, lg: true, xl: true, '2xl': true } as const;
const reversalFitted = {
  base: true,
  sm: false,
  md: true,
  lg: false,
  xl: true,
  '2xl': false,
} as const;
const justify = {
  base: 'start',
  sm: 'center',
  md: 'end',
  lg: 'start',
  xl: 'center',
  '2xl': 'end',
} as const;
type Variant = 'line' | 'subtle' | 'enclosed';
const reactiveFitted = { base: false, md: true } as const;
const reactiveJustify = { base: 'end', md: 'center' } as const;

/** Change layout props without replacing the primitive tab elements. */
function ReactiveLayout(): JSX.Element {
  const [changed, setChanged] = createSignal(false);

  /** Toggle the CSS choices while leaving the machine mounted. */
  function toggleLayout(): void {
    setChanged(!changed());
  }

  return (
    <>
      <button type="button" data-testid="tabs-layout-toggle" onClick={toggleLayout}>
        Toggle layout
      </button>
      <Tabs.Root
        defaultValue="first"
        fitted={changed() ? reactiveFitted : true}
        justify={changed() ? reactiveJustify : 'start'}
        data-testid="tabs-layout-reactive"
      >
        <Tabs.List aria-label="Reactive layout">
          <Tabs.Trigger value="first" data-testid="tabs-layout-reactive-trigger">
            First
          </Tabs.Trigger>
          <Tabs.Trigger value="second">Second</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="first">First panel</Tabs.Content>
        <Tabs.Content value="second">Second panel</Tabs.Content>
      </Tabs.Root>
    </>
  );
}

/** Render one variant with responsive fitted and alignment choices. */
function LayoutCase(props: { variant: Variant }): JSX.Element {
  return (
    <Tabs.Root
      defaultValue="first"
      fitted={fitted}
      justify={justify}
      variant={props.variant}
      data-testid={`tabs-layout-${props.variant}-authored`}
    >
      <Tabs.List aria-label={`${props.variant} layout`}>
        <Tabs.Trigger value="first">First</Tabs.Trigger>
        <Tabs.Trigger value="second">Second</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="first">First panel</Tabs.Content>
      <Tabs.Content value="second">Second panel</Tabs.Content>
    </Tabs.Root>
  );
}

/** Keep every layout choice under the same token and viewport conditions. */
function ResponsiveLayoutContract(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '24px', padding: '24px' }}>
        <LayoutCase variant="line" />
        <LayoutCase variant="subtle" />
        <LayoutCase variant="enclosed" />
        <Tabs.Root
          defaultValue="first"
          fitted={reversalFitted}
          variant="subtle"
          data-testid="tabs-layout-reversal"
        >
          <Tabs.List aria-label="Reversible layout">
            <Tabs.Trigger value="first">First</Tabs.Trigger>
            <Tabs.Trigger value="second">Second</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="first">First panel</Tabs.Content>
          <Tabs.Content value="second">Second panel</Tabs.Content>
        </Tabs.Root>
        <ReactiveLayout />
      </div>
    </>
  );
}

const meta = {
  title: 'Internal/Tabs Responsive Layout',
  component: ResponsiveLayoutContract,
} satisfies Meta<typeof ResponsiveLayoutContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: ResponsiveLayoutContract };
