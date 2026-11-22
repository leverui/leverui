import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, Field, Portal, useFilter, useListCollection } from '../../src';
import { frameworks } from './combobox-framework-data';
import './field-layout.css';

/** Place the common framework picker inside the Field composition. */
export function ComboboxFieldExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels without case sensitivity. */
      (item, query) => matcher().contains(item, query),
  });

  /** Filter the options as the field input changes. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  return (
    <Field.Root class="field-example-width">
      <Field.Label>Select framework</Field.Label>
      <Combobox.Root collection={collection()} onInputValueChange={changeInput}>
        <Combobox.Control>
          <Combobox.Input placeholder="Type to search" />
          <Combobox.IndicatorGroup>
            <Combobox.ClearTrigger />
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Field.HelperText>The framework you use most</Field.HelperText>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content>
              <Combobox.Empty>No items found</Combobox.Empty>
              <Combobox.List>
                <For each={collection().items}>
                  {
                    /** Render the current filtered framework options. */
                    (item) => (
                      <Combobox.Item item={item}>
                        {item.label}
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    )
                  }
                </For>
              </Combobox.List>
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </Field.Root>
  );
}
