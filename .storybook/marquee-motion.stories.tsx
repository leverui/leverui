import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Marquee, useMarquee } from '../src';
import './marquee-example.css';

const items = ['Alpha', 'Beta', 'Gamma'];

/** Show orientation, reverse animation, and a finite loop setting. */
function VerticalMarquee(): JSX.Element {
  const [loops, setLoops] = createSignal(0);
  const [complete, setComplete] = createSignal(false);

  /** Count an iteration reported by the first animated content copy. */
  function recordLoop(): void {
    setLoops((count) => count + 1);
  }

  /** Record completion of the configured finite loop count. */
  function recordComplete(): void {
    setComplete(true);
  }

  return (
    <>
      <div style={{ padding: '60px' }}>
        <Marquee.Root
          side="bottom"
          reverse
          speed={120}
          loopCount={3}
          onLoopComplete={recordLoop}
          onComplete={recordComplete}
          spacing="12px"
          style={{ height: '240px', width: '260px' }}
          data-testid="marquee-vertical-root"
        >
          <Marquee.Edge side="top" data-testid="marquee-top-edge" />
          <Marquee.Viewport data-testid="marquee-vertical-viewport">
            <Marquee.Content data-testid="marquee-vertical-content">
              <For each={items}>
                {
                  /** Keep each label visible in the vertical specimen. */
                  (label) => (
                    <Marquee.Item data-testid="marquee-vertical-item">
                      <span>{label}</span>
                    </Marquee.Item>
                  )
                }
              </For>
            </Marquee.Content>
          </Marquee.Viewport>
        </Marquee.Root>
        <output data-testid="marquee-loop-count">{loops()}</output>
        <output data-testid="marquee-complete">{complete() ? 'complete' : 'running'}</output>
      </div>
    </>
  );
}

/** Show the primitive's content duplication when auto-fill measures extra space. */
function AutoFillMarquee(): JSX.Element {
  return (
    <>
      <div style={{ padding: '60px' }}>
        <Marquee.Root autoFill class="marquee-example-fill-root" data-testid="marquee-fill-root">
          <Marquee.Viewport>
            <Marquee.Content data-testid="marquee-fill-content">
              <Marquee.Item style={{ width: '60px' }}>Small</Marquee.Item>
            </Marquee.Content>
          </Marquee.Viewport>
        </Marquee.Root>
      </div>
    </>
  );
}

/** Show responsive duplication through a caller-owned Marquee machine. */
function StoreAutoFillMarquee(): JSX.Element {
  const machine = useMarquee({ autoFill: true });
  return (
    <>
      <div style={{ padding: '60px' }}>
        <Marquee.RootProvider
          value={machine}
          class="marquee-example-fill-root"
          data-testid="marquee-store-fill-root"
        >
          <Marquee.Viewport>
            <Marquee.Content data-testid="marquee-store-fill-content">
              <Marquee.Item style={{ width: '60px' }}>Small</Marquee.Item>
            </Marquee.Content>
          </Marquee.Viewport>
        </Marquee.RootProvider>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Marquee/Motion',
  component: VerticalMarquee,
} satisfies Meta<typeof VerticalMarquee>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Vertical: Story = {};
export const AutoFill: Story = { render: AutoFillMarquee };
export const StoreAutoFill: Story = { render: StoreAutoFillMarquee };
