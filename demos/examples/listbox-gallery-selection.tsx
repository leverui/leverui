import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Code, Listbox, Stack, createListCollection } from '../../src';
import './listbox-examples.css';

/** Show four selectable plan options. */
export function ListboxBasic(): JSX.Element {
  const plans = createListCollection({
    items: [
      { label: 'Free', value: 'free' },
      { label: 'Starter', value: 'starter' },
      { label: 'Team', value: 'team' },
      { label: 'Enterprise', value: 'enterprise' },
    ],
  });

  return (
    <Listbox.Root collection={plans} class="example-listbox-fixed">
      <Listbox.Label>Select plan</Listbox.Label>
      <Listbox.Content>
        <Listbox.List>
          <For each={plans.items}>
            {
              /** Keep the option text and indicator under one machine item. */
              (plan) => (
                <Listbox.Item item={plan}>
                  <Listbox.ItemText>{plan.label}</Listbox.ItemText>
                  <Listbox.ItemIndicator />
                </Listbox.Item>
              )
            }
          </For>
        </Listbox.List>
      </Listbox.Content>
    </Listbox.Root>
  );
}

/** Keep the selection in caller-owned Solid state. */
export function ListboxControlled(): JSX.Element {
  const [value, setValue] = createSignal<string[]>([]);
  const regions = createListCollection({
    items: [
      { label: 'North America', value: 'north-america' },
      { label: 'South America', value: 'south-america' },
      { label: 'Europe', value: 'europe' },
      { label: 'Asia Pacific', value: 'asia-pacific' },
    ],
  });

  /** Mirror the Listbox selection into the signal. */
  function changeValue(details: { value: string[] }): void {
    setValue(details.value);
  }

  return (
    <Stack class="example-listbox-panel" gap="4">
      <Listbox.Root collection={regions} value={value()} onValueChange={changeValue}>
        <Listbox.Label>Select region</Listbox.Label>
        <Listbox.Content>
          <Listbox.List>
            <For each={regions.items}>
              {
                /** Keep the option text and indicator under one machine item. */
                (region) => (
                  <Listbox.Item item={region}>
                    <Listbox.ItemText>{region.label}</Listbox.ItemText>
                    <Listbox.ItemIndicator />
                  </Listbox.Item>
                )
              }
            </For>
          </Listbox.List>
        </Listbox.Content>
      </Listbox.Root>

      <Code class="example-listbox-value">Selected: {JSON.stringify(value(), null, 2)}</Code>
    </Stack>
  );
}

/** Expose the caller-owned Listbox machine through RootProvider. */
export function ListboxStore(): JSX.Element {
  const priorities = createListCollection({
    items: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Urgent', value: 'urgent' },
    ],
  });
  const listbox = Listbox.useListbox({ collection: priorities });

  return (
    <Stack class="example-listbox-panel" gap="4">
      <Listbox.RootProvider value={listbox}>
        <Listbox.Label>Select priority</Listbox.Label>
        <Listbox.Content>
          <Listbox.List>
            <For each={priorities.items}>
              {
                /** Keep the option text and indicator under one machine item. */
                (priority) => (
                  <Listbox.Item item={priority}>
                    <Listbox.ItemText>{priority.label}</Listbox.ItemText>
                    <Listbox.ItemIndicator />
                  </Listbox.Item>
                )
              }
            </For>
          </Listbox.List>
        </Listbox.Content>
      </Listbox.RootProvider>

      <Code class="example-listbox-value">
        Selected: {JSON.stringify(listbox().value, null, 2)}
      </Code>
    </Stack>
  );
}

/** Mark two sold-out sizes as disabled options. */
export function ListboxDisabledItem(): JSX.Element {
  const sizes = createListCollection({
    items: [
      { label: 'Extra small', value: 'extra-small' },
      { label: 'Small', value: 'small' },
      { label: 'Medium', value: 'medium', disabled: true },
      { label: 'Large', value: 'large' },
      { label: 'Extra large', value: 'extra-large', disabled: true },
    ],
  });

  return (
    <Listbox.Root collection={sizes} class="example-listbox-fixed">
      <Listbox.Label>Select size</Listbox.Label>
      <Listbox.Content>
        <Listbox.List>
          <For each={sizes.items}>
            {
              /** Keep each item's disabled state in the collection. */
              (size) => (
                <Listbox.Item item={size}>
                  <Listbox.ItemText>{size.label}</Listbox.ItemText>
                  <Listbox.ItemIndicator />
                </Listbox.Item>
              )
            }
          </For>
        </Listbox.List>
      </Listbox.Content>
    </Listbox.Root>
  );
}
