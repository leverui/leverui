import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { PinInput, usePinInput } from '../index';

afterEach(cleanup);

/** Check native fields, indexed labels, hidden form value, and recipe hooks. */
function verifiesPinInputComposition(): void {
  render(
    /** Mount four fields under one primitive machine. */
    () => (
      <>
        <PinInput.Root count={4} name="code" defaultValue={['1', '2', '', '']}>
          <PinInput.Label>Verification code</PinInput.Label>
          <PinInput.HiddenInput data-testid="pin-hidden" />
          <PinInput.Control data-testid="pin-control">
            <PinInput.Input index={0} data-testid="pin-first" />
            <PinInput.Input index={1} data-testid="pin-second" />
            <PinInput.Input index={2} />
            <PinInput.Input index={3} />
          </PinInput.Control>
        </PinInput.Root>
      </>
    ),
  );
  const first = screen.getByTestId('pin-first') as HTMLInputElement;
  const second = screen.getByTestId('pin-second') as HTMLInputElement;
  const hidden = screen.getByTestId('pin-hidden') as HTMLInputElement;
  expect(first.className).toContain('leverui-pin-input__input');
  expect(screen.getByTestId('pin-control').className).toContain('leverui-pin-input__control');
  expect(first.value).toBe('1');
  expect(second.value).toBe('2');
  expect(first.getAttribute('aria-label')).toBeTruthy();
  expect(hidden.name).toBe('code');
}

it('composes indexed fields and a hidden form input', verifiesPinInputComposition);

/** Keep controlled values and inherited disabled state reactive. */
function verifiesReactivePinInput(): void {
  const [value, setValue] = createSignal(['1', '', '', '']);
  const [disabled, setDisabled] = createSignal(false);

  /** Read caller state inside a Solid owner. */
  function Example(): JSX.Element {
    return (
      <>
        <PinInput.PropsProvider
          value={
            /** Follow the caller's disabled signal through inherited defaults. */
            () => ({ disabled: disabled(), size: 'sm' })
          }
        >
          <PinInput.Root
            count={4}
            value={value()}
            onValueChange={
              /** Return machine changes to the controlling signal. */
              (details) => setValue(details.value)
            }
          >
            <PinInput.Input index={0} data-testid="controlled-pin" />
          </PinInput.Root>
        </PinInput.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the reactive example without recreating its machine. */
    () => <Example />,
  );
  const first = screen.getByTestId('controlled-pin') as HTMLInputElement;
  expect(first.value).toBe('1');
  setValue(['9', '', '', '']);
  flush();
  expect(first.value).toBe('9');
  setDisabled(true);
  flush();
  expect(first.disabled).toBe(true);
}

it('updates controlled value and provider defaults', verifiesReactivePinInput);

/** Keep an externally owned machine available to styled Pin Input parts. */
function verifiesPinInputRootProvider(): void {
  /** Construct the machine under the caller's Solid owner. */
  function Example(): JSX.Element {
    const pinInput = usePinInput({ count: 2, defaultValue: ['4', '2'] });
    return (
      <>
        <PinInput.RootProvider value={pinInput}>
          <PinInput.Context>
            {
              /** Read the current code from the public context accessor. */
              (context) => <output data-testid="pin-context">{context().valueAsString}</output>
            }
          </PinInput.Context>
          <PinInput.Input index={0} data-testid="provided-pin" />
        </PinInput.RootProvider>
      </>
    );
  }

  render(
    /** Mount a caller-owned machine with Lever UI styling. */
    () => <Example />,
  );
  expect(screen.getByTestId('pin-context').textContent).toBe('42');
  expect((screen.getByTestId('provided-pin') as HTMLInputElement).value).toBe('4');
}

it('supports a caller-owned Pin Input machine', verifiesPinInputRootProvider);

/** Identify the correct family when a styled part lacks its root context. */
function verifiesMissingPinInputRoot(): void {
  expect(
    /** Mount the unscoped part and surface its public diagnostic. */
    () =>
      render(
        /** Mount a Pin Input part without its required recipe and machine root. */
        () => (
          <>
            <PinInput.Input index={0} />
          </>
        ),
      ),
  ).toThrow('Pin Input parts must be inside PinInputRoot or PinInputRootProvider.');
}

it('names Pin Input in the missing-root diagnostic', verifiesMissingPinInputRoot);
