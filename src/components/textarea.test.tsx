import { fireEvent, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Field, Textarea, TextareaPropsProvider, type TextareaProps } from '../index';

type GetTextareaChildProps = Parameters<NonNullable<TextareaProps['asChild']>>[0];

/** Verify a standalone Textarea retains native value, attributes, and ref. */
function verifiesNativeTextarea(): void {
  let received: HTMLTextAreaElement | undefined;

  /** Capture the native element exposed by Textarea. */
  function capture(element: HTMLTextAreaElement): void {
    received = element;
  }

  render(
    /** Mount a multiline control without Field context. */
    () => (
      <>
        <Textarea aria-label="Notes" defaultValue="draft" ref={capture} rows={4} />
      </>
    ),
  );
  const control = screen.getByRole('textbox', { name: 'Notes' }) as HTMLTextAreaElement;
  expect(control).toBe(received);
  expect(control.value).toBe('draft');
  expect(control.rows).toBe(4);
  expect(control.className).toContain('leverui-textarea');
  expect(control.hasAttribute('data-field-textarea')).toBe(false);
}

it('preserves native multiline behavior and its ref', verifiesNativeTextarea);

/** Verify Field's label, description, validation, and native state. */
function verifiesFieldComposition(): void {
  render(
    /** Mount a styled Textarea under Lever UI's Field root. */
    () => (
      <>
        <Field.Root id="notes-field" invalid required disabled>
          <Field.Label>Notes</Field.Label>
          <Textarea data-testid="field-textarea" />
          <Field.HelperText>Describe the issue</Field.HelperText>
          <Field.ErrorText>Notes are required</Field.ErrorText>
        </Field.Root>
      </>
    ),
  );
  const control = screen.getByTestId('field-textarea') as HTMLTextAreaElement;
  expect(control.id).toBe('notes-field');
  expect(screen.getByText('Notes').getAttribute('for')).toBe('notes-field');
  expect(control.disabled).toBe(true);
  expect(control.required).toBe(true);
  expect(control.getAttribute('aria-invalid')).toBe('true');
  expect(control.getAttribute('aria-describedby')).toContain('helper-text');
  expect(control.getAttribute('aria-describedby')).toContain('error-text');
  expect(control.hasAttribute('data-field-textarea')).toBe(true);
}

it('composes with Field labels and validation', verifiesFieldComposition);

/** Verify changing provider defaults and controlled text stay reactive. */
function verifiesReactiveTextarea(): void {
  const [large, setLarge] = createSignal(false);
  const [value, setValue] = createSignal('first');
  const calls: string[] = [];

  /** Record the provider's native input event first. */
  function providerInput(): void {
    calls.push('provider');
  }

  /** Copy native textarea content into the controlled signal. */
  function updateValue(event: InputEvent & { currentTarget: HTMLTextAreaElement }): void {
    calls.push('instance');
    setValue(event.currentTarget.value);
    flush();
  }

  /** Render controlled and uncontrolled controls under changing defaults. */
  function Example(): JSX.Element {
    return (
      <>
        <TextareaPropsProvider
          value={{
            size: large() ? 'lg' : 'sm',
            placeholder: large() ? 'Large notes' : 'Small notes',
            onInput: providerInput,
          }}
        >
          <Textarea aria-label="Controlled" value={value()} onInput={updateValue} />
          <Textarea aria-label="Draft" defaultValue="draft" size="xs" />
        </TextareaPropsProvider>
      </>
    );
  }

  render(
    /** Mount the signal-driven Textarea example. */
    () => <Example />,
  );
  const controlled = screen.getByRole('textbox', { name: 'Controlled' }) as HTMLTextAreaElement;
  const draft = screen.getByRole('textbox', { name: 'Draft' }) as HTMLTextAreaElement;
  const initialSize = controlled.getAttribute('data-size');
  const fixedSize = draft.getAttribute('data-size');
  fireEvent.input(controlled, { target: { value: 'second' } });
  expect(calls).toEqual(['provider', 'instance']);
  expect(controlled.value).toBe('second');
  setLarge(true);
  flush();
  expect(controlled.placeholder).toBe('Large notes');
  expect(controlled.getAttribute('data-size')).not.toBe(initialSize);
  expect(draft.getAttribute('data-size')).toBe(fixedSize);
  expect(draft.value).toBe('draft');
}

it('keeps controlled values and provider defaults reactive', verifiesReactiveTextarea);

/** Verify a consumer-owned textarea receives Field and recipe attributes. */
function verifiesChildTextarea(): void {
  let received: HTMLElement | undefined;

  /** Capture the child element returned to the consumer. */
  function capture(element: HTMLElement): void {
    received = element;
  }

  /** Render the consumer's textarea with merged parent attributes. */
  function renderChild(getProps: GetTextareaChildProps): JSX.Element {
    return <textarea {...getProps()} data-testid="child-textarea" />;
  }

  render(
    /** Mount a child-rendered textarea beneath a required Field. */
    () => (
      <>
        <Field.Root id="child-notes" required>
          <Textarea asChild={renderChild} ref={capture} />
        </Field.Root>
      </>
    ),
  );
  const control = screen.getByTestId('child-textarea');
  expect(control).toBe(received);
  expect(control.getAttribute('id')).toBe('child-notes');
  expect(control.hasAttribute('required')).toBe(true);
  expect(control.className).toContain('leverui-textarea');
}

it('forwards Field and recipe props through a Solid child', verifiesChildTextarea);

/** Verify a selected input keeps its own native value and ref type. */
function verifiesSelectedInput(): void {
  let received: HTMLInputElement | undefined;

  /** Capture the selected native input. */
  function capture(element: HTMLInputElement): void {
    received = element;
  }

  render(
    /** Mount the selected element through the public Textarea API. */
    () => (
      <>
        <Textarea as="input" aria-label="Selected input" defaultValue="Draft" ref={capture} />
      </>
    ),
  );
  const control = screen.getByRole('textbox', { name: 'Selected input' }) as HTMLInputElement;
  expect(control).toBe(received);
  expect(control.value).toBe('Draft');
  expect(control.defaultValue).toBe('Draft');
}

it('initializes a selected native input and its ref', verifiesSelectedInput);
