import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Tabs } from '../src';

const variants = {
  base: 'subtle',
  sm: 'plain',
  md: 'subtle',
  lg: 'plain',
  xl: 'subtle',
  '2xl': 'plain',
} as const;

/** Render the reversible subtle and plain pair through authored CSS. */
function VariantCase(): JSX.Element {
  return (
    <Tabs.Root defaultValue="first" variant={variants} data-testid="tabs-variant-authored">
      <Tabs.List aria-label="Responsive surface tabs">
        <Tabs.Trigger value="first">First</Tabs.Trigger>
        <Tabs.Trigger value="second">Second</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="first">First panel</Tabs.Content>
      <Tabs.Content value="second">Second panel</Tabs.Content>
    </Tabs.Root>
  );
}

/** Exercise all five variants at successive authored breakpoints. */
function EveryVariantCase(): JSX.Element {
  return (
    <Tabs.Root
      defaultValue="first"
      variant={{
        base: 'line',
        sm: 'outline',
        md: 'enclosed',
        lg: 'subtle',
        xl: 'plain',
        '2xl': 'line',
      }}
      data-testid="tabs-variant-all"
    >
      <Tabs.List aria-label="All responsive variants">
        <Tabs.Trigger value="first">First</Tabs.Trigger>
        <Tabs.Trigger value="second">Second</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="first">First panel</Tabs.Content>
    </Tabs.Root>
  );
}

/** Keep a live responsive selection on the same native root. */
function ReactiveCase(): JSX.Element {
  const [plain, setPlain] = createSignal(false);

  /** Reverse the current surface selection without replacing the tab root. */
  function toggleVariant(): void {
    setPlain(!plain());
  }

  return (
    <>
      <button data-testid="tabs-variant-toggle" onClick={toggleVariant}>
        Change variant
      </button>
      <Tabs.Root
        defaultValue="first"
        variant={plain() ? { base: 'plain', md: 'subtle' } : { base: 'subtle', md: 'plain' }}
        data-testid="tabs-variant-reactive"
      >
        <Tabs.List aria-label="Reactive surface tabs">
          <Tabs.Trigger value="first" data-testid="tabs-variant-reactive-trigger">
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

/** Render every responsive selection under the same token scope. */
function ResponsiveVariantContract(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
        <VariantCase />
        <EveryVariantCase />
        <ReactiveCase />
      </div>
    </>
  );
}

const meta = {
  title: 'Internal/Tabs Responsive Variant',
  component: ResponsiveVariantContract,
} satisfies Meta<typeof ResponsiveVariantContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: ResponsiveVariantContract };
