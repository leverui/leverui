import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxPropsProvider,
  CheckboxRootProvider,
  useCheckbox,
} from '../index';

afterEach(cleanup);

/** Keep inherited machine defaults away from an external Checkbox store. */
async function verifiesExternalMachineDefaults(): Promise<void> {
  const [inheritedChecked, setInheritedChecked] = createSignal(false);
  const [inheritedDisabled, setInheritedDisabled] = createSignal(true);
  const [large, setLarge] = createSignal(false);

  /** Mount an externally owned Checkbox under reactive presentation defaults. */
  function Example(): JSX.Element {
    const external = useCheckbox({ defaultChecked: true, disabled: false, name: 'external' });
    /** Change provider defaults while keeping the same caller-owned store. */
    function readDefaults() {
      return {
        checked: inheritedChecked(),
        disabled: inheritedDisabled(),
        name: 'inherited',
        size: large() ? ('lg' as const) : ('sm' as const),
        variant: 'solid' as const,
      };
    }

    return (
      <CheckboxPropsProvider value={readDefaults}>
        <CheckboxRootProvider value={external} variant="outline" data-testid="root">
          <CheckboxControl data-testid="control" />
          <CheckboxLabel>External</CheckboxLabel>
          <CheckboxHiddenInput />
        </CheckboxRootProvider>
      </CheckboxPropsProvider>
    );
  }

  render(Example);
  const input = screen.getByRole('checkbox', { name: 'External' }) as HTMLInputElement;
  const root = screen.getByTestId('root');
  const control = screen.getByTestId('control');
  const initialClass = root.className;
  expect(input.checked).toBe(true);
  expect(input.disabled).toBe(false);
  expect(input.name).toBe('external');
  expect(control.getAttribute('data-size')).toBe('sm');
  expect(control.getAttribute('data-variant')).toBe('outline');

  setInheritedChecked(true);
  flush();
  setInheritedDisabled(false);
  flush();
  setLarge(true);
  flush();
  expect(screen.getByTestId('root')).toBe(root);
  expect(screen.getByTestId('control')).toBe(control);
  expect(input.checked).toBe(true);
  expect(input.disabled).toBe(false);
  expect(input.name).toBe('external');
  expect(control.getAttribute('data-size')).toBe('lg');
  expect(control.getAttribute('data-variant')).toBe('outline');
  expect(root.className).toBe(initialClass);

  fireEvent.click(input);
  await waitFor(
    /** Wait for the caller-owned machine to process the native click. */
    () => expect(input.checked).toBe(false),
  );
  setInheritedChecked(false);
  flush();
  setInheritedDisabled(true);
  flush();
  setInheritedChecked(true);
  flush();
  expect(input.checked).toBe(false);
  expect(input.disabled).toBe(false);
  expect(input.name).toBe('external');
}

it(
  'keeps external Checkbox state under reactive PropsProvider defaults',
  verifiesExternalMachineDefaults,
);
