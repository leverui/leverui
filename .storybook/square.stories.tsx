import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Square, type SquareProps } from '../src';
import './square-circle-consumer.css';

type GetChildProps = Parameters<NonNullable<SquareProps['asChild']>>[0];

/** Compose Square styling and native behavior onto a consumer link. */
function renderSquareLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#square-target" data-testid="square-link">
      Link
    </a>
  );
}

/** Exercise sized, responsive, polymorphic, and reactive Square layouts. */
function SquareContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Record the selected native element received through the public ref. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change size without remounting the native button or its child. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <section data-testid="square-story">
        <Square size="10" class="consumer-shape-token" data-testid="square-token">
          <Box class="consumer-shape-child" data-testid="square-token-child">
            1
          </Box>
        </Square>
        <Square size={{ base: '8', md: '12' }} data-testid="square-responsive">
          Responsive
        </Square>
        <Square size="64px" data-testid="square-raw">
          Raw
        </Square>
        <Square
          size="10"
          class="consumer-shape-fixed"
          style={{ 'justify-content': large() ? 'flex-end' : 'flex-start' }}
          data-testid="square-custom-css"
        >
          <span data-testid="square-custom-css-child">Styled child</span>
        </Square>
        <Square
          as="button"
          type="button"
          ref={markButton}
          size={large() ? '12' : '8'}
          onClick={toggleSize}
          aria-label="Resize square"
          data-testid="square-reactive"
        >
          <span data-testid="square-reactive-child">Resize</span>
        </Square>
        <Square asChild={renderSquareLink} size="10" aria-label="Square link" />
        <span id="square-target">Link target</span>
      </section>
    </>
  );
}

const meta = {
  title: 'Layout/Square',
  component: SquareContractExample,
} satisfies Meta<typeof SquareContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
