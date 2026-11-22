import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ScrollArea } from '../src';

const sizes = ['xs', 'sm', 'md', 'lg'] as const;
const rows = Array.from(
  { length: 12 },
  /** Give each visual state the same overflowing content. */
  (_, index) => `Visual row ${index + 1}`,
);

/** Render the four size variants side by side. */
function SizeMatrix(): JSX.Element {
  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        <For each={sizes}>
          {/** Keep each size on an independent machine root. */}
          {(size) => (
            <ScrollArea.Root
              size={size}
              variant="always"
              style={{ width: '10rem', height: '8rem' }}
              data-testid={`size-${size}-root`}
            >
              <ScrollArea.Viewport data-testid={`size-${size}-viewport`}>
                <ScrollArea.Content>
                  <For each={rows}>
                    {/** Repeat stable rows for comparable thumb measurements. */}
                    {(row) => <p>{row}</p>}
                  </For>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar data-testid={`size-${size}-scrollbar`} />
            </ScrollArea.Root>
          )}
        </For>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Scroll Area Visual',
  component: SizeMatrix,
} satisfies Meta<typeof SizeMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = { render: SizeMatrix };

/** Change both authored CSS choices at the medium breakpoint. */
function ResponsiveArea(): JSX.Element {
  return (
    <>
      <ScrollArea.Root
        style={{ width: '20rem', height: '10rem' }}
        size={{ base: 'xs', md: 'lg' }}
        variant={{ base: 'hover', md: 'always' }}
        data-testid="responsive-scroll-root"
      >
        <ScrollArea.Viewport>
          <ScrollArea.Content>
            <For each={rows}>
              {/** Keep content mounted while media conditions change. */}
              {(row) => <p>{row}</p>}
            </For>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar data-testid="responsive-scrollbar" />
      </ScrollArea.Root>
    </>
  );
}

export const Responsive: Story = { render: ResponsiveArea };
