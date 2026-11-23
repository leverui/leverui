import { cleanup, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Field, Input, useField, type FieldRootProps } from '../index';

type GetFieldChildProps = Parameters<NonNullable<FieldRootProps['asChild']>>[0];

afterEach(cleanup);

/** Verify public Field parts associate a styled Input with its help and error. */
async function verifiesFieldComposition(): Promise<void> {
  const [invalid, setInvalid] = createSignal(false);
  let receivedRoot: HTMLDivElement | undefined;

  /** Capture the ordinary native root exposed by the public ref. */
  function captureRoot(element: HTMLDivElement): void {
    receivedRoot = element;
  }

  /** Mount a Field whose validation state changes without remounting its control. */
  function Example(): JSX.Element {
    return (
      <>
        <Field.Root
          id="email"
          invalid={invalid()}
          required
          ref={captureRoot}
          data-testid="field-root"
        >
          <Field.Label>
            Email <Field.RequiredIndicator />
          </Field.Label>
          <Input type="email" data-testid="field-control" />
          <Field.HelperText>We will send a receipt</Field.HelperText>
          <Field.ErrorText>Enter a valid email</Field.ErrorText>
        </Field.Root>
      </>
    );
  }

  render(
    /** Keep the signal owner mounted while the field state changes. */
    () => <Example />,
  );
  const input = screen.getByTestId('field-control') as HTMLInputElement;
  const root = screen.getByTestId('field-root');
  expect(receivedRoot).toBe(root);
  expect(root.className).toContain('lui-field__root');
  expect(screen.getByText('Email', { exact: false }).getAttribute('for')).toBe('email');
  expect(input.required).toBe(true);
  expect(screen.getByText('We will send a receipt').tagName).toBe('SPAN');
  await waitFor(
    /** Let the primitive observe the mounted helper text before reading the control. */
    () => expect(input.getAttribute('aria-describedby')).toContain('helper-text'),
  );
  expect(screen.queryByText('Enter a valid email')).toBeNull();
  setInvalid(true);
  flush();
  expect(screen.getByTestId('field-control')).toBe(input);
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(screen.getByText('Enter a valid email').tagName).toBe('SPAN');
  expect(screen.getByText('Enter a valid email').className).toContain('lui-field__errorText');
  await waitFor(
    /** Let the primitive observe the conditional error text after validation changes. */
    () => expect(input.getAttribute('aria-describedby')).toContain('error-text'),
  );
}

it('connects labels, help, errors, and reactive validation', verifiesFieldComposition);

/** Verify an externally owned Field accessor retains required state and styling. */
async function verifiesExternalField(): Promise<void> {
  const [invalid, setInvalid] = createSignal(false);
  let receivedRoot: HTMLDivElement | undefined;

  /** Capture the externally owned field's native root. */
  function captureRoot(element: HTMLDivElement): void {
    receivedRoot = element;
  }

  /** Create the accessor inside the Solid owner before rendering its root. */
  function Example(): JSX.Element {
    const field = useField(
      /** Keep externally owned validation reactive. */
      () => ({ id: 'external', required: true, invalid: invalid() }),
    );
    return (
      <>
        <Field.RootProvider value={field} ref={captureRoot} data-testid="external-root">
          <Field.Label>External</Field.Label>
          <Input data-testid="external-input" />
          <Field.HelperText>External helper</Field.HelperText>
          <Field.ErrorText>External error</Field.ErrorText>
        </Field.RootProvider>
      </>
    );
  }

  render(
    /** Mount the caller-owned Field accessor. */
    () => <Example />,
  );
  const root = screen.getByTestId('external-root');
  const input = screen.getByTestId('external-input') as HTMLInputElement;
  expect(receivedRoot).toBe(root);
  expect(root.className).toContain('lui-field__root');
  expect(input.id).toBe('external');
  expect(input.required).toBe(true);
  await waitFor(
    /** Check the primitive discovers helper text beneath the external root. */
    () => expect(input.getAttribute('aria-describedby')).toContain('helper-text'),
  );
  setInvalid(true);
  flush();
  await waitFor(
    /** Check conditional error text joins the accessible description. */
    () => expect(input.getAttribute('aria-describedby')).toContain('error-text'),
  );
}

it('styles an externally owned Field accessor', verifiesExternalField);

/** Verify a caller-owned root retains the primitive's helper text observer. */
async function verifiesChildRoot(): Promise<void> {
  /** Render a native section with the attributes and children the primitive supplies. */
  function renderRoot(getProps: GetFieldChildProps): JSX.Element {
    return <section {...getProps()} data-testid="custom-root" />;
  }

  render(
    /** Mount an owned root with a helper and styled input. */
    () => (
      <>
        <Field.Root id="custom" asChild={renderRoot}>
          <Field.Label>Custom</Field.Label>
          <Input data-testid="custom-input" />
          <Field.HelperText>Custom helper</Field.HelperText>
        </Field.Root>
      </>
    ),
  );
  expect(screen.getByTestId('custom-root').tagName).toBe('SECTION');
  await waitFor(
    /** Let the primitive discover the helper inside the caller-owned root. */
    () =>
      expect(screen.getByTestId('custom-input').getAttribute('aria-describedby')).toContain(
        'helper-text',
      ),
  );
}

it('connects helper text through a caller-owned root', verifiesChildRoot);
