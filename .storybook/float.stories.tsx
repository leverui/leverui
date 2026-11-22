import { For, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Float, type FloatProps } from '../src';
import './float-contract.css';

type GetChildProps = Parameters<NonNullable<FloatProps['asChild']>>[0];
type Placement = NonNullable<FloatProps['placement']> & string;

const placements = [
  'top-start',
  'top-center',
  'top-end',
  'middle-start',
  'middle-center',
  'middle-end',
  'bottom-start',
  'bottom-center',
  'bottom-end',
] as const satisfies readonly Placement[];

/** Render the styled child as a native anchor. */
function renderFloatLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#float-target" data-testid="float-link">
      Floating link
    </a>
  );
}

/** Render one placement inside a fixed-size positioned parent. */
function renderPlacement(placement: Placement): JSX.Element {
  return (
    <Box class="float-contract-parent" data-testid={`float-${placement}-parent`}>
      <Float placement={placement} class="float-contract-item" data-testid={`float-${placement}`}>
        3
      </Float>
    </Box>
  );
}

/** Show Float's positions, offsets, native paths, and live placement. */
function FloatContractExample(): JSX.Element {
  const [bottom, setBottom] = createSignal(false);
  const [liveOffset, setLiveOffset] = createSignal('0');

  /** Record the selected native button passed through the public ref. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Move the native Float button without replacing its content. */
  function togglePlacement(): void {
    setBottom(!bottom());
  }

  /** Move the offset without replacing the native Float or its child. */
  function toggleOffset(): void {
    setLiveOffset(liveOffset() === '0' ? '4' : '0');
  }

  return (
    <>
      <section data-testid="float-story">
        <Box class="float-contract-parent" data-testid="float-default-parent">
          <Float class="float-contract-item" data-testid="float-default">
            <span data-testid="float-default-child">3</span>
          </Float>
        </Box>
        <For each={placements}>{renderPlacement}</For>
        <Box class="float-contract-parent" data-testid="float-offset-parent">
          <Float offset="4" class="float-contract-item" data-testid="float-offset">
            3
          </Float>
        </Box>
        <Box class="float-contract-parent" data-testid="float-x-parent">
          <Float offset="4" offsetX="8px" class="float-contract-item" data-testid="float-x">
            3
          </Float>
        </Box>
        <Box class="float-contract-parent" data-testid="float-y-parent">
          <Float offset="4" offsetY="12px" class="float-contract-item" data-testid="float-y">
            3
          </Float>
        </Box>
        <Box class="float-contract-parent" data-testid="float-r-parent">
          <Float
            placement={{ base: 'top-start', md: 'bottom-end' }}
            class="float-contract-item"
            data-testid="float-responsive"
          >
            3
          </Float>
        </Box>
        <Box class="float-contract-parent" data-testid="float-ro-parent">
          <Float
            offsetX={{ base: '0', md: '8px' }}
            class="float-contract-item"
            data-testid="float-responsive-offset"
          >
            3
          </Float>
        </Box>
        <Box class="float-contract-parent" data-testid="float-rc-parent">
          <Float
            placement={{ base: 'top-start', md: 'bottom-end' }}
            offset={{ base: '0', md: '4' }}
            class="float-contract-item"
            data-testid="float-responsive-combined"
          >
            3
          </Float>
        </Box>
        <Box class="float-contract-parent" data-testid="float-ra-parent">
          <Float
            placement={['top-start', null, 'bottom-end']}
            class="float-contract-item"
            data-testid="float-responsive-array"
          >
            3
          </Float>
        </Box>
        <Box class="float-contract-parent" dir="rtl" data-testid="float-rtl-parent">
          <Float class="float-contract-item" data-testid="float-rtl">
            3
          </Float>
        </Box>
        <Box class="float-contract-parent">
          <Float class="float-contract-override" data-testid="float-css-override">
            CSS
          </Float>
          <Float unstyled data-testid="float-unstyled">
            Unstyled
          </Float>
        </Box>
        <Box class="float-contract-parent" data-testid="float-live-parent">
          <Float
            as="button"
            type="button"
            ref={markButton}
            placement={bottom() ? 'bottom-end' : 'top-start'}
            class="float-contract-item"
            onClick={togglePlacement}
            aria-label="Move Float"
            data-testid="float-live"
          >
            <span data-testid="float-live-child">3</span>
          </Float>
        </Box>
        <Box class="float-contract-parent" data-testid="float-live-offset-parent">
          <Float offset={liveOffset()} class="float-contract-item" data-testid="float-live-offset">
            <span data-testid="float-live-offset-child">3</span>
          </Float>
        </Box>
        <button type="button" onClick={toggleOffset} data-testid="float-offset-toggle">
          Change Float offset
        </button>
        <Box class="float-contract-parent">
          <Float asChild={renderFloatLink} aria-label="Floating link" />
        </Box>
        <span id="float-target">Link target</span>
      </section>
    </>
  );
}

const meta = {
  title: 'Layout/Float',
  component: FloatContractExample,
} satisfies Meta<typeof FloatContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
