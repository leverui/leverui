import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Sticky, type StickyProps } from '../src';
import './sticky-consumer.css';

type GetChildProps = Parameters<NonNullable<StickyProps['asChild']>>[0];

/** Apply Sticky styles and native attributes to a consumer-owned link. */
function renderStickyLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#sticky-target" data-testid="sticky-link">
      Sticky link
    </a>
  );
}

/** Exercise scrolling, token offsets, overrides, and native rendering paths. */
function StickyContractExample(): JSX.Element {
  const [shifted, setShifted] = createSignal(false);

  /** Record the native button selected through Sticky's public ref. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change the button's sticky offset without replacing its child. */
  function toggleOffset(): void {
    setShifted(!shifted());
  }

  return (
    <>
      <section data-testid="sticky-story">
        <Box class="sticky-contract-scroll" data-testid="sticky-default-scroll">
          <Box class="sticky-contract-before">Before</Box>
          <Sticky class="sticky-contract-content" data-testid="sticky-default">
            Default sticky
          </Sticky>
          <Box class="sticky-contract-after">After</Box>
        </Box>
        <Box class="sticky-contract-scroll" data-testid="sticky-offset-scroll">
          <Box class="sticky-contract-before">Before</Box>
          <Sticky
            class="consumer-sticky-offset sticky-contract-content"
            data-testid="sticky-offset"
          >
            Offset sticky
          </Sticky>
          <Box class="sticky-contract-after">After</Box>
        </Box>
        <Sticky class="consumer-sticky-responsive" data-testid="sticky-responsive">
          Responsive offset
        </Sticky>
        <Sticky style={{ position: 'relative', top: '12px' }} data-testid="sticky-direct-override">
          Direct override
        </Sticky>
        <Sticky class="consumer-sticky-override" data-testid="sticky-css-override">
          CSS override
        </Sticky>
        <Sticky unstyled data-testid="sticky-unstyled">
          Unstyled
        </Sticky>
        <Sticky
          as="button"
          type="button"
          ref={markButton}
          style={{ top: shifted() ? '16px' : '0px' }}
          onClick={toggleOffset}
          aria-label="Shift sticky"
          data-testid="sticky-reactive"
        >
          <span data-testid="sticky-reactive-child">Button child</span>
        </Sticky>
        <Sticky asChild={renderStickyLink} aria-label="Sticky link" />
        <span id="sticky-target">Link target</span>
      </section>
    </>
  );
}

const meta = {
  title: 'Layout/Sticky',
  component: StickyContractExample,
} satisfies Meta<typeof StickyContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
