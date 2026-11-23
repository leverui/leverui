import { Field as PrimitiveField } from '../primitives/components/field';
import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxPropsProvider,
  CheckboxRoot,
  type CheckboxCheckedChangeDetails,
  type CheckboxCheckedState,
} from '../index';

afterEach(cleanup);

/** Verify the primitive owns uncontrolled state and the native form control. */
async function verifiesUncontrolledCheckbox(): Promise<void> {
  render(
    /** Mount all Checkbox parts with an initial checked value. */
    () => (
      <>
        <CheckboxRoot defaultChecked name="updates" value="yes" data-testid="root">
          <CheckboxControl data-testid="control" />
          <CheckboxLabel>Updates</CheckboxLabel>
          <CheckboxHiddenInput />
        </CheckboxRoot>
      </>
    ),
  );
  const input = screen.getByRole('checkbox', { name: 'Updates' }) as HTMLInputElement;
  expect(input.checked).toBe(true);
  expect(input.name).toBe('updates');
  expect(screen.getByTestId('control').getAttribute('data-state')).toBe('checked');
  expect(screen.getByTestId('root').className).toContain('lui-checkbox');
  fireEvent.click(input);
  await waitFor(
    /** Wait for the primitive's machine to update the native checked state. */
    () => expect(input.checked).toBe(false),
  );
}

it(
  'keeps uncontrolled state in the primitive and submits a native input',
  verifiesUncontrolledCheckbox,
);

/** Verify a Solid signal controls the primitive's checked state and event details. */
async function verifiesControlledCheckbox(): Promise<void> {
  const [checked, setChecked] = createSignal<CheckboxCheckedState>(false);
  const changes: Array<boolean | 'indeterminate'> = [];

  /** Translate the primitive change details to the consumer's Solid signal. */
  function updateChecked(details: CheckboxCheckedChangeDetails): void {
    changes.push(details.checked);
    setChecked(details.checked);
    flush();
  }

  render(
    /** Mount the machine beneath a consumer-controlled signal. */
    () => (
      <>
        <CheckboxRoot checked={checked()} onCheckedChange={updateChecked}>
          <CheckboxControl data-testid="controlled-control" />
          <CheckboxLabel>Consent</CheckboxLabel>
          <CheckboxHiddenInput />
        </CheckboxRoot>
      </>
    ),
  );
  const input = screen.getByRole('checkbox', { name: 'Consent' }) as HTMLInputElement;
  const root = input.closest('label');
  fireEvent.click(input);
  await waitFor(
    /** Observe the signal-driven machine state after the deferred callback. */
    () => expect(input.closest('label')?.getAttribute('data-state')).toBe('checked'),
  );
  expect(input.checked).toBe(true);
  expect(changes).toEqual([true]);
  setChecked('indeterminate');
  flush();
  expect(input.closest('label')).toBe(root);
  await waitFor(
    /** Observe the controlled mixed state after the machine catches up. */
    () =>
      expect(screen.getByTestId('controlled-control').getAttribute('data-state')).toBe(
        'indeterminate',
      ),
  );
}

it(
  'translates the primitive change details into controlled Solid state',
  verifiesControlledCheckbox,
);

/** Verify the primitive Field state reaches the hidden input and visible control. */
function verifiesFieldComposition(): void {
  render(
    /** Mount Checkbox parts beneath the primitive's field context. */
    () => (
      <>
        <PrimitiveField.Root id="terms-field" required disabled>
          <CheckboxRoot>
            <CheckboxControl data-testid="control" />
            <CheckboxLabel>Terms</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
        </PrimitiveField.Root>
      </>
    ),
  );
  const input = screen.getByRole('checkbox', { name: 'Terms' }) as HTMLInputElement;
  expect(input.required).toBe(true);
  expect(input.disabled).toBe(true);
  expect(input.id).toBe('terms-field');
  expect(screen.getByTestId('control').getAttribute('data-disabled')).toBe('');
}

it(
  'inherits the primitive Field IDs, required state, and disabled state',
  verifiesFieldComposition,
);

/** Verify provider defaults and custom icon content stay reactive. */
function verifiesPresentationDefaults(): void {
  const [large, setLarge] = createSignal(false);
  let indicatorRef: SVGSVGElement | undefined;
  let childRef: SVGSVGElement | undefined;

  /** Capture the public indicator ref from the custom SVG. */
  function markIndicator(element: SVGSVGElement): void {
    indicatorRef = element;
  }

  /** Capture the custom mark's own ref from that same SVG. */
  function markChild(element: SVGSVGElement): void {
    childRef = element;
  }

  /** Render a changing defaults provider around a custom indicator. */
  function Example(): JSX.Element {
    return (
      <CheckboxPropsProvider value={{ size: large() ? 'lg' : 'sm' }}>
        <CheckboxRoot defaultChecked>
          <CheckboxControl data-testid="control">
            <CheckboxIndicator
              ref={markIndicator}
              checked={
                /** Forward the indicator's CSS hooks and state to a custom SVG. */
                (getProps) => (
                  <Dynamic
                    component="svg"
                    {...getProps({ 'data-testid': 'custom-mark', ref: markChild })}
                  >
                    <Dynamic component="circle" cx="12" cy="12" r="5" />
                  </Dynamic>
                )
              }
            />
          </CheckboxControl>
          <CheckboxLabel>Custom</CheckboxLabel>
          <CheckboxHiddenInput />
        </CheckboxRoot>
      </CheckboxPropsProvider>
    );
  }

  render(
    /** Mount the reactive CSS example. */
    () => <Example />,
  );
  const control = screen.getByTestId('control');
  const root = screen.getByText('Custom').closest('label');
  const initialRootClass = root?.className;
  const mark = screen.getByTestId('custom-mark');
  expect(mark.tagName.toLowerCase()).toBe('svg');
  expect(mark.getAttribute('data-state')).toBe('checked');
  expect(mark.classList.contains('lui-checkbox__indicator')).toBe(true);
  expect(indicatorRef).toBe(mark);
  expect(childRef).toBe(mark);
  expect(control.getAttribute('data-size')).toBe('sm');
  setLarge(true);
  flush();
  expect(root?.className).toBe(initialRootClass);
  expect(control.getAttribute('data-size')).toBe('lg');
  expect(screen.getByTestId('control')).toBe(control);
  expect(screen.getByTestId('custom-mark')).toBe(mark);
}

it('updates CSS choices from provider defaults', verifiesPresentationDefaults);
