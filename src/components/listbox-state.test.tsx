import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, For, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Listbox, createListCollection, useListCollection } from '../index';

afterEach(cleanup);

const choices = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
];

/** Prove an external signal controls selection without replacing item nodes. */
async function verifiesControlledValue(): Promise<void> {
  const collection = createListCollection({ items: choices });

  /** Own the selected value in a Solid component. */
  function Example(): JSX.Element {
    const [value, setValue] = createSignal(['react']);

    /** Apply a value emitted by the primitive machine. */
    function handleValueChange(details: { value: string[] }): void {
      setValue(details.value);
      flush();
    }

    /** Change selection without using the listbox. */
    function selectSolid(): void {
      setValue(['solid']);
      flush();
    }

    return (
      <>
        <button type="button" onClick={selectSolid}>
          Select Solid externally
        </button>
        <Listbox.Root collection={collection} value={value()} onValueChange={handleValueChange}>
          <Listbox.Label>Controlled frameworks</Listbox.Label>
          <Listbox.Content>
            <Listbox.List>
              <For each={choices}>
                {
                  /** Render the same item nodes while value changes. */
                  (item) => <Listbox.Item item={item}>{item.label}</Listbox.Item>
                }
              </For>
            </Listbox.List>
          </Listbox.Content>
        </Listbox.Root>
      </>
    );
  }

  render(
    /** Mount the controlled consumer. */
    () => <Example />,
  );
  const react = screen.getByRole('option', { name: 'React' });
  const solid = screen.getByRole('option', { name: 'Solid' });
  expect(react).toHaveAttribute('aria-selected', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Select Solid externally' }));
  await waitFor(
    /** Follow the external signal through the existing primitive item. */
    () => expect(solid).toHaveAttribute('aria-selected', 'true'),
  );
  expect(react).toHaveAttribute('aria-selected', 'false');
}

it('reacts to controlled selection', verifiesControlledValue);

/** Retain existing values when multiple selection adds another option. */
async function verifiesMultipleSelection(): Promise<void> {
  const collection = createListCollection({ items: choices });
  render(
    /** Mount a multiple-selection machine with one initial value. */
    () => (
      <>
        <Listbox.Root collection={collection} selectionMode="multiple" defaultValue={['react']}>
          <Listbox.Content>
            <Listbox.List>
              <For each={choices}>
                {
                  /** Bind each option to its collection item. */
                  (item) => <Listbox.Item item={item}>{item.label}</Listbox.Item>
                }
              </For>
            </Listbox.List>
          </Listbox.Content>
          <Listbox.Context>
            {
              /** Expose the machine value after keyboard or pointer selection. */
              (api) => <output data-testid="listbox-value">{api().value.join(',')}</output>
            }
          </Listbox.Context>
        </Listbox.Root>
      </>
    ),
  );
  fireEvent.click(screen.getByRole('option', { name: 'Solid' }));
  await waitFor(
    /** Observe both selected values. */
    () => expect(screen.getByTestId('listbox-value')).toHaveTextContent('react,solid'),
  );
}

it('adds values in multiple-selection mode', verifiesMultipleSelection);

/** Filter the visible collection through the optional primitive input. */
async function verifiesFiltering(): Promise<void> {
  /** Own the filtered collection alongside its native input. */
  function Example(): JSX.Element {
    const { collection, filter } = useListCollection({
      initialItems: choices,
      /** Match visible labels regardless of case. */
      filter: (text, query) => text.toLowerCase().includes(query.toLowerCase()),
    });

    /** Update the current list from native input text. */
    function handleInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
      filter(event.currentTarget.value);
    }

    return (
      <>
        <Listbox.Root collection={collection()}>
          <Listbox.Label>Filter frameworks</Listbox.Label>
          <Listbox.Input aria-label="Filter frameworks" onInput={handleInput} />
          <Listbox.Content>
            <Listbox.Empty>No matches</Listbox.Empty>
            <Listbox.List>
              <For each={collection().items}>
                {
                  /** Render the current filtered item set. */
                  (item) => <Listbox.Item item={item}>{item.label}</Listbox.Item>
                }
              </For>
            </Listbox.List>
          </Listbox.Content>
        </Listbox.Root>
      </>
    );
  }

  render(
    /** Mount the input-driven collection. */
    () => <Example />,
  );
  fireEvent.input(screen.getByRole('textbox', { name: 'Filter frameworks' }), {
    target: { value: 'zz' },
  });
  await waitFor(
    /** Show the empty state only when the collection has no items. */
    () => expect(screen.getByText('No matches')).toBeInTheDocument(),
  );
  expect(screen.queryAllByRole('option')).toHaveLength(0);
}

it('filters through the optional input and renders the empty state', verifiesFiltering);
