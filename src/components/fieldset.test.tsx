import { cleanup, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Field, Fieldset, Input, useFieldset, type FieldsetRootProps } from '../index';

type GetFieldsetChildProps = Parameters<NonNullable<FieldsetRootProps['asChild']>>[0];

afterEach(cleanup);

/** Verify native grouping, descriptions, validation, and nested Field state. */
async function verifiesFieldsetComposition(): Promise<void> {
  const [invalid, setInvalid] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);
  let receivedRoot: HTMLFieldSetElement | undefined;

  /** Capture the native group exposed to consumers. */
  function captureRoot(element: HTMLFieldSetElement): void {
    receivedRoot = element;
  }

  /** Keep the primitive Fieldset and Field state in the same Solid owner. */
  function Example(): JSX.Element {
    return (
      <>
        <Fieldset.Root
          id="account"
          invalid={invalid()}
          disabled={disabled()}
          ref={captureRoot}
          data-testid="group"
        >
          <Fieldset.Legend>Account details</Fieldset.Legend>
          <Fieldset.HelperText>Complete both fields</Fieldset.HelperText>
          <Fieldset.Content>
            <Field.Root id="name" invalid={invalid()}>
              <Field.Label>Name</Field.Label>
              <Input data-testid="name-input" />
            </Field.Root>
          </Fieldset.Content>
          <Fieldset.ErrorText>Check this group</Fieldset.ErrorText>
        </Fieldset.Root>
      </>
    );
  }

  render(
    /** Mount the reactive Fieldset without freezing its props. */
    () => <Example />,
  );
  const group = screen.getByTestId('group') as HTMLFieldSetElement;
  const input = screen.getByTestId('name-input') as HTMLInputElement;
  const legend = screen.getByText('Account details');
  expect(receivedRoot).toBe(group);
  expect(group.tagName).toBe('FIELDSET');
  expect(group.className).toContain('leverui-fieldset__root');
  expect(group.getAttribute('aria-labelledby')).toBe(legend.id);
  expect(screen.getByText('Complete both fields').tagName).toBe('SPAN');
  expect(group.querySelector('.leverui-fieldset__content')).not.toBeNull();
  await waitFor(
    /** Let the primitive observe the mounted Fieldset helper text. */
    () => expect(group.getAttribute('aria-describedby')).toContain('helper-text'),
  );
  expect(screen.queryByText('Check this group')).toBeNull();
  setInvalid(true);
  flush();
  expect(screen.getByTestId('name-input')).toBe(input);
  expect(group.getAttribute('data-invalid')).toBe('');
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(screen.getByText('Check this group').tagName).toBe('SPAN');
  await waitFor(
    /** Let the primitive observe the conditional group error. */
    () => expect(group.getAttribute('aria-describedby')).toContain('error-text'),
  );
  setDisabled(true);
  flush();
  expect(group.disabled).toBe(true);
  expect(input.closest('fieldset')).toBe(group);
}

it(
  'groups controls with reactive descriptions and native disabled state',
  verifiesFieldsetComposition,
);

/** Verify the caller-owned Fieldset accessor connects the primitive's root observer. */
async function verifiesExternalFieldset(): Promise<void> {
  const [invalid, setInvalid] = createSignal(false);
  let receivedRoot: HTMLFieldSetElement | undefined;

  /** Capture the native root supplied by the accessor-owned path. */
  function captureRoot(element: HTMLFieldSetElement): void {
    receivedRoot = element;
  }

  /** Create the accessor inside the mounted Solid owner. */
  function Example(): JSX.Element {
    const fieldset = useFieldset(
      /** Keep caller-owned validation reactive. */
      () => ({ id: 'external-group', invalid: invalid() }),
    );
    return (
      <>
        <Fieldset.RootProvider value={fieldset} ref={captureRoot} data-testid="external-group">
          <Fieldset.Legend>External group</Fieldset.Legend>
          <Fieldset.HelperText>External helper</Fieldset.HelperText>
          <Fieldset.ErrorText>External error</Fieldset.ErrorText>
        </Fieldset.RootProvider>
      </>
    );
  }

  render(
    /** Mount the accessor-owned root. */
    () => <Example />,
  );
  const root = screen.getByTestId('external-group');
  expect(receivedRoot).toBe(root);
  await waitFor(
    /** Confirm the primitive observes the helper under its external root. */
    () => expect(root.getAttribute('aria-describedby')).toContain('helper-text'),
  );
  setInvalid(true);
  flush();
  await waitFor(
    /** Confirm the conditional error joins the group description. */
    () => expect(root.getAttribute('aria-describedby')).toContain('error-text'),
  );
}

it('connects descriptions through an external Fieldset accessor', verifiesExternalFieldset);

/** Verify a caller-owned root keeps the Fieldset description observer. */
async function verifiesChildFieldset(): Promise<void> {
  let receivedRoot: Element | undefined;
  let receivedLegend: Element | undefined;

  /** Capture the selected root without promising a native fieldset. */
  function captureRoot(element: Element): void {
    receivedRoot = element;
  }

  /** Capture the selected legend without promising a native legend. */
  function captureLegend(element: Element): void {
    receivedLegend = element;
  }

  /** Render the native child with the attributes the primitive supplies. */
  function renderRoot(getProps: GetFieldsetChildProps): JSX.Element {
    return <section {...getProps()} data-testid="custom-group" />;
  }

  render(
    /** Mount a selected root with a helper inside its component root. */
    () => (
      <>
        <Fieldset.Root id="custom-group" asChild={renderRoot} ref={captureRoot}>
          <Fieldset.Legend as="div" ref={captureLegend}>
            Custom group
          </Fieldset.Legend>
          <Fieldset.HelperText>Custom helper</Fieldset.HelperText>
        </Fieldset.Root>
      </>
    ),
  );
  const root = screen.getByTestId('custom-group');
  expect(root.tagName).toBe('SECTION');
  expect(receivedRoot).toBe(root);
  expect(receivedLegend).toBe(screen.getByText('Custom group'));
  expect(receivedLegend?.tagName).toBe('DIV');
  await waitFor(
    /** Confirm the primitive discovers helper text inside the selected root. */
    () => expect(root.getAttribute('aria-describedby')).toContain('helper-text'),
  );
}

it('connects helper text through a caller-owned Fieldset root', verifiesChildFieldset);
