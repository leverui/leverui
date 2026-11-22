import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot,
} from '../index';

afterEach(cleanup);

/** Verify a Solid accessor controls the group without replacing its inputs. */
async function verifiesControlledGroup(): Promise<void> {
  const [selected, setSelected] = createSignal<string[]>(['alpha']);
  const changes: string[][] = [];

  /** Copy the primitive's next selection into the caller's signal. */
  function updateSelected(next: string[]): void {
    changes.push(next);
    setSelected(next);
    flush();
  }

  /** Render the controlled group inside its own Solid owner. */
  function Example(): JSX.Element {
    return (
      <>
        <CheckboxGroup
          name="options"
          aria-label="Options"
          value={selected}
          onValueChange={updateSelected}
        >
          <CheckboxRoot value="alpha">
            <CheckboxControl />
            <CheckboxLabel>Alpha</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
          <CheckboxRoot value="beta">
            <CheckboxControl />
            <CheckboxLabel>Beta</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
        </CheckboxGroup>
      </>
    );
  }

  render(Example);
  const alpha = screen.getByRole('checkbox', { name: 'Alpha' }) as HTMLInputElement;
  const beta = screen.getByRole('checkbox', { name: 'Beta' }) as HTMLInputElement;
  expect(alpha.checked).toBe(true);
  expect(beta.checked).toBe(false);
  fireEvent.click(beta);
  await waitFor(
    /** Observe the consumer signal driving the native group inputs. */
    () => expect(beta.checked).toBe(true),
  );
  expect(changes).toEqual([['alpha', 'beta']]);
  setSelected(['beta']);
  flush();
  expect(alpha.checked).toBe(false);
  expect(beta.checked).toBe(true);
}

it('accepts a controlled Solid accessor for group selection', verifiesControlledGroup);
