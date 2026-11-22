import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { FocusTrap } from '../src';

type ActiveTrap = 'options' | 'fallback' | 'skip' | undefined;

/** Exercise explicit focus targets and permitted content outside the root. */
function FocusTrapOptionsExample(): JSX.Element {
  const [active, setActive] = createSignal<ActiveTrap>();
  const [returnOnExit, setReturnOnExit] = createSignal(true);
  const [skipActivated, setSkipActivated] = createSignal(false);
  let firstInput: HTMLInputElement | undefined;
  let persistentButton: HTMLButtonElement | undefined;
  let returnButton: HTMLButtonElement | undefined;
  let fallbackElement: HTMLDivElement | undefined;

  /** Activate the trap with focus targets and a persistent outside element. */
  function openOptions(): void {
    setActive('options');
  }

  /** Activate the trap whose only focus target is its fallback. */
  function openFallback(): void {
    setActive('fallback');
  }

  /** Activate a trap while explicitly opting out of initial focus. */
  function openSkip(): void {
    setActive('skip');
  }

  /** Expose Zag activation so the browser case waits for its deferred setup. */
  function activateSkip(): void {
    setSkipActivated(true);
  }

  /** Clear the activation marker after the skipped trap deactivates. */
  function deactivateSkip(): void {
    setSkipActivated(false);
  }

  /** Deactivate the current trap. */
  function closeTrap(): void {
    setActive(undefined);
  }

  /** Disable focus restoration for the next activation. */
  function disableReturn(): void {
    setReturnOnExit(false);
  }

  /** Capture the consumer's preferred initial focus target. */
  function captureFirstInput(element: HTMLInputElement): void {
    firstInput = element;
  }

  /** Capture the external element included in the trap boundary. */
  function capturePersistentButton(element: HTMLButtonElement): void {
    persistentButton = element;
  }

  /** Capture the target for custom focus restoration. */
  function captureReturnButton(element: HTMLButtonElement): void {
    returnButton = element;
  }

  /** Capture the element used when the trap has no tabbable descendants. */
  function captureFallbackElement(element: HTMLDivElement): void {
    fallbackElement = element;
  }

  /** Resolve the explicit initial focus after the input mounts. */
  function initialFocus(): HTMLInputElement {
    if (!firstInput) throw new Error('Initial focus input is missing.');
    return firstInput;
  }

  /** Include the external button in Zag's active trap boundary. */
  function persistentElement(): Element | null {
    return persistentButton ?? null;
  }

  /** Restore focus to a chosen button instead of the launcher. */
  function returnFocus(): HTMLButtonElement | false {
    return returnButton ?? false;
  }

  /** Resolve a programmatically focusable child for an empty trap. */
  function fallbackFocus(): HTMLDivElement {
    if (!fallbackElement) throw new Error('Fallback focus element is missing.');
    return fallbackElement;
  }

  return (
    <>
      <button type="button" data-testid="focus-options-launcher" onClick={openOptions}>
        Start options trap
      </button>
      <button type="button" data-testid="focus-disable-return" onClick={disableReturn}>
        Disable return focus
      </button>
      <FocusTrap
        disabled={active() !== 'options'}
        initialFocus={initialFocus}
        persistentElements={[persistentElement]}
        setReturnFocus={returnFocus}
        returnFocusOnDeactivate={returnOnExit()}
        data-testid="focus-options-root"
      >
        <input ref={captureFirstInput} aria-label="Preferred input" />
        <input aria-label="Autofocus marker input" data-autofocus />
        <button type="button" onClick={closeTrap}>
          End options trap
        </button>
      </FocusTrap>
      <button type="button" ref={capturePersistentButton} data-testid="focus-persistent">
        Persistent action
      </button>
      <button type="button" ref={captureReturnButton} data-testid="focus-return-target">
        Return target
      </button>
      <button type="button" data-testid="focus-unrelated">
        Unrelated action
      </button>
      <button type="button" data-testid="focus-fallback-launcher" onClick={openFallback}>
        Start fallback trap
      </button>
      <FocusTrap
        disabled={active() !== 'fallback'}
        fallbackFocus={fallbackFocus}
        data-testid="focus-fallback-root"
      >
        <div ref={captureFallbackElement} tabindex={-1} data-testid="focus-fallback-target">
          No tabbable children
        </div>
      </FocusTrap>
      <button type="button" data-testid="focus-skip-launcher" onClick={openSkip}>
        Start skipped focus trap
      </button>
      <FocusTrap
        disabled={active() !== 'skip'}
        initialFocus={false}
        onActivate={activateSkip}
        onDeactivate={deactivateSkip}
        data-activated={String(skipActivated())}
        data-testid="focus-skip-root"
      >
        <input aria-label="Skipped initial focus input" data-autofocus />
        <button type="button" onClick={closeTrap}>
          End skipped focus trap
        </button>
      </FocusTrap>
      <output data-testid="focus-options-active">{active() ?? 'none'}</output>
    </>
  );
}

const meta = {
  title: 'Components/Focus Trap Options',
  component: FocusTrapOptionsExample,
} satisfies Meta<typeof FocusTrapOptionsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
