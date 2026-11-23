import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { InputGroup, NumberInput, useNumberInput } from '../index';

afterEach(cleanup);

/** Exercise primitive-owned value, triggers, native input, and default glyphs. */
function verifiesNumberInputComposition(): void {
  render(
    /** Mount the styled parts under one Number Input machine. */
    () => (
      <>
        <NumberInput.Root defaultValue={4} min={0} max={6} step={2} data-testid="number-root">
          <NumberInput.Label>Quantity</NumberInput.Label>
          <NumberInput.Input data-testid="number-input" />
          <NumberInput.Control data-testid="number-control" />
          <NumberInput.ValueText data-testid="number-value" />
        </NumberInput.Root>
      </>
    ),
  );

  const root = screen.getByTestId('number-root');
  const input = screen.getByTestId('number-input') as HTMLInputElement;
  const control = screen.getByTestId('number-control');
  expect(root.className).toContain('lui-number-input__root');
  expect(input.className).toContain('lui-number-input__input');
  // Zag 2 renders a text field described as a number field, not a spinbutton.
  expect(input.getAttribute('type')).toBe('text');
  expect(input.getAttribute('aria-roledescription')).toBe('number field');
  expect(input.hasAttribute('aria-valuenow')).toBe(false);
  expect(input.value).toBe('4');
  expect(control.querySelectorAll('button')).toHaveLength(2);
  expect(control.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2);
  expect(screen.getByTestId('number-value').textContent).toBe('4');
}

it('composes a styled Number Input with number field semantics', verifiesNumberInputComposition);

/** Keep controlled machine value and inherited defaults reactive. */
function verifiesReactiveNumberInput(): void {
  const [value, setValue] = createSignal<number | null>(2);
  const [disabled, setDisabled] = createSignal(false);
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');

  /** Supply current values from the caller's Solid owner. */
  function Example(): JSX.Element {
    return (
      <>
        <NumberInput.PropsProvider value={() => ({ disabled: disabled(), size: size() })}>
          <NumberInput.Root value={value()} onValueChange={(details) => setValue(details.value)}>
            <NumberInput.Input data-testid="controlled-number-input" />
            <NumberInput.IncrementTrigger data-testid="controlled-increment" />
            <NumberInput.ValueText data-testid="controlled-number-value" />
          </NumberInput.Root>
        </NumberInput.PropsProvider>
      </>
    );
  }

  render(
    /** Mount one signal-driven machine. */
    () => <Example />,
  );
  const input = screen.getByTestId('controlled-number-input') as HTMLInputElement;
  const root = input.closest('.lui-number-input__root');
  if (!root) throw new Error('Controlled Number Input has no root.');
  expect(input.value).toBe('2');
  setValue(5);
  flush();
  expect(input.value).toBe('5');
  setDisabled(true);
  flush();
  setSize('lg');
  flush();
  expect(root.getAttribute('data-size')).toBe('lg');
  expect(input.getAttribute('data-size')).toBe('lg');
  expect(input.disabled).toBe(true);
  expect((screen.getByTestId('controlled-increment') as HTMLButtonElement).disabled).toBe(true);
  expect(screen.getByTestId('controlled-number-value').textContent).toBe('5');
}

it('updates a controlled Number Input and reactive defaults', verifiesReactiveNumberInput);

/** Keep caller-owned primitive state available to Number Input parts. */
function verifiesNumberInputRootProvider(): void {
  /** Create the machine inside the caller's Solid owner. */
  function Example(): JSX.Element {
    const numberInput = useNumberInput({ defaultValue: 8 });
    return (
      <>
        <NumberInput.RootProvider value={numberInput}>
          <NumberInput.Context>
            {
              /** Read the current numeric string through the public accessor. */
              (context) => <output data-testid="number-context">{context().value}</output>
            }
          </NumberInput.Context>
          <NumberInput.Input data-testid="provided-number-input" />
        </NumberInput.RootProvider>
      </>
    );
  }

  render(
    /** Mount a caller-owned machine and its styled input. */
    () => <Example />,
  );
  expect(screen.getByTestId('number-context').textContent).toBe('8');
  expect((screen.getByTestId('provided-number-input') as HTMLInputElement).value).toBe('8');
}

it('supports a caller-owned Number Input machine', verifiesNumberInputRootProvider);

/** Keep a selected native root and its ref under the primitive's machine context. */
function verifiesSelectedNumberInputRoot(): void {
  let selected: HTMLElement | undefined;

  /** Capture the section supplied through the public polymorphic ref. */
  function captureRoot(element: HTMLElement): void {
    selected = element;
  }

  render(
    /** Mount a selected native root with its machine-owned input. */
    () => (
      <>
        <NumberInput.Root
          as="section"
          ref={captureRoot}
          defaultValue={7}
          data-testid="selected-root"
        >
          <NumberInput.Input aria-label="Selected root number" />
        </NumberInput.Root>
      </>
    ),
  );
  const root = screen.getByTestId('selected-root');
  expect(root.tagName).toBe('SECTION');
  expect(selected).toBe(root);
  expect(screen.getByRole('textbox', { name: 'Selected root number' })).toHaveProperty(
    'value',
    '7',
  );
}

it('preserves a selected Number Input root and ref', verifiesSelectedNumberInputRoot);

/** Keep Number Input padding reactive to adornments without replacing the field. */
function verifiesGroupedNumberInput(): void {
  const [adorned, setAdorned] = createSignal(true);
  const [offset, setOffset] = createSignal('0px');

  /** Render a grouped field beside one with caller-owned padding. */
  function Example(): JSX.Element {
    return (
      <>
        <NumberInput.Root defaultValue={10}>
          <InputGroup startElement={adorned() ? '$' : undefined} startOffset={offset()}>
            <NumberInput.Input aria-label="Grouped number" />
          </InputGroup>
        </NumberInput.Root>
        <NumberInput.Root defaultValue={20}>
          <InputGroup startElement="$" startOffset={offset()}>
            <NumberInput.Input
              aria-label="Explicit number"
              style={{ 'padding-inline-start': '8px' }}
            />
          </InputGroup>
        </NumberInput.Root>
      </>
    );
  }

  render(
    /** Mount both numeric fields in one provider. */
    () => <Example />,
  );
  const grouped = screen.getByRole('textbox', { name: 'Grouped number' });
  const explicit = screen.getByRole('textbox', { name: 'Explicit number' });
  const group = grouped.closest('.lui-input-group');
  if (!(group instanceof HTMLElement))
    throw new Error('Grouped Number Input has no Input Group root.');
  expect(group.hasAttribute('data-group-start')).toBe(true);
  expect(group.style.getPropertyValue('--lui-private-input-group-start-offset')).toBe('0px');
  setOffset('4px');
  flush();
  expect(group.style.getPropertyValue('--lui-private-input-group-start-offset')).toBe('4px');
  expect(explicit.style.paddingInlineStart).toBe('8px');
  setAdorned(false);
  flush();
  expect(screen.getByRole('textbox', { name: 'Grouped number' })).toBe(grouped);
  expect(group.hasAttribute('data-group-start')).toBe(false);
}

it('applies reactive Input Group padding to Number Input', verifiesGroupedNumberInput);
