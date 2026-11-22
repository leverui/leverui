import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, For, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Combobox, createListCollection } from '../index';

afterEach(cleanup);

const choices = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
];

/** Render all machine controls under caller-owned Solid signals. */
function ControlledExample(): JSX.Element {
  const collection = createListCollection({ items: choices });
  const [value, setValue] = createSignal<string[]>(['solid']);
  const [inputValue, setInputValue] = createSignal('Solid');
  const [open, setOpen] = createSignal(false);

  /** Replace selection from outside the Combobox machine. */
  function selectReact(): void {
    setValue(['react']);
    flush();
  }

  /** Replace the visible input from outside the machine. */
  function editInput(): void {
    setInputValue('React');
    flush();
  }

  /** Open the popup from outside the machine. */
  function openPopup(): void {
    setOpen(true);
    flush();
  }

  /** Keep the controlled value signal in step with the primitive. */
  function updateValue(details: { value: string[] }): void {
    setValue(details.value);
    flush();
  }

  /** Keep the controlled input signal in step with the primitive. */
  function updateInput(details: { inputValue: string }): void {
    setInputValue(details.inputValue);
    flush();
  }

  /** Keep the controlled open signal in step with the primitive. */
  function updateOpen(details: { open: boolean }): void {
    setOpen(details.open);
    flush();
  }

  return (
    <>
      <button type="button" onClick={selectReact}>
        Select React externally
      </button>
      <button type="button" onClick={editInput}>
        Edit input externally
      </button>
      <button type="button" onClick={openPopup}>
        Open externally
      </button>
      <Combobox.Root
        collection={collection}
        value={value()}
        inputValue={inputValue()}
        open={open()}
        onValueChange={updateValue}
        onInputValueChange={updateInput}
        onOpenChange={updateOpen}
      >
        <Combobox.Label>Controlled choice</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.Trigger aria-label="Open choices" />
        </Combobox.Control>
        <Combobox.Context>
          {
            /** Expose the machine value for this controlled-state assertion. */
            (api) => <output data-testid="controlled-value">{api().value.join(',')}</output>
          }
        </Combobox.Context>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.List>
              <For each={choices}>
                {
                  /** Render every selectable item from the same collection. */
                  (item) => <Combobox.Item item={item}>{item.label}</Combobox.Item>
                }
              </For>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Combobox.Root>
    </>
  );
}

/** Prove external updates and machine callbacks both reach the same input. */
async function verifiesControlledState(): Promise<void> {
  render(
    /** Mount the signal-driven consumer example. */
    () => <ControlledExample />,
  );
  const input = screen.getByRole('combobox', { name: 'Controlled choice' }) as HTMLInputElement;
  expect(input.value).toBe('Solid');
  fireEvent.click(screen.getByText('Select React externally'));
  await waitFor(
    /** Wait for the external selection to reach the controlled machine. */
    () => expect(screen.getByTestId('controlled-value').textContent).toBe('react'),
  );
  fireEvent.click(screen.getByText('Edit input externally'));
  await waitFor(
    /** Wait for the external text edit to update the native input. */
    () => expect(input.value).toBe('React'),
  );
  fireEvent.click(screen.getByText('Open externally'));
  expect(await screen.findByRole('option', { name: 'React' })).toBeVisible();
  fireEvent.click(screen.getByRole('option', { name: 'Solid' }));
  await waitFor(
    /** Wait for option selection to update the controlled value. */
    () => expect(screen.getByTestId('controlled-value').textContent).toBe('solid'),
  );
}

it('reacts to controlled value, input, and open changes', verifiesControlledState);

/** Preserve multiple selection through the public collection item API. */
async function verifiesMultipleSelection(): Promise<void> {
  const collection = createListCollection({ items: choices });
  render(
    /** Mount a multiple-selection machine with one initial value. */
    () => (
      <>
        <Combobox.Root collection={collection} multiple defaultValue={['solid']}>
          <Combobox.Label>Multiple choices</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input />
            <Combobox.Trigger aria-label="Open multiple choices" />
          </Combobox.Control>
          <Combobox.Context>
            {
              /** Expose all selected values without changing machine state. */
              (api) => <output data-testid="multiple-value">{api().value.join(',')}</output>
            }
          </Combobox.Context>
          <Combobox.Positioner>
            <Combobox.Content>
              <Combobox.List>
                <For each={choices}>
                  {
                    /** Render the options selected in multiple mode. */
                    (item) => <Combobox.Item item={item}>{item.label}</Combobox.Item>
                  }
                </For>
              </Combobox.List>
            </Combobox.Content>
          </Combobox.Positioner>
        </Combobox.Root>
      </>
    ),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Open multiple choices' }));
  fireEvent.click(await screen.findByRole('option', { name: 'React' }));
  await waitFor(
    /** Wait for the second selection without losing the first value. */
    () => expect(screen.getByTestId('multiple-value').textContent).toBe('solid,react'),
  );
}

it('retains existing values in multiple mode', verifiesMultipleSelection);
