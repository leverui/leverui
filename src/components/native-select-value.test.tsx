import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { NativeSelect } from '../index';

afterEach(cleanup);

/** Preserve an uncontrolled default through interaction, reset, and size updates. */
function verifiesDefaultValue(): void {
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');
  const [defaultValue, setDefaultValue] = createSignal('ca');

  /** Render one native select inside its browser form. */
  function Example(): JSX.Element {
    return (
      <>
        <form data-testid="country-form">
          <NativeSelect.Root size={size()}>
            <NativeSelect.Field
              aria-label="Country"
              name="country"
              placeholder="Choose"
              defaultValue={defaultValue()}
            >
              <option value="ca">Canada</option>
              <option value="us">United States</option>
            </NativeSelect.Field>
          </NativeSelect.Root>
        </form>
      </>
    );
  }

  render(
    /** Keep the form mounted while its props and native value change. */
    () => <Example />,
  );
  const form = screen.getByTestId('country-form') as HTMLFormElement;
  const select = screen.getByRole('combobox', { name: 'Country' }) as HTMLSelectElement;
  expect(select.value).toBe('ca');
  expect(select.options[1]?.defaultSelected).toBe(true);
  expect(new FormData(form).get('country')).toBe('ca');
  fireEvent.change(select, { target: { value: 'us' } });
  setSize('lg');
  flush();
  setDefaultValue('us');
  flush();
  expect(select.value).toBe('us');
  form.reset();
  expect(select.value).toBe('ca');
  expect(new FormData(form).get('country')).toBe('ca');
}

it('keeps default selection stable for native form reset', verifiesDefaultValue);

/** Initialize all selected defaults in a native multiple select. */
function verifiesMultipleDefaults(): void {
  render(
    /** Mount multiple native options under the public field. */
    () => (
      <>
        <NativeSelect.Root>
          <NativeSelect.Field aria-label="Regions" multiple defaultValue={['ca', 'us']}>
            <option value="ca">Canada</option>
            <option value="mx">Mexico</option>
            <option value="us">United States</option>
          </NativeSelect.Field>
        </NativeSelect.Root>
      </>
    ),
  );

  const select = screen.getByRole('listbox', { name: 'Regions' }) as HTMLSelectElement;
  expect(
    Array.from(
      select.selectedOptions,
      /** Read the selected native option values in DOM order. */
      (option) => option.value,
    ),
  ).toEqual(['ca', 'us']);
  expect(select.options[0]?.defaultSelected).toBe(true);
  expect(select.options[1]?.defaultSelected).toBe(false);
  expect(select.options[2]?.defaultSelected).toBe(true);
}

it('initializes multiple default selections', verifiesMultipleDefaults);
