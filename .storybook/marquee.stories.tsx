import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Marquee } from '../src';
import './marquee-example.css';

const items = ['One', 'Two', 'Three'];

/** Show the public Marquee parts, edge fades, and accessible label. */
function MarqueeContractExample(): JSX.Element {
  return (
    <>
      <div style={{ padding: '80px', width: '600px' }}>
        <Marquee.Root
          translations={{ root: 'Featured items' }}
          speed={80}
          spacing="24px"
          data-testid="marquee-root"
        >
          <Marquee.Edge side="start" data-testid="marquee-start-edge" />
          <Marquee.Viewport data-testid="marquee-viewport">
            <Marquee.Content data-testid="marquee-content">
              <For each={items}>
                {
                  /** Keep one semantic item in every primitive-managed content copy. */
                  (label) => (
                    <Marquee.Item data-testid="marquee-item" class="marquee-example-contract-item">
                      <span>{label}</span>
                    </Marquee.Item>
                  )
                }
              </For>
            </Marquee.Content>
          </Marquee.Viewport>
          <Marquee.Edge side="end" data-testid="marquee-end-edge" />
        </Marquee.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Marquee',
  component: MarqueeContractExample,
} satisfies Meta<typeof MarqueeContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
