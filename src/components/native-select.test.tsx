import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Field, NativeSelect } from '../index';

afterEach(cleanup);

/** Verify the public parts render a native select and preserve its form contract. */
async function verifiesNativeControl(): Promise<void> {
  let received: HTMLSelectElement | undefined;
  let changed = '';

  /** Capture the select rather than its decorative wrapper. */
  function capture(element: HTMLSelectElement): void {
    received = element;
  }

  /** Read the selected native value from a standard change event. */
  function onChange(event: Event): void {
    changed = (event.currentTarget as HTMLSelectElement).value;
  }

  render(
    /** Mount the public compound parts under the styling provider. */
    () => (
      <>
        <NativeSelect.Root variant="outline" size="md" data-testid="select-root">
          <NativeSelect.Field
            aria-label="Country"
            name="country"
            placeholder="Choose a country"
            ref={capture}
            onChange={onChange}
          >
            <option value="ca">Canada</option>
            <option value="us">United States</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator data-testid="select-indicator" />
        </NativeSelect.Root>
      </>
    ),
  );

  const select = screen.getByRole('combobox', { name: 'Country' }) as HTMLSelectElement;
  expect(received).toBe(select);
  expect(select.name).toBe('country');
  expect(select.className).toContain('leverui-native-select__field');
  expect(screen.getByTestId('select-root').className).toContain('leverui-native-select__root');
  expect(select.options[0]?.value).toBe('');
  expect(select.options[0]?.textContent).toBe('Choose a country');
  expect(screen.getByTestId('select-indicator').querySelector('svg')).not.toBeNull();
  fireEvent.change(select, { target: { value: 'ca' } });
  expect(select.value).toBe('ca');
  expect(changed).toBe('ca');
}

it('renders an editable native select with placeholder, ref, and indicator', verifiesNativeControl);

/** Verify enclosing Field state wins and updates the native control in place. */
async function verifiesFieldInheritance(): Promise<void> {
  const [disabled, setDisabled] = createSignal(false);
  const [invalid, setInvalid] = createSignal(false);

  /** Keep the enclosing Field's state live across changes. */
  function Example(): JSX.Element {
    return (
      <>
        <Field.Root id="region" disabled={disabled()} invalid={invalid()} required>
          <Field.Label>Region</Field.Label>
          <NativeSelect.Root disabled invalid={false}>
            <NativeSelect.Field>
              <option value="west">West</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator data-testid="state-indicator" />
          </NativeSelect.Root>
          <Field.ErrorText>Select a region</Field.ErrorText>
        </Field.Root>
      </>
    );
  }

  render(
    /** Mount the Field before toggling inherited state. */
    () => <Example />,
  );
  const select = screen.getByRole('combobox', { name: 'Region' }) as HTMLSelectElement;
  const indicator = screen.getByTestId('state-indicator');
  expect(select.disabled).toBe(false);
  expect(select.required).toBe(true);
  expect(select.id).toBe('region');
  expect(indicator.hasAttribute('data-disabled')).toBe(false);
  setDisabled(true);
  flush();
  setInvalid(true);
  flush();
  expect(screen.getByRole('combobox', { name: 'Region' })).toBe(select);
  expect(select.disabled).toBe(true);
  expect(select.getAttribute('aria-invalid')).toBe('true');
  expect(indicator.hasAttribute('data-disabled')).toBe(true);
  expect(indicator.hasAttribute('data-invalid')).toBe(true);
  await waitFor(
    /** Wait for the primitive to discover the newly rendered Field error text. */
    () => expect(select.getAttribute('aria-describedby')).toContain('error-text'),
  );
}

it('inherits reactive disabled and invalid state from Field', verifiesFieldInheritance);

/** Verify a provider changes root variants without remounting the native select. */
function verifiesProviderDefaults(): void {
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');

  /** Render the root under a reactive defaults provider. */
  function Example(): JSX.Element {
    return (
      <>
        <NativeSelect.PropsProvider value={() => ({ size: size() })}>
          <NativeSelect.Root data-testid="provider-root">
            <NativeSelect.Field aria-label="Size">
              <option value="one">One</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator>Custom</NativeSelect.Indicator>
          </NativeSelect.Root>
        </NativeSelect.PropsProvider>
      </>
    );
  }

  render(
    /** Preserve one native element while provider values update. */
    () => <Example />,
  );
  const select = screen.getByRole('combobox', { name: 'Size' });
  expect(screen.getByText('Custom').querySelector('svg')).toBeNull();
  const root = screen.getByTestId('provider-root');
  const before = root.className;
  expect(root).toHaveAttribute('data-size', 'sm');
  setSize('lg');
  flush();
  expect(screen.getByRole('combobox', { name: 'Size' })).toBe(select);
  expect(root).toHaveAttribute('data-size', 'lg');
  expect(root.className).toBe(before);
}

it('applies reactive provider defaults to the root', verifiesProviderDefaults);

/** Keep a controlled native value and root-owned state reactive. */
function verifiesControlledValue(): void {
  const [value, setValue] = createSignal('ca');
  const [disabled, setDisabled] = createSignal(false);

  /** Update the Solid value from a native change event. */
  function handleChange(event: Event): void {
    setValue((event.currentTarget as HTMLSelectElement).value);
    flush();
  }

  /** Render the same native control as external state changes. */
  function Example(): JSX.Element {
    return (
      <>
        <NativeSelect.Root disabled={disabled()}>
          <NativeSelect.Field
            aria-label="Controlled country"
            value={value()}
            onChange={handleChange}
          >
            <option value="ca">Canada</option>
            <option value="us">United States</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator data-testid="controlled-indicator" />
        </NativeSelect.Root>
      </>
    );
  }

  render(
    /** Mount the controlled select under a stable owner. */
    () => <Example />,
  );
  const select = screen.getByRole('combobox', { name: 'Controlled country' }) as HTMLSelectElement;
  expect(select.value).toBe('ca');
  setValue('us');
  flush();
  expect(screen.getByRole('combobox', { name: 'Controlled country' })).toBe(select);
  expect(select.value).toBe('us');
  fireEvent.change(select, { target: { value: 'ca' } });
  expect(select.value).toBe('ca');
  setDisabled(true);
  flush();
  expect(select.disabled).toBe(true);
  expect(screen.getByTestId('controlled-indicator').hasAttribute('data-disabled')).toBe(true);
}

it('keeps controlled values and root-owned disabled state reactive', verifiesControlledValue);
