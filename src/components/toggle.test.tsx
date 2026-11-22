import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Toggle } from '../index';

afterEach(cleanup);

/** Render a controlled button with the public indicator and context APIs. */
function ControlledToggle(): JSX.Element {
  const [pressed, setPressed] = createSignal(false);

  /** Feed Zag changes back into the owning Solid signal. */
  function handlePressedChange(value: boolean): void {
    setPressed(value);
    flush();
  }

  return (
    <>
      <Toggle.Root pressed={pressed()} onPressedChange={handlePressedChange} aria-label="Bold">
        <Toggle.Indicator fallback="Off">On</Toggle.Indicator>
        <Toggle.Context>
          {
            /** Read the same machine state through its public context. */
            (api) => <output data-testid="context-state">{api().pressed ? 'on' : 'off'}</output>
          }
        </Toggle.Context>
      </Toggle.Root>
    </>
  );
}

/** Preserve ARIA state, indicator content, and controlled updates. */
async function verifiesControlledToggle(): Promise<void> {
  render(
    /** Mount the machine inside one Solid owner. */
    () => <ControlledToggle />,
  );
  const root = screen.getByRole('button', { name: 'Bold' });
  expect(root).toHaveAttribute('type', 'button');
  expect(root).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByText('Off')).toBeInTheDocument();
  expect(screen.getByTestId('context-state')).toHaveTextContent('off');
  fireEvent.click(root);
  await waitFor(
    /** Wait for the controlled signal and primitive context to update. */
    () => expect(root).toHaveAttribute('aria-pressed', 'true'),
  );
  expect(screen.getByText('On')).toBeInTheDocument();
  expect(screen.getByTestId('context-state')).toHaveTextContent('on');
}

it('keeps controlled ARIA, indicator, and context state together', verifiesControlledToggle);

/** Supply a disabled machine default without making it a native prop. */
function DisabledDefaultToggle(): JSX.Element {
  return (
    <>
      <Toggle.PropsProvider value={{ disabled: true }}>
        <Toggle.Root aria-label="Locked">Locked</Toggle.Root>
      </Toggle.PropsProvider>
    </>
  );
}

/** Preserve inherited disabled behavior on the native button. */
function verifiesDisabledDefault(): void {
  render(
    /** Mount the inherited default around the machine root. */
    () => <DisabledDefaultToggle />,
  );
  const root = screen.getByRole('button', { name: 'Locked' });
  expect(root).toBeDisabled();
  expect(root).toHaveAttribute('aria-pressed', 'false');
  fireEvent.click(root);
  expect(root).toHaveAttribute('aria-pressed', 'false');
}

it('inherits disabled machine behavior from PropsProvider', verifiesDisabledDefault);
