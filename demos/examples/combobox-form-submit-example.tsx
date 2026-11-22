import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Combobox, Field, Portal, Stack, useFilter, useListCollection } from '../../src';
import { formCountries } from './combobox-country-data';

/** Submit a country code through a native form while showing its country name. */
export function ComboboxFormSubmitExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const [selectedCode, setSelectedCode] = createSignal('');
  const { collection, filter } = useListCollection({
    initialItems: formCountries,
    itemToString:
      /** Show country names in the editable input. */
      (item) => item.country,
    itemToValue:
      /** Submit the short country code. */
      (item) => item.code,
    filter:
      /** Search by country name without case sensitivity. */
      (item, query) => matcher().contains(item, query),
  });

  /** Keep the filtered country list current. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  /** Mirror the machine selection into a native hidden input. */
  function changeValue(details: { value: string[] }): void {
    setSelectedCode(details.value[0] ?? '');
  }

  /** Report the submitted country code exactly as the example does. */
  function submit(event: SubmitEvent & { currentTarget: HTMLFormElement }): void {
    event.preventDefault();
    const country = new FormData(event.currentTarget).get('country');
    console.log('Form submitted with country code:', country);
    window.alert(`Selected country code: ${country}`);
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4" align="flex-start">
        <Field.Root class="field-example-width">
          <Field.Label>Country</Field.Label>
          <Combobox.Root
            collection={collection()}
            onInputValueChange={changeInput}
            onValueChange={changeValue}
          >
            <Combobox.Control>
              <Combobox.Input placeholder="Search countries (e.g. United States)" />
              <Combobox.IndicatorGroup>
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
              </Combobox.IndicatorGroup>
            </Combobox.Control>
            <input type="hidden" name="country" value={selectedCode()} readonly />
            <Portal>
              <Combobox.Positioner>
                <Combobox.Content>
                  <Combobox.Empty>No countries found</Combobox.Empty>
                  <Combobox.List>
                    <For each={collection().items}>
                      {
                        /** Render each matching flag and country name. */
                        (item) => (
                          <Combobox.Item item={item}>
                            {item.flag} {item.country}
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
          <Field.HelperText>
            The form sends the country code, such as "US", not the country name.
          </Field.HelperText>
        </Field.Root>
        <Button size="sm" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
import './field-layout.css';
