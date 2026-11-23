import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import {
  RadioGroup,
  RadioGroupRoot,
  useRadioGroup,
  type RadioGroupValueChangeDetails,
} from '../index';

afterEach(cleanup);

/** Render a labeled radio item with its native input and visual mark. */
function Choice(props: { value: string; label: string; disabled?: boolean }): JSX.Element {
  return (
    <RadioGroup.Item value={props.value} disabled={props.disabled}>
      <RadioGroup.ItemHiddenInput />
      <RadioGroup.ItemIndicator />
      <RadioGroup.ItemText>{props.label}</RadioGroup.ItemText>
    </RadioGroup.Item>
  );
}

/** Confirm selection reaches the primitive's native form controls. */
async function verifiesFormSelection(): Promise<void> {
  render(
    /** Mount the group inside its recipe provider. */
    () => (
      <>
        <form data-testid="preferences">
          <RadioGroup.Root name="framework" defaultValue="react">
            <RadioGroup.Label>Framework</RadioGroup.Label>
            <Choice value="react" label="React" />
            <Choice value="solid" label="Solid" />
          </RadioGroup.Root>
        </form>
      </>
    ),
  );
  const react = screen.getByRole('radio', { name: 'React' }) as HTMLInputElement;
  const solid = screen.getByRole('radio', { name: 'Solid' }) as HTMLInputElement;
  expect(react.checked).toBe(true);
  fireEvent.click(screen.getByText('Solid'));
  await waitFor(
    /** Wait for the native radio state to match the selected label. */
    () => expect(solid.checked).toBe(true),
  );
  expect(react.checked).toBe(false);
  expect(new FormData(screen.getByTestId('preferences') as HTMLFormElement).get('framework')).toBe(
    'solid',
  );
  const marks = document.querySelectorAll('.lui-radio-group__itemControl');
  expect(marks).toHaveLength(2);
  expect(marks[1]?.querySelector('.dot')).not.toBeNull();
  expect(marks[0]?.querySelector('.dot')).toBeNull();
}

it('selects a radio and submits its native form value', verifiesFormSelection);

/** Keep disabled radios out of selection. */
function verifiesDisabledItem(): void {
  render(
    /** Mount a disabled option beside an enabled default. */
    () => (
      <>
        <RadioGroup.Root name="framework" defaultValue="react">
          <Choice value="react" label="React" />
          <Choice value="solid" label="Solid" disabled />
        </RadioGroup.Root>
      </>
    ),
  );
  fireEvent.click(screen.getByText('Solid'));
  expect((screen.getByRole('radio', { name: 'React' }) as HTMLInputElement).checked).toBe(true);
  expect((screen.getByRole('radio', { name: 'Solid' }) as HTMLInputElement).disabled).toBe(true);
}

it('does not select a disabled radio', verifiesDisabledItem);

/** Follow caller-owned selection changes without replacing the machine. */
async function verifiesControlledValue(): Promise<void> {
  /** Own the selected value outside Radio Group. */
  function Example(): JSX.Element {
    const [value, setValue] = createSignal<string | null>('react');

    /** Select the second radio from outside the group. */
    function selectSolid(): void {
      setValue('solid');
      flush();
    }

    /** Keep caller state synchronized with the primitive. */
    function handleValueChange(details: RadioGroupValueChangeDetails): void {
      setValue(details.value);
      flush();
    }

    return (
      <>
        <button type="button" onClick={selectSolid}>
          Select Solid
        </button>
        <RadioGroup.Root name="framework" value={value()} onValueChange={handleValueChange}>
          <Choice value="react" label="React" />
          <Choice value="solid" label="Solid" />
        </RadioGroup.Root>
      </>
    );
  }

  render(
    /** Mount the controlled consumer. */
    () => <Example />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Select Solid' }));
  await waitFor(
    /** Observe the primitive's native input after external state changes. */
    () =>
      expect((screen.getByRole('radio', { name: 'Solid' }) as HTMLInputElement).checked).toBe(true),
  );
}

it('reacts to externally controlled selection', verifiesControlledValue);

/** Style a caller-owned machine through the root provider. */
async function verifiesRootProvider(): Promise<void> {
  /** Construct the primitive state before the styled root. */
  function Example(): JSX.Element {
    const group = useRadioGroup({ name: 'framework', defaultValue: 'react' });
    return (
      <>
        <RadioGroup.RootProvider value={group} variant="outline">
          <Choice value="react" label="React" />
          <Choice value="solid" label="Solid" />
        </RadioGroup.RootProvider>
      </>
    );
  }

  render(
    /** Mount the external machine and its recipe context. */
    () => <Example />,
  );
  fireEvent.click(screen.getByText('Solid'));
  await waitFor(
    /** Confirm selection reaches the caller-owned machine. */
    () =>
      expect((screen.getByRole('radio', { name: 'Solid' }) as HTMLInputElement).checked).toBe(true),
  );
  expect(document.querySelector('.lui-radio-group__root')).not.toBeNull();
}

it('styles a caller-owned radio machine', verifiesRootProvider);

/** Keep flat and compound root exports identical. */
function verifiesFlatExport(): void {
  expect(RadioGroupRoot).toBe(RadioGroup.Root);
}

it('exports one flat and compound root', verifiesFlatExport);
