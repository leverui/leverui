import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import {
  CheckboxContext,
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot,
  CheckboxRootProvider,
  useCheckbox,
} from '../index';

afterEach(cleanup);

/** Verify a caller-owned primitive machine drives the styled provider root. */
async function verifiesRootProvider(): Promise<void> {
  /** Create the machine in the Solid owner that renders its provider. */
  function Example(): JSX.Element {
    const checkbox = useCheckbox({ defaultChecked: true, name: 'saved', value: 'yes' });
    return (
      <>
        <CheckboxRootProvider value={checkbox} data-testid="provider-root">
          <CheckboxControl />
          <CheckboxLabel>Saved</CheckboxLabel>
          <CheckboxHiddenInput />
          <CheckboxContext>
            {
              /** Show the current state from the caller-owned machine. */
              (state) => <output data-testid="provider-state">{String(state().checked)}</output>
            }
          </CheckboxContext>
        </CheckboxRootProvider>
      </>
    );
  }

  render(Example);
  const input = screen.getByRole('checkbox', { name: 'Saved' }) as HTMLInputElement;
  const root = screen.getByTestId('provider-root');
  expect(input.checked).toBe(true);
  expect(input.name).toBe('saved');
  expect(root.className).toContain('leverui-checkbox');
  expect(screen.getByTestId('provider-state').textContent).toBe('true');
  fireEvent.click(input);
  await waitFor(
    /** Observe the external machine after the primitive handles the native event. */
    () => expect(screen.getByTestId('provider-state').textContent).toBe('false'),
  );
  expect(input.checked).toBe(false);
}

it('supports a caller-owned Checkbox machine and context', verifiesRootProvider);

/** Verify group selection, form names, and maximum selection behavior. */
async function verifiesCheckboxGroup(): Promise<void> {
  const changes: string[][] = [];

  /** Record the values returned by the primitive's group machine. */
  function recordValues(value: string[]): void {
    changes.push(value);
  }

  render(
    /** Mount two native controls under the same group. */
    () => (
      <>
        <CheckboxGroup
          name="topics"
          aria-label="Topics"
          defaultValue={['a']}
          maxSelectedValues={1}
          onValueChange={recordValues}
          data-testid="group"
        >
          <CheckboxRoot value="a">
            <CheckboxControl />
            <CheckboxLabel>Alpha</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
          <CheckboxRoot value="b">
            <CheckboxControl />
            <CheckboxLabel>Beta</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
        </CheckboxGroup>
      </>
    ),
  );
  const group = screen.getByTestId('group');
  const alpha = screen.getByRole('checkbox', { name: 'Alpha' }) as HTMLInputElement;
  const beta = screen.getByRole('checkbox', { name: 'Beta' }) as HTMLInputElement;
  expect(group.getAttribute('role')).toBe('group');
  expect(screen.getByRole('group', { name: 'Topics' })).toBe(group);
  expect(group.className).toContain('leverui-checkbox-group');
  expect(alpha.checked).toBe(true);
  expect(alpha.name).toBe('topics');
  expect(beta.disabled).toBe(true);
  fireEvent.click(alpha);
  await waitFor(
    /** Wait for the primitive to release the group's selection limit. */
    () => expect(beta.disabled).toBe(false),
  );
  fireEvent.click(beta);
  await waitFor(
    /** Wait for the primitive to select the second value. */
    () => expect(beta.checked).toBe(true),
  );
  expect(changes).toEqual([[], ['b']]);
}

it('coordinates checkbox values through the group machine', verifiesCheckboxGroup);

/** Verify selected native roots keep their role, ref, and checked state. */
async function verifiesSelectedRoot(): Promise<void> {
  let selected: Element | undefined;
  const [checked, setChecked] = createSignal(false);

  /** Capture the custom root element. */
  function captureRoot(element: Element): void {
    selected = element;
  }

  /** Update the caller-owned checked signal. */
  function changeChecked(details: { checked: boolean | 'indeterminate' }): void {
    setChecked(details.checked === true);
    flush();
  }

  render(
    /** Mount the primitive's Checkbox machine on a selected native element. */
    () => (
      <>
        <CheckboxRoot
          as="div"
          ref={captureRoot}
          checked={checked()}
          onCheckedChange={changeChecked}
          data-testid="selected-root"
        >
          <CheckboxControl />
          <CheckboxLabel>Selected root</CheckboxLabel>
          <CheckboxHiddenInput />
        </CheckboxRoot>
      </>
    ),
  );
  const root = screen.getByTestId('selected-root');
  const input = screen.getByRole('checkbox', { name: 'Selected root' }) as HTMLInputElement;
  expect(root.tagName).toBe('DIV');
  expect(selected).toBe(root);
  fireEvent.click(input);
  await waitFor(
    /** Wait for the controlled signal to update the primitive's root. */
    () => expect(root.getAttribute('data-state')).toBe('checked'),
  );
  expect(input.checked).toBe(true);
}

it('supports a selected native Checkbox root', verifiesSelectedRoot);
