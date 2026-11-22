import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Circle, type CircleProps } from '../src';
import './square-circle-consumer.css';

type GetChildProps = Parameters<NonNullable<CircleProps['asChild']>>[0];

/** Render a native link with the Circle's composed class and attributes. */
function renderCircleLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#circle-target" data-testid="circle-link">
      Link
    </a>
  );
}

/** Exercise token, responsive, raw, native, and overridden circle layouts. */
function CircleContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Record the selected native button received through the public ref. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change the button circle's size without remounting its child. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <section data-testid="circle-story">
        <Circle size="10" class="consumer-shape-token" data-testid="circle-token">
          <Box class="consumer-shape-child" data-testid="circle-token-child">
            1
          </Box>
        </Circle>
        <Circle size={{ base: '8', md: '12' }} data-testid="circle-responsive">
          Responsive
        </Circle>
        <Circle size="64px" data-testid="circle-raw">
          Raw
        </Circle>
        <Circle size="10" class="consumer-circle-radius" data-testid="circle-radius-override">
          Radius
        </Circle>
        <Circle size="10" class="consumer-shape-fixed" data-testid="circle-custom-css" />
        <Circle
          as="button"
          type="button"
          ref={markButton}
          size={large() ? '12' : '8'}
          onClick={toggleSize}
          aria-label="Resize circle"
          data-testid="circle-reactive"
        >
          <span data-testid="circle-reactive-child">Resize</span>
        </Circle>
        <Circle asChild={renderCircleLink} size="10" aria-label="Circle link" />
        <span id="circle-target">Link target</span>
      </section>
    </>
  );
}

const meta = {
  title: 'Layout/Circle',
  component: CircleContractExample,
} satisfies Meta<typeof CircleContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
