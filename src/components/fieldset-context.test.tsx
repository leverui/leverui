import { cleanup, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Fieldset, useFieldset, useFieldsetContext } from '../index';

afterEach(cleanup);

/** Verify a caller-owned Fieldset exposes changing state and native behavior. */
async function verifiesFieldsetContextTransitions(): Promise<void> {
  const [invalid, setInvalid] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);
  let receivedRoot: HTMLFieldSetElement | undefined;
  let receivedLegend: HTMLLegendElement | undefined;

  /** Capture the actual native group rendered by RootProvider. */
  function captureRoot(element: HTMLFieldSetElement): void {
    receivedRoot = element;
  }

  /** Capture a styled part through its public callback ref. */
  function captureLegend(element: HTMLLegendElement): void {
    receivedLegend = element;
  }

  /** Read the public context hook beneath the caller-owned root. */
  function ContextReader(): JSX.Element {
    const context = useFieldsetContext();
    return (
      <>
        <output data-testid="hook-state">{`${context().invalid}:${context().disabled}`}</output>
        <output data-testid="root-invalid-attribute">
          {String(context().getRootProps()['data-invalid'])}
        </output>
        <output data-testid="legend-disabled-attribute">
          {String(context().getLegendProps()['data-disabled'])}
        </output>
      </>
    );
  }

  /** Keep the accessor and every public part under one Solid owner. */
  function Example(): JSX.Element {
    const fieldset = useFieldset(
      /** Track the two state props after the primitive creates its accessor. */
      () => ({ id: 'controlled-group', invalid: invalid(), disabled: disabled() }),
    );
    return (
      <>
        <Fieldset.RootProvider value={fieldset} ref={captureRoot} data-testid="controlled-group">
          <Fieldset.Legend ref={captureLegend}>Controlled group</Fieldset.Legend>
          <Fieldset.HelperText>Group guidance</Fieldset.HelperText>
          <Fieldset.Content>
            <input data-testid="group-control" />
          </Fieldset.Content>
          <Fieldset.ErrorText>Group validation error</Fieldset.ErrorText>
          <Fieldset.Context>
            {/** Show the values delivered by the primitive's public render callback. */}
            {(context) => (
              <output data-testid="render-state">
                {`${context().invalid}:${context().disabled}`}
              </output>
            )}
          </Fieldset.Context>
          <ContextReader />
        </Fieldset.RootProvider>
      </>
    );
  }

  render(
    /** Mount the accessor-owned native fieldset. */
    () => <Example />,
  );
  const root = screen.getByTestId('controlled-group') as HTMLFieldSetElement;
  const control = screen.getByTestId('group-control') as HTMLInputElement;
  const legend = screen.getByText('Controlled group') as HTMLLegendElement;
  expect(receivedRoot).toBe(root);
  expect(receivedLegend).toBe(legend);
  expect(root.disabled).toBe(false);
  expect(control.matches(':disabled')).toBe(false);
  expect(screen.getByTestId('render-state').textContent).toBe('false:false');
  expect(screen.getByTestId('hook-state').textContent).toBe('false:false');
  expect(screen.getByTestId('root-invalid-attribute').textContent).toBe('undefined');
  expect(screen.getByTestId('legend-disabled-attribute').textContent).toBe('undefined');
  await waitFor(
    /** Wait for the primitive's observer to discover the helper text. */
    () => expect(root.getAttribute('aria-describedby')).toContain('helper-text'),
  );

  setInvalid(true);
  flush();
  setDisabled(true);
  flush();
  expect(root.disabled).toBe(true);
  expect(control.matches(':disabled')).toBe(true);
  expect(screen.getByTestId('render-state').textContent).toBe('true:true');
  expect(screen.getByTestId('hook-state').textContent).toBe('true:true');
  expect(screen.getByTestId('root-invalid-attribute').textContent).toBe('');
  expect(screen.getByTestId('legend-disabled-attribute').textContent).toBe('');
  expect(screen.getByText('Group validation error')).toBeDefined();
  await waitFor(
    /** Wait for the primitive's observer to include the new error text. */
    () => expect(root.getAttribute('aria-describedby')).toContain('error-text'),
  );

  setInvalid(false);
  flush();
  setDisabled(false);
  flush();
  expect(root.disabled).toBe(false);
  expect(control.matches(':disabled')).toBe(false);
  expect(screen.getByTestId('render-state').textContent).toBe('false:false');
  expect(screen.getByTestId('hook-state').textContent).toBe('false:false');
  expect(screen.getByTestId('root-invalid-attribute').textContent).toBe('undefined');
  expect(screen.getByTestId('legend-disabled-attribute').textContent).toBe('undefined');
  expect(screen.queryByText('Group validation error')).toBeNull();
  await waitFor(
    /** Wait for the primitive's observer to remove the hidden error description. */
    () => expect(root.getAttribute('aria-describedby')).not.toContain('error-text'),
  );
  expect(root.getAttribute('aria-describedby')).toContain('helper-text');
}

it(
  'keeps caller-owned state, context, refs, and native controls reactive',
  verifiesFieldsetContextTransitions,
);
