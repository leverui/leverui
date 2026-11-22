import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import {
  RadioCard,
  RadioCardRoot,
  useRadioCardGroup,
  type RadioCardValueChangeDetails,
} from '../index';

afterEach(cleanup);

/** Render one complete card with a native form control. */
function Card(props: { value: string; label: string; disabled?: boolean }): JSX.Element {
  return (
    <RadioCard.Item value={props.value} disabled={props.disabled}>
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl>
        <RadioCard.ItemContent>
          <RadioCard.ItemText>{props.label}</RadioCard.ItemText>
        </RadioCard.ItemContent>
        <RadioCard.ItemIndicator />
      </RadioCard.ItemControl>
    </RadioCard.Item>
  );
}

/** Confirm the primitive selection updates native radio inputs and submitted values. */
async function verifiesFormSelection(): Promise<void> {
  render(
    /** Mount a native card group through the ordinary consumer tree. */
    () => (
      <>
        <form data-testid="preferences">
          <RadioCard.Root name="framework" defaultValue="react">
            <RadioCard.Label>Framework</RadioCard.Label>
            <Card value="react" label="React" />
            <Card value="solid" label="Solid" />
          </RadioCard.Root>
        </form>
      </>
    ),
  );
  const react = screen.getByRole('radio', { name: 'React' }) as HTMLInputElement;
  const solid = screen.getByRole('radio', { name: 'Solid' }) as HTMLInputElement;
  expect(react.checked).toBe(true);
  fireEvent.click(screen.getByText('Solid'));
  await waitFor(
    /** Wait for the primitive to synchronize selection and the native form input. */
    () => expect(solid.checked).toBe(true),
  );
  expect(react.checked).toBe(false);
  expect(new FormData(screen.getByTestId('preferences') as HTMLFormElement).get('framework')).toBe(
    'solid',
  );
}

it('selects a card and submits its native radio value', verifiesFormSelection);

/** Keep disabled cards out of selection while preserving their label. */
async function verifiesDisabledItem(): Promise<void> {
  render(
    /** Mount a disabled option beside an enabled default. */
    () => (
      <>
        <RadioCard.Root name="framework" defaultValue="react">
          <Card value="react" label="React" />
          <Card value="solid" label="Solid" disabled />
        </RadioCard.Root>
      </>
    ),
  );
  fireEvent.click(screen.getByText('Solid'));
  expect((screen.getByRole('radio', { name: 'React' }) as HTMLInputElement).checked).toBe(true);
  expect((screen.getByRole('radio', { name: 'Solid' }) as HTMLInputElement).disabled).toBe(true);
}

it('does not select a disabled card', verifiesDisabledItem);

/** Follow externally controlled selection through existing radio inputs. */
async function verifiesControlledValue(): Promise<void> {
  /** Own the selected radio value outside its machine. */
  function Example(): JSX.Element {
    const [value, setValue] = createSignal<string | null>('react');

    /** Select another radio from outside the group. */
    function selectSolid(): void {
      setValue('solid');
      flush();
    }

    /** Mirror the primitive's selected value in caller-owned state. */
    function handleValueChange(details: RadioCardValueChangeDetails): void {
      setValue(details.value);
      flush();
    }

    return (
      <>
        <button type="button" onClick={selectSolid}>
          Select Solid
        </button>
        <RadioCard.Root name="framework" value={value()} onValueChange={handleValueChange}>
          <Card value="react" label="React" />
          <Card value="solid" label="Solid" />
        </RadioCard.Root>
      </>
    );
  }

  render(
    /** Mount the controlled consumer. */
    () => <Example />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Select Solid' }));
  await waitFor(
    /** Observe the existing hidden input after external state changes. */
    () =>
      expect((screen.getByRole('radio', { name: 'Solid' }) as HTMLInputElement).checked).toBe(true),
  );
}

it('reacts to externally controlled selection', verifiesControlledValue);

/** Drive a CSS-styled root with an external primitive radio-group accessor. */
async function verifiesRootProvider(): Promise<void> {
  /** Create the machine before rendering the Card root. */
  function Example(): JSX.Element {
    const group = useRadioCardGroup({
      name: 'framework',
      defaultValue: 'react',
      orientation: 'horizontal',
    });
    return (
      <>
        <RadioCard.RootProvider value={group} variant="outline" orientation="horizontal">
          <Card value="react" label="React" />
          <Card value="solid" label="Solid" />
        </RadioCard.RootProvider>
      </>
    );
  }

  render(
    /** Mount the caller-owned machine and CSS-styled root. */
    () => <Example />,
  );
  fireEvent.click(screen.getByText('Solid'));
  await waitFor(
    /** Verify the external machine reaches the native input. */
    () =>
      expect((screen.getByRole('radio', { name: 'Solid' }) as HTMLInputElement).checked).toBe(true),
  );
  const root = document.querySelector('.leverui-radio-card__root');
  expect(root).not.toBeNull();
  expect(root).toHaveAttribute('aria-orientation', 'horizontal');
  expect(root).not.toHaveAttribute('orientation');
}

it('styles a caller-owned radio machine', verifiesRootProvider);

/** Keep selection and public part hooks when authored presentation is suppressed. */
function verifiesUnstyledCard(): void {
  render(
    /** Mount without a styling provider to exercise the CSS-free path. */
    () => (
      <RadioCard.Root name="framework" defaultValue="solid" unstyled>
        <RadioCard.Label>Framework</RadioCard.Label>
        <Card value="solid" label="Solid" />
      </RadioCard.Root>
    ),
  );
  const root = screen.getByRole('radiogroup');
  expect(root).toHaveAttribute('data-unstyled');
  const item = screen.getByText('Solid').closest('.leverui-radio-card__item');
  expect(item).toHaveAttribute('data-unstyled');
  expect(item?.querySelector('.leverui-radio-card__itemControl')).toHaveAttribute('data-unstyled');
  expect(item?.querySelector('.leverui-radio-card__itemIndicator')).toHaveAttribute(
    'data-unstyled',
  );
  expect((screen.getByRole('radio', { name: 'Solid' }) as HTMLInputElement).checked).toBe(true);
}

it('keeps an unstyled card selectable without inserting styles', verifiesUnstyledCard);

/** Keep the flat root export equivalent to the compound root. */
function verifiesFlatExport(): void {
  expect(RadioCardRoot).toBe(RadioCard.Root);
}

it('exports the flat and compound root as one component', verifiesFlatExport);
