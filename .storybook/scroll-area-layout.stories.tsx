import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { LocaleProvider, ScrollArea } from '../src';

const rows = Array.from(
  { length: 24 },
  /** Give every row stable text and an accessible index. */
  (_, index) => `Scrollable item ${index + 1}`,
);
const rtlRows = Array.from(
  { length: 16 },
  /** Keep Arabic text in a wide, two-direction scrolling surface. */
  (_, index) => `العنصر ${index + 1}: منطقة تمرير تدعم الاتجاه من اليمين إلى اليسار`,
);

/** Render enough rows to expose native vertical overflow. */
function BasicArea(): JSX.Element {
  return (
    <>
      <ScrollArea.Root style={{ height: '10rem', width: '20rem' }} data-testid="scroll-root">
        <ScrollArea.Viewport data-testid="scroll-viewport">
          <ScrollArea.Content>
            <For each={rows}>
              {/** Keep every row present in the scrollable content. */}
              {(row) => <p>{row}</p>}
            </For>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar data-testid="scrollbar" />
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </>
  );
}

const meta = {
  title: 'Components/Scroll Area Layout',
  component: BasicArea,
} satisfies Meta<typeof BasicArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: BasicArea };

/** Change CSS choices without remounting the machine. */
function ReactiveVariants(): JSX.Element {
  const [variant, setVariant] = createSignal<'hover' | 'always'>('hover');
  const [size, setSize] = createSignal<'xs' | 'lg'>('xs');

  /** Show the persistent scrollbar variant. */
  function showScrollbar(): void {
    setVariant('always');
  }

  /** Increase the authored scrollbar thickness. */
  function enlargeScrollbar(): void {
    setSize('lg');
  }

  return (
    <>
      <button type="button" onClick={showScrollbar}>
        Always visible
      </button>
      <button type="button" onClick={enlargeScrollbar}>
        Large scrollbar
      </button>
      <ScrollArea.Root
        style={{ height: '9rem', width: '20rem' }}
        variant={variant()}
        size={size()}
        data-testid="variant-root"
      >
        <ScrollArea.Viewport data-testid="variant-viewport">
          <ScrollArea.Content>
            <For each={rows}>
              {/** Reuse the visible rows across reactive CSS choices. */}
              {(row) => <p>{row}</p>}
            </For>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar data-testid="variant-scrollbar" />
      </ScrollArea.Root>
    </>
  );
}

export const Variants: Story = { render: ReactiveVariants };

/** Render a horizontal overflow path with a default thumb. */
function HorizontalArea(): JSX.Element {
  return (
    <>
      <ScrollArea.Root style={{ width: '20rem', height: '7rem' }} size="xs" variant="always">
        <ScrollArea.Viewport data-testid="horizontal-viewport">
          <ScrollArea.Content>
            <div style={{ width: '60rem', height: '5rem' }}>Wide horizontal content</div>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" data-testid="horizontal-scrollbar" />
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </>
  );
}

export const Horizontal: Story = { render: HorizontalArea };

/** Render both scrollbar directions and their shared corner. */
function BothDirectionsArea(): JSX.Element {
  return (
    <>
      <ScrollArea.Root style={{ width: '18rem', height: '9rem' }} variant="always" size="sm">
        <ScrollArea.Viewport data-testid="both-viewport">
          <ScrollArea.Content>
            <div style={{ width: '48rem', height: '36rem' }}>Two-direction content</div>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" data-testid="vertical-scrollbar" />
        <ScrollArea.Scrollbar orientation="horizontal" data-testid="horizontal-scrollbar" />
        <ScrollArea.Corner data-testid="scroll-corner" />
      </ScrollArea.Root>
    </>
  );
}

export const BothDirections: Story = { render: BothDirectionsArea };

/** Read RTL direction from the nearest locale context. */
function RtlArea(): JSX.Element {
  return (
    <>
      <LocaleProvider locale="ar-AE">
        <ScrollArea.Root
          style={{ width: '20rem', height: '8rem' }}
          variant="always"
          data-testid="rtl-root"
        >
          <ScrollArea.Viewport data-testid="rtl-viewport">
            <ScrollArea.Content>
              <div style={{ width: '48rem', height: '24rem' }}>
                <For each={rtlRows}>
                  {/** Keep Arabic rows in the native bidirectional surface. */}
                  {(row) => <p>{row}</p>}
                </For>
              </div>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar data-testid="rtl-scrollbar" />
          <ScrollArea.Scrollbar orientation="horizontal" data-testid="rtl-horizontal-scrollbar" />
          <ScrollArea.Corner />
        </ScrollArea.Root>
      </LocaleProvider>
    </>
  );
}

export const Rtl: Story = { render: RtlArea };

/** Keep the primitive scrolling while suppressing Lever UI's default presentation. */
function UnstyledArea(): JSX.Element {
  return (
    <ScrollArea.Root
      class="custom-scroll-area"
      style={{ width: '20rem', height: '8rem' }}
      unstyled
      data-testid="unstyled-root"
    >
      <ScrollArea.Viewport style={{ height: '100%' }} data-testid="unstyled-viewport">
        <ScrollArea.Content>
          <div style={{ height: '30rem' }}>Unstyled scroll content</div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar data-testid="unstyled-scrollbar" />
    </ScrollArea.Root>
  );
}

export const Unstyled: Story = { render: UnstyledArea };
