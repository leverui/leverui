import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Loader, LoaderOverlay } from '../src';
import './loader-contract.css';

/** Show Loader's native structure, reactive state, and overlay composition. */
function LoaderContractExample(): JSX.Element {
  const [visible, setVisible] = createSignal(true);
  const [end, setEnd] = createSignal(false);

  /** Mark the native element delivered through Loader's ref. */
  function markLoader(element: HTMLSpanElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Mark the selected native element delivered through LoaderOverlay's ref. */
  function markOverlay(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Toggle both visible and placement states without remounting the story. */
  function toggle(): void {
    setVisible(!visible());
    setEnd(!end());
  }

  return (
    <>
      <div data-testid="loader-contract">
        <Box class="loader-contract-parent" data-testid="loader-parent">
          <Loader ref={markLoader} data-testid="default-loader">
            Submit
          </Loader>
        </Box>
        <Loader text="Loading..." data-testid="text-start">
          Submit
        </Loader>
        <Loader text="Loading..." spinnerPlacement="end" data-testid="text-end">
          Submit
        </Loader>
        <Loader text="Working" spinner={<span data-testid="custom-indicator">◌</span>}>
          Submit
        </Loader>
        <Loader spinner={null} data-testid="null-indicator">
          Ready
        </Loader>
        <Loader unstyled data-testid="unstyled-loader">
          Submit
        </Loader>
        <LoaderOverlay unstyled data-testid="unstyled-overlay">
          Plain overlay
        </LoaderOverlay>
        <Loader
          visible={visible()}
          text="Waiting"
          spinnerPlacement={end() ? 'end' : 'start'}
          data-testid="reactive-loader"
        >
          <span data-testid="reactive-child">Ready</span>
        </Loader>
        <Box class="loader-contract-overlay-parent" data-testid="overlay-parent">
          Content
          <LoaderOverlay
            as="section"
            ref={markOverlay}
            class="loader-contract-overlay"
            data-testid="loader-overlay"
          >
            <Loader text="Loading..." />
          </LoaderOverlay>
        </Box>
        <button type="button" onClick={toggle} data-testid="loader-toggle">
          Toggle loading
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Loader',
  component: LoaderContractExample,
} satisfies Meta<typeof LoaderContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
