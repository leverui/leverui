import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Marquee, useMarquee, useMarqueeContext, type MarqueeRootBaseProps } from '../src';

/** Read the public Solid machine accessor inside a Marquee root. */
function MarqueeStateOutput(): JSX.Element {
  const api = useMarqueeContext();
  return <output data-testid="marquee-state">{api().paused ? 'paused' : 'playing'}</output>;
}

/** Exercise a caller-owned machine and its pause/resume methods. */
function StoreMarquee(): JSX.Element {
  const machine = useMarquee({ defaultPaused: true });

  /** Toggle the machine without replacing its root element. */
  function togglePause(): void {
    machine().togglePause();
  }

  return (
    <>
      <div style={{ padding: '60px', width: '520px' }}>
        <Marquee.RootProvider value={machine} data-testid="marquee-store-root">
          <Marquee.Viewport>
            <Marquee.Content>
              <Marquee.Item>Stored item</Marquee.Item>
            </Marquee.Content>
          </Marquee.Viewport>
          <MarqueeStateOutput />
        </Marquee.RootProvider>
        <button type="button" onClick={togglePause} data-testid="marquee-store-toggle">
          Toggle playback
        </button>
      </div>
    </>
  );
}

/** Exercise reactive inherited machine settings and hover/focus pause. */
function ReactiveMarquee(): JSX.Element {
  const [vertical, setVertical] = createSignal(false);

  /** Supply current direction and spacing to the nested root. */
  function readDefaults(): Partial<MarqueeRootBaseProps> {
    return {
      side: vertical() ? 'top' : 'start',
      spacing: vertical() ? '20px' : '8px',
      pauseOnInteraction: true,
    };
  }

  /** Switch orientation without remounting the Marquee. */
  function switchOrientation(): void {
    /** Invert the caller-owned direction signal. */
    setVertical((value) => !value);
  }

  return (
    <>
      <div style={{ padding: '60px', width: '520px' }}>
        <Marquee.PropsProvider value={readDefaults}>
          <Marquee.Root style={{ height: '160px' }} data-testid="marquee-reactive-root">
            <Marquee.Viewport>
              <Marquee.Content>
                <Marquee.Item>
                  <button type="button" data-testid="marquee-focus-target">
                    Focus item
                  </button>
                </Marquee.Item>
              </Marquee.Content>
            </Marquee.Viewport>
            <MarqueeStateOutput />
          </Marquee.Root>
        </Marquee.PropsProvider>
        <button type="button" onClick={switchOrientation} data-testid="marquee-switch-side">
          Switch side
        </button>
      </div>
    </>
  );
}

/** Exercise a controlled pause signal and primitive's pause-change callback. */
function ControlledMarquee(): JSX.Element {
  const [paused, setPaused] = createSignal(false);

  /** Mirror a machine pause request into caller-owned state. */
  function updatePaused(details: { paused: boolean }): void {
    setPaused(details.paused);
  }

  /** Toggle caller-owned playback without remounting the machine root. */
  function toggleControlled(): void {
    setPaused((value) => !value);
  }

  return (
    <>
      <div style={{ padding: '60px', width: '520px' }}>
        <Marquee.Root
          paused={paused()}
          onPauseChange={updatePaused}
          pauseOnInteraction
          data-testid="marquee-controlled-root"
        >
          <Marquee.Viewport>
            <Marquee.Content>
              <Marquee.Item>Controlled item</Marquee.Item>
            </Marquee.Content>
          </Marquee.Viewport>
          <MarqueeStateOutput />
        </Marquee.Root>
        <button type="button" onClick={toggleControlled} data-testid="marquee-controlled-toggle">
          Toggle controlled playback
        </button>
      </div>
    </>
  );
}

/** Verify a caller-owned native root keeps both refs and focus pause. */
function ChildRootMarquee(): JSX.Element {
  const [refsMatch, setRefsMatch] = createSignal(false);
  let parentElement: Element | undefined;
  let childElement: Element | undefined;

  /** Retain the ref supplied to the public Marquee root. */
  function captureParent(element: Element): void {
    parentElement = element;
    setRefsMatch(parentElement === childElement);
  }

  /** Retain the ref supplied by the caller-owned native section. */
  function captureChild(element: Element): void {
    childElement = element;
    setRefsMatch(parentElement === childElement);
  }

  return (
    <>
      <div style={{ padding: '60px', width: '520px' }}>
        <Marquee.Root
          pauseOnInteraction
          ref={captureParent}
          data-testid="marquee-child-root"
          asChild={
            /** Apply the primitive and Lever UI props to the caller's native section. */
            (getProps) => <section {...getProps({ ref: captureChild })} />
          }
        >
          <Marquee.Viewport>
            <Marquee.Content>
              <Marquee.Item>
                <button type="button" data-testid="marquee-child-focus">
                  Focus item
                </button>
              </Marquee.Item>
            </Marquee.Content>
          </Marquee.Viewport>
        </Marquee.Root>
        <output data-testid="marquee-child-refs">{refsMatch() ? 'matched' : 'missing'}</output>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Marquee/State',
  component: StoreMarquee,
} satisfies Meta<typeof StoreMarquee>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Store: Story = {};
export const Reactive: Story = { render: ReactiveMarquee };
export const Controlled: Story = { render: ControlledMarquee };
export const ChildRoot: Story = { render: ChildRootMarquee };
