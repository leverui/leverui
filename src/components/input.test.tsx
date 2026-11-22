import { Field as PrimitiveField } from '../primitives/components/field';
import { fireEvent, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Input, InputPropsProvider, type InputProps } from '../index';

type GetInputChildProps = Parameters<NonNullable<InputProps['asChild']>>[0];

/** Verify the ungrouped control keeps native input behavior and its ref. */
function verifiesNativeInput(): void {
  let received: HTMLInputElement | undefined;

  /** Capture the actual native control passed to a consumer. */
  function capture(element: HTMLInputElement): void {
    received = element;
  }

  render(
    /** Mount an independent input without a styling provider. */
    () => (
      <Input
        id="native-input"
        ref={capture}
        aria-label="Account name"
        defaultValue="draft"
        data-testid="native-input"
      />
    ),
  );
  const input = screen.getByRole('textbox', { name: 'Account name' }) as HTMLInputElement;
  expect(input).toBe(received);
  expect(input).toHaveProperty('value', 'draft');
  expect(input.hasAttribute('data-field-input')).toBe(false);
  expect(input.hasAttribute('aria-invalid')).toBe(false);
  expect(input.className).toContain('leverui-input');
}

it('preserves native input props and the primitive Field attributes', verifiesNativeInput);

/** Verify the primitive Field supplies connected IDs, validation, and disabled state. */
function verifiesFieldComposition(): void {
  render(
    /** Mount the styled input inside the primitive's field context. */
    () => (
      <PrimitiveField.Root id="email" invalid required disabled>
        <PrimitiveField.Label>Email</PrimitiveField.Label>
        <Input type="email" data-testid="field-input" />
        <PrimitiveField.ErrorText>Enter a valid address</PrimitiveField.ErrorText>
      </PrimitiveField.Root>
    ),
  );
  const input = screen.getByTestId('field-input') as HTMLInputElement;
  expect(input.id).toBe('email');
  expect(screen.getByText('Email').getAttribute('for')).toBe('email');
  expect(input.disabled).toBe(true);
  expect(input.required).toBe(true);
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(input.getAttribute('data-invalid')).toBe('');
  expect(input.hasAttribute('data-field-input')).toBe(true);
}

it('composes the primitive Field IDs and accessibility state', verifiesFieldComposition);

/** Verify Input combines reactive defaults with controlled and native events. */
function verifiesReactiveInput(): void {
  const [large, setLarge] = createSignal(false);
  const [value, setValue] = createSignal('first');
  const calls: string[] = [];

  /** Record the provider's input event before the instance handler. */
  function providerInput(): void {
    calls.push('provider');
  }

  /** Update the controlled value from the native Solid input event. */
  function instanceInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    calls.push('instance');
    setValue(event.currentTarget.value);
    flush();
  }

  /** Render changing appearance defaults around controlled and uncontrolled fields. */
  function Example(): JSX.Element {
    return (
      <InputPropsProvider
        value={{
          size: large() ? 'lg' : 'sm',
          placeholder: large() ? 'Large' : 'Small',
          onInput: providerInput,
        }}
      >
        <Input data-testid="controlled-input" value={value()} onInput={instanceInput} />
        <Input data-testid="uncontrolled-input" defaultValue="draft" size="xs" />
      </InputPropsProvider>
    );
  }

  render(
    /** Mount the signal-driven input example. */
    () => <Example />,
  );
  const controlled = screen.getByTestId('controlled-input') as HTMLInputElement;
  const uncontrolled = screen.getByTestId('uncontrolled-input') as HTMLInputElement;
  const initialClass = controlled.className;
  const fixedClass = uncontrolled.className;
  fireEvent.input(controlled, { target: { value: 'second' } });
  expect(calls).toEqual(['provider', 'instance']);
  expect(controlled.value).toBe('second');
  expect(uncontrolled.value).toBe('draft');
  setLarge(true);
  flush();
  expect(controlled.placeholder).toBe('Large');
  expect(controlled.className).toBe(initialClass);
  expect(controlled).toHaveAttribute('data-size', 'lg');
  expect(uncontrolled.className).toBe(fixedClass);
  expect(uncontrolled).toHaveAttribute('data-size', 'xs');
  expect(uncontrolled.value).toBe('draft');
}

it('keeps controlled values and provider defaults reactive', verifiesReactiveInput);

/** Verify the nested primitive and Lever UI child renderers preserve input props. */
function verifiesChildInput(): void {
  let received: Element | undefined;

  /** Receive the element rendered by the consumer's child function. */
  function capture(element: Element): void {
    received = element;
  }

  /** Render the child control with its merged field and styled props. */
  function renderChild(getProps: GetInputChildProps): JSX.Element {
    return <input {...getProps()} data-testid="child-input" />;
  }

  render(
    /** Mount the child-rendered control beneath the primitive's field root. */
    () => (
      <PrimitiveField.Root id="child-field" required>
        <Input asChild={renderChild} ref={capture} />
      </PrimitiveField.Root>
    ),
  );
  const input = screen.getByTestId('child-input');
  expect(input).toBe(received);
  expect(input.getAttribute('id')).toBe('child-field');
  expect(input.hasAttribute('required')).toBe(true);
  expect(input.className).toContain('leverui-input');
}

it('forwards field props through a Solid child renderer', verifiesChildInput);

/** Verify native element selection keeps the matching ref and field state. */
function verifiesSelectedElement(): void {
  let received: HTMLTextAreaElement | undefined;

  /** Capture the selected native textarea instead of the default input. */
  function capture(element: HTMLTextAreaElement): void {
    received = element;
  }

  render(
    /** Mount a selected element beneath the primitive's field context. */
    () => (
      <PrimitiveField.Root id="selected-field" required>
        <Input as="textarea" ref={capture} data-testid="selected-input" />
      </PrimitiveField.Root>
    ),
  );
  const selected = screen.getByTestId('selected-input');
  expect(selected).toBe(received);
  expect(selected.tagName).toBe('TEXTAREA');
  expect(selected.getAttribute('id')).toBe('selected-field');
  expect(selected.hasAttribute('required')).toBe(true);
}

it('preserves native element selection and its ref', verifiesSelectedElement);
