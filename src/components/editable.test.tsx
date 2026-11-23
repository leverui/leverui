import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Editable, useEditable } from '../index';

afterEach(cleanup);

/** Exercise the native input, editing controls, and authored CSS hooks together. */
async function verifiesEditableComposition(): Promise<void> {
  render(
    /** Mount all compound parts under the same primitive machine. */
    () => (
      <>
        <Editable.Root defaultValue="First name" data-testid="editable-root">
          <Editable.Label>Name</Editable.Label>
          <Editable.Area>
            <Editable.Preview data-testid="editable-preview" />
            <Editable.Input data-testid="editable-input" />
          </Editable.Area>
          <Editable.Control>
            <Editable.EditTrigger>Edit</Editable.EditTrigger>
            <Editable.CancelTrigger>Cancel</Editable.CancelTrigger>
            <Editable.SubmitTrigger>Save</Editable.SubmitTrigger>
          </Editable.Control>
        </Editable.Root>
      </>
    ),
  );

  const root = screen.getByTestId('editable-root');
  const preview = screen.getByTestId('editable-preview');
  const input = screen.getByTestId('editable-input') as HTMLInputElement;
  expect(root.className).toContain('lui-editable__root');
  expect(root.hasAttribute('data-editable-root')).toBe(true);
  expect(preview.textContent).toBe('First name');
  expect(input.type).toBe('text');
  expect(input.className).toContain('lui-editable__input');
  fireEvent.click(screen.getByText('Edit'));
  await waitFor(
    /** Wait for the primitive to enter edit mode before replacing the draft. */
    () => expect(input.hidden).toBe(false),
  );
  fireEvent.input(input, { target: { value: 'Updated name' } });
  fireEvent.click(screen.getByText('Save'));
  await waitFor(
    /** The preview reflects the committed machine value. */
    () => expect(preview.textContent).toBe('Updated name'),
  );
}

it('composes styled Editable parts and commits an edited value', verifiesEditableComposition);

/** Keep inherited machine options and CSS size choices reactive. */
function verifiesReactiveEditableDefaults(): void {
  const [disabled, setDisabled] = createSignal(false);
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');

  /** Supply current defaults from the caller's Solid owner. */
  function Example(): JSX.Element {
    return (
      <>
        <Editable.PropsProvider value={() => ({ disabled: disabled(), size: size() })}>
          <Editable.Root defaultValue="Draft" data-testid="reactive-editable-root">
            <Editable.Preview />
            <Editable.Input data-testid="reactive-editable-input" />
          </Editable.Root>
        </Editable.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the signal-driven root once. */
    () => <Example />,
  );
  const root = screen.getByTestId('reactive-editable-root');
  const input = screen.getByTestId('reactive-editable-input') as HTMLInputElement;
  expect(root.getAttribute('data-size')).toBe('sm');
  expect(input.disabled).toBe(false);
  setDisabled(true);
  flush();
  setSize('lg');
  flush();
  expect(input.disabled).toBe(true);
  expect(root.getAttribute('data-size')).toBe('lg');
  setDisabled(false);
  flush();
  expect(input.disabled).toBe(false);
}

it('updates inherited Editable machine state without remounting', verifiesReactiveEditableDefaults);

/** Keep caller-owned machine state available to the compound context. */
function verifiesCallerOwnedEditable(): void {
  /** Create the machine inside the caller's Solid owner. */
  function Example(): JSX.Element {
    const editable = useEditable({ defaultValue: 'Original' });
    return (
      <>
        <Editable.RootProvider value={editable}>
          <Editable.Context>
            {
              /** Read the current value through the public accessor. */
              (context) => <output data-testid="editable-value">{context().value}</output>
            }
          </Editable.Context>
          <Editable.Preview />
          <Editable.Textarea data-testid="editable-textarea" />
        </Editable.RootProvider>
      </>
    );
  }

  render(
    /** Mount the caller-owned provider and textarea together. */
    () => <Example />,
  );
  expect(screen.getByTestId('editable-value').textContent).toBe('Original');
  const textarea = screen.getByTestId('editable-textarea') as HTMLTextAreaElement;
  expect(textarea.tagName).toBe('TEXTAREA');
  expect(textarea.className).toContain('lui-editable__input');
}

it('supports a caller-owned Editable and styled textarea', verifiesCallerOwnedEditable);

/** Compose caller input listeners with Zag's multiline value handler. */
async function verifiesTextareaInputComposition(): Promise<void> {
  let calls = 0;

  /** Count the caller event without taking ownership of machine state. */
  function countInput(): void {
    calls += 1;
  }

  render(
    /** Mount the multiline editor in its active state. */
    () => (
      <>
        <Editable.Root defaultEdit defaultValue="Before">
          <Editable.Context>
            {
              /** Show the machine value after native input events. */
              (context) => <output data-testid="multiline-value">{context().value}</output>
            }
          </Editable.Context>
          <Editable.Textarea data-testid="multiline-input" onInput={countInput} />
        </Editable.Root>
      </>
    ),
  );

  const textarea = screen.getByTestId('multiline-input') as HTMLTextAreaElement;
  fireEvent.input(textarea, { target: { value: 'After' } });
  expect(calls).toBe(1);
  await waitFor(
    /** Wait for Zag to publish the edited value. */
    () => expect(screen.getByTestId('multiline-value').textContent).toBe('After'),
  );
}

it('composes textarea input events with machine updates', verifiesTextareaInputComposition);
