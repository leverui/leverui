import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Marquee } from '../src';
import './marquee-example.css';

/** Show native style variables and ordinary stylesheet overrides. */
function MarqueeCssOverrides(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '20px', padding: '60px' }}>
        <Marquee.Root
          class="marquee-example-css-width"
          style={{
            '--leverui-marquee-duration': '30s',
            '--leverui-marquee-delay': '5s',
            '--leverui-marquee-loop-count': '4',
            '--leverui-marquee-edge-color': 'rgb(255, 0, 0)',
            '--leverui-marquee-edge-size': '35%',
          }}
          data-testid="marquee-css-root"
        >
          <Marquee.Edge side="start" data-testid="marquee-css-edge" />
          <Marquee.Viewport>
            <Marquee.Content data-testid="marquee-css-content">
              <Marquee.Item>Native style</Marquee.Item>
            </Marquee.Content>
          </Marquee.Viewport>
        </Marquee.Root>
        <Marquee.Root class="consumer-marquee" data-testid="marquee-stylesheet-root">
          <Marquee.Edge side="start" data-testid="marquee-stylesheet-edge" />
          <Marquee.Viewport>
            <Marquee.Content data-testid="marquee-stylesheet-content">
              <Marquee.Item>Stylesheet</Marquee.Item>
            </Marquee.Content>
          </Marquee.Viewport>
        </Marquee.Root>
      </div>
    </>
  );
}

/** Prove native part classes and a single unstyled edge remain independent. */
function MarqueePartHooks(): JSX.Element {
  return (
    <>
      <div style={{ padding: '60px' }}>
        <Marquee.Root class="marquee-css-custom-root" data-testid="marquee-parts-root">
          <Marquee.Edge
            side="start"
            class="marquee-css-custom-edge"
            data-testid="marquee-parts-edge"
          />
          <Marquee.Viewport
            class="marquee-css-custom-viewport"
            data-testid="marquee-parts-viewport"
          >
            <Marquee.Content class="marquee-css-custom-content" data-testid="marquee-parts-content">
              <Marquee.Item class="marquee-css-custom-item" data-testid="marquee-parts-item">
                Part hooks
              </Marquee.Item>
            </Marquee.Content>
          </Marquee.Viewport>
          <Marquee.Edge side="end" unstyled data-testid="marquee-parts-unstyled-edge" />
        </Marquee.Root>
      </div>
    </>
  );
}

/** Keep the primitive semantics and interaction on a root without default presentation. */
function MarqueeUnstyled(): JSX.Element {
  return (
    <>
      <div style={{ padding: '60px' }}>
        <Marquee.Root unstyled pauseOnInteraction data-testid="marquee-unstyled-root">
          <Marquee.Edge side="start" data-testid="marquee-unstyled-edge" />
          <Marquee.Viewport>
            <Marquee.Content data-testid="marquee-unstyled-content">
              <Marquee.Item>Unstyled item</Marquee.Item>
            </Marquee.Content>
          </Marquee.Viewport>
        </Marquee.Root>
      </div>
    </>
  );
}

/** Exercise caller-rendered edges and selected native viewport tags. */
function MarqueeComposition(): JSX.Element {
  const [refsMatch, setRefsMatch] = createSignal(false);
  let parentEdge: Element | undefined;
  let childEdge: Element | undefined;

  /** Retain the public edge ref after the primitive composition. */
  function captureParent(element: Element): void {
    parentEdge = element;
    setRefsMatch(parentEdge === childEdge);
  }

  /** Retain the caller-rendered span ref after the primitive composition. */
  function captureChild(element: Element): void {
    childEdge = element;
    setRefsMatch(parentEdge === childEdge);
  }

  return (
    <>
      <div style={{ padding: '60px' }}>
        <Marquee.Root>
          <Marquee.Edge
            side="start"
            ref={captureParent}
            data-testid="marquee-composed-edge"
            asChild={
              /** Apply the primitive's edge attributes to the caller's native span. */
              (getProps) => <span {...getProps({ ref: captureChild })} />
            }
          />
          <Marquee.Viewport as="section" data-testid="marquee-composed-viewport">
            <Marquee.Content>
              <Marquee.Item>Composed item</Marquee.Item>
            </Marquee.Content>
          </Marquee.Viewport>
        </Marquee.Root>
        <output data-testid="marquee-composed-refs">{refsMatch() ? 'matched' : 'missing'}</output>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Marquee/CSS',
  component: MarqueeCssOverrides,
} satisfies Meta<typeof MarqueeCssOverrides>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Overrides: Story = {};
export const PartHooks: Story = { render: MarqueePartHooks };
export const Unstyled: Story = { render: MarqueeUnstyled };
export const Composition: Story = { render: MarqueeComposition };
