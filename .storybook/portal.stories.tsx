import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Portal } from '../src';

/** Exercise native content, custom destinations, disabled mode, and events. */
function PortalContractExample(): JSX.Element {
  const [first, setFirst] = createSignal<HTMLDivElement>();
  const [second, setSecond] = createSignal<HTMLDivElement>();
  const [explicit, setExplicit] = createSignal<HTMLDivElement>();
  const [grid, setGrid] = createSignal<HTMLDivElement>();
  const [useSecond, setUseSecond] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);
  const [clicks, setClicks] = createSignal(0);

  /** Capture the first custom container after its native element exists. */
  function captureFirst(element: HTMLDivElement): void {
    setFirst(element);
  }

  /** Capture the alternate custom container. */
  function captureSecond(element: HTMLDivElement): void {
    setSecond(element);
  }

  /** Capture the native Solid mount destination. */
  function captureExplicit(element: HTMLDivElement): void {
    setExplicit(element);
  }

  /** Capture a grid destination whose children should remain grid items. */
  function captureGrid(element: HTMLDivElement): void {
    setGrid(element);
  }

  /** Resolve the current custom destination reactively. */
  function selectedContainer(): HTMLDivElement | undefined {
    return useSecond() ? second() : first();
  }

  /** Fail if an explicit mount mistakenly reads its unused container. */
  function unusedContainer(): HTMLDivElement {
    throw new Error('The explicit mount must not evaluate the container accessor.');
  }

  /** Move the custom portal between its two containers. */
  function switchContainer(): void {
    setUseSecond(
      /** Select the other custom container. */
      (current) => !current,
    );
  }

  /** Toggle inline rendering for the custom portal. */
  function toggleDisabled(): void {
    setDisabled(
      /** Flip the disabled state without replacing children. */
      (current) => !current,
    );
  }

  /** Confirm delegated events still work outside the source hierarchy. */
  function countClick(): void {
    setClicks(
      /** Increment the shared click count. */
      (current) => current + 1,
    );
  }

  return (
    <section data-testid="portal-story">
      <button type="button" data-testid="portal-switch" onClick={switchContainer}>
        Switch container
      </button>
      <button type="button" data-testid="portal-disable" onClick={toggleDisabled}>
        Toggle disabled
      </button>
      <div data-testid="portal-inline-host">
        <Portal container={selectedContainer} disabled={disabled()}>
          Plain text
          <button type="button" data-testid="portal-button" onClick={countClick}>
            Clicks: {clicks()}
          </button>
          <span data-testid="portal-second-child">Second child</span>
        </Portal>
      </div>
      <div data-testid="portal-first" ref={captureFirst} />
      <div data-testid="portal-second" ref={captureSecond} />
      <div data-testid="portal-explicit" ref={captureExplicit} />
      <div
        data-testid="portal-grid"
        ref={captureGrid}
        style={{ display: 'grid', 'grid-template-columns': '80px 80px' }}
      />
      <Portal container={first()}>
        <span data-testid="portal-direct">Direct container</span>
      </Portal>
      <Portal mount={explicit()} container={unusedContainer}>
        <span data-testid="portal-priority">Explicit mount</span>
      </Portal>
      <Portal>
        <span data-testid="portal-default">Default mount</span>
      </Portal>
      <Portal container={grid}>
        <span data-testid="portal-grid-first">First item</span>
        <span data-testid="portal-grid-second">Second item</span>
      </Portal>
    </section>
  );
}

const meta = {
  title: 'Utilities/Portal',
  component: PortalContractExample,
} satisfies Meta<typeof PortalContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
