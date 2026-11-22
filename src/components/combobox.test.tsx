import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, For, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Combobox, Field, createListCollection, useListCollection } from '../index';

afterEach(cleanup);

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
];

/** Exercise the public root, item parts, native selection, and default icons. */
async function verifiesComboboxSelection(): Promise<void> {
  const collection = createListCollection({ items: frameworks });
  const changes: string[][] = [];

  /** Record the primitive's selected value without replacing its machine. */
  function recordValue(details: { value: string[] }): void {
    changes.push(details.value);
  }

  render(
    /** Mount a complete Combobox under the Lever UI provider. */
    () => (
      <>
        <form data-testid="combobox-form">
          <Combobox.Root collection={collection} name="framework" onValueChange={recordValue}>
            <Combobox.Label>Framework</Combobox.Label>
            <Combobox.Control>
              <Combobox.Input placeholder="Choose one" />
              <Combobox.IndicatorGroup>
                <Combobox.ClearTrigger data-testid="clear-trigger" />
                <Combobox.Trigger data-testid="trigger" />
              </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Combobox.Positioner>
              <Combobox.Content>
                <Combobox.Empty>No matches</Combobox.Empty>
                <Combobox.List>
                  <For each={frameworks}>
                    {
                      /** Render each item with its own machine context. */
                      (item) => (
                        <Combobox.Item item={item}>
                          <Combobox.ItemText>{item.label}</Combobox.ItemText>
                          <Combobox.ItemIndicator />
                        </Combobox.Item>
                      )
                    }
                  </For>
                </Combobox.List>
              </Combobox.Content>
            </Combobox.Positioner>
          </Combobox.Root>
        </form>
      </>
    ),
  );

  const input = screen.getByRole('combobox', { name: 'Framework' }) as HTMLInputElement;
  const trigger = screen.getByTestId('trigger');
  expect(input.className).toContain('leverui-combobox__input');
  expect(trigger.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  expect(
    screen.getByTestId('clear-trigger').querySelector('svg[aria-hidden="true"]'),
  ).not.toBeNull();
  fireEvent.click(trigger);
  const option = await screen.findByRole('option', { name: 'Solid' });
  fireEvent.click(option);
  await waitFor(
    /** Follow the primitive's selected text and one value notification. */
    () => expect(input.value).toBe('Solid'),
  );
  expect(changes).toEqual([['solid']]);
  const form = screen.getByTestId('combobox-form') as HTMLFormElement;
  expect(new FormData(form).get('framework')).toBe('Solid');
}

it('composes a selectable Combobox with native form behavior', verifiesComboboxSelection);

/** Keep a filtered collection and reactive CSS choices tied to one input. */
async function verifiesFilteringAndVariants(): Promise<void> {
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');

  /** Create a collection and filter callback in the component owner. */
  function Example(): JSX.Element {
    const { collection, filter } = useListCollection({
      initialItems: frameworks,
      /** Match the visible label without coupling the filter to item shape. */
      filter: (itemText, filterText) => itemText.toLowerCase().includes(filterText.toLowerCase()),
    });

    /** Filter visible items using the current input value. */
    function handleInputChange(details: { inputValue: string }): void {
      filter(details.inputValue);
    }

    return (
      <>
        <Combobox.PropsProvider value={() => ({ size: size() })}>
          <Combobox.Root collection={collection()} onInputValueChange={handleInputChange}>
            <Combobox.Label>Search frameworks</Combobox.Label>
            <Combobox.Control>
              <Combobox.Input data-testid="filter-input" />
              <Combobox.Trigger aria-label="Show frameworks" />
            </Combobox.Control>
            <Combobox.Positioner>
              <Combobox.Content>
                <Combobox.Empty>No matches</Combobox.Empty>
                <Combobox.List>
                  <For each={collection().items}>
                    {
                      /** Keep rendered items aligned with the filtered collection. */
                      (item) => <Combobox.Item item={item}>{item.label}</Combobox.Item>
                    }
                  </For>
                </Combobox.List>
              </Combobox.Content>
            </Combobox.Positioner>
          </Combobox.Root>
        </Combobox.PropsProvider>
      </>
    );
  }

  render(
    /** Mount signal-driven CSS choices and the collection together. */
    () => <Example />,
  );
  const input = screen.getByTestId('filter-input') as HTMLInputElement;
  const originalInput = input;
  fireEvent.click(screen.getByRole('button', { name: 'Show frameworks' }));
  fireEvent.input(input, { target: { value: 'zzz' } });
  await waitFor(
    /** Show the empty state only after the collection has filtered out items. */
    () => expect(screen.getByText('No matches')).toBeVisible(),
  );
  setSize('lg');
  flush();
  expect(screen.getByTestId('filter-input')).toBe(originalInput);
}

it('filters a reactive collection without replacing the input', verifiesFilteringAndVariants);

/** Preserve Field-derived validation and native input attributes. */
function verifiesFieldComposition(): void {
  const collection = createListCollection({ items: frameworks });
  render(
    /** Compose the Combobox with the existing Field context. */
    () => (
      <>
        <Field.Root id="framework-field" required invalid>
          <Field.Label>Required framework</Field.Label>
          <Combobox.Root collection={collection}>
            <Combobox.Control>
              <Combobox.Input />
            </Combobox.Control>
          </Combobox.Root>
          <Field.HelperText>Choose a framework</Field.HelperText>
          <Field.ErrorText>Framework is required</Field.ErrorText>
        </Field.Root>
      </>
    ),
  );
  const input = screen.getByRole('combobox', { name: 'Required framework' });
  expect(input).toHaveAttribute('required');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('error-text'));
}

it('inherits accessible Field validation state', verifiesFieldComposition);
