import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Spinner, SpinnerPropsProvider, type SpinnerProps } from '../src';
import './spinner-contract.css';

type GetSpinnerChildProps = Parameters<NonNullable<SpinnerProps['asChild']>>[0];

/** Render a custom indicator through the public Solid child contract. */
function renderIndicator(getProps: GetSpinnerChildProps): JSX.Element {
  return (
    <span {...getProps()} data-testid="custom-indicator">
      ◌
    </span>
  );
}

/** Exercise Spinner's CSS hooks, provider, native attrs, and reactive states. */
function SpinnerContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Show which native element Spinner supplied to its consumer. */
  function markSpan(element: HTMLSpanElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Show the selected native div received through its typed ref. */
  function markDiv(element: HTMLDivElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change provider and instance sizes without remounting. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <div data-testid="spinner-contract">
        <Spinner ref={markSpan} data-testid="default-spinner" />
        <Spinner size={large() ? 'xl' : 'sm'} data-testid="reactive-spinner" />
        <Spinner size={{ base: 'sm', md: 'xl' }} data-testid="responsive-spinner" />
        <SpinnerPropsProvider
          value={{ size: large() ? 'lg' : 'xs', class: 'spinner-inherited-blue' }}
        >
          <Spinner data-testid="inherited-spinner" />
          <Spinner class="fixed-spinner" size="sm" data-testid="fixed-spinner" />
        </SpinnerPropsProvider>
        <Spinner class="spinner-palette-teal" data-testid="palette-spinner" />
        <Spinner class="spinner-red" data-testid="colored-spinner" />
        <Spinner class="spinner-track" data-testid="track-spinner" />
        <Spinner class="spinner-fast" data-testid="speed-spinner" />
        <Spinner class="spinner-thick" data-testid="thick-spinner" />
        <Spinner class="spinner-indicator" asChild={renderIndicator} />
        <Spinner as="div" ref={markDiv} data-testid="div-spinner" />
        <Spinner role="status" aria-label="Fetching results" data-testid="named-spinner" />
        <Spinner unstyled data-testid="unstyled-spinner" />
        <Spinner class="spinner-custom-ring" data-testid="custom-ring-spinner" />
        <button type="button" onClick={toggleSize} data-testid="spinner-toggle">
          Toggle sizes
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Spinner',
  component: SpinnerContractExample,
} satisfies Meta<typeof SpinnerContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
