import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Checkmark, Kbd, Listbox, createListCollection } from '../../src';
import './listbox-examples.css';

/** Group the media options by category. */
export function ListboxGrouped(): JSX.Element {
  const collection = createListCollection({
    items: [
      { label: 'Lanternwright', value: 'lanternwright', category: 'Books' },
      { label: 'Saltwind', value: 'saltwind', category: 'Books' },
      { label: 'The Glass Orchard', value: 'the-glass-orchard', category: 'Books' },
      {
        label: 'The Quiet Harbor',
        value: 'the-quiet-harbor',
        category: 'Movies',
      },
      { label: 'Midnight Ferry', value: 'midnight-ferry', category: 'Movies' },
      { label: 'The Last Lighthouse', value: 'the-last-lighthouse', category: 'Movies' },
    ],
    /** Group each item by its category field. */
    groupBy: (item) => item.category,
  });

  return (
    <Listbox.Root collection={collection} class="example-listbox-fixed">
      <Listbox.Label>Select media</Listbox.Label>
      <Listbox.Content>
        <Listbox.List>
          <For each={collection.group()}>
            {
              /** Separate each category group with a divider line. */
              ([category, items], index) => (
                <Listbox.ItemGroup style={{ 'border-top-width': index() === 0 ? '0' : '1px' }}>
                  <Listbox.ItemGroupLabel>{category}</Listbox.ItemGroupLabel>
                  <For each={items}>
                    {
                      /** Keep the option text and indicator under one machine item. */
                      (item) => (
                        <Listbox.Item item={item}>
                          <Listbox.ItemText>{item.label}</Listbox.ItemText>
                          <Listbox.ItemIndicator />
                        </Listbox.Item>
                      )
                    }
                  </For>
                </Listbox.ItemGroup>
              )
            }
          </For>
        </Listbox.List>
      </Listbox.Content>
    </Listbox.Root>
  );
}

/** Allow independent selection of six toppings. */
export function ListboxMultiselect(): JSX.Element {
  const toppings = createListCollection({
    items: [
      { label: 'Mushrooms', value: 'mushrooms' },
      { label: 'Olives', value: 'olives' },
      { label: 'Peppers', value: 'peppers' },
      { label: 'Onions', value: 'onions' },
      { label: 'Spinach', value: 'spinach' },
      { label: 'Tomatoes', value: 'tomatoes' },
    ],
  });

  return (
    <Listbox.Root collection={toppings} selectionMode="multiple" class="example-listbox-narrow">
      <Listbox.Label>Select toppings (multiple)</Listbox.Label>
      <Listbox.Content>
        <Listbox.List>
          <For each={toppings.items}>
            {
              /** Keep the option text and indicator under one machine item. */
              (topping) => (
                <Listbox.Item item={topping}>
                  <Listbox.ItemText>{topping.label}</Listbox.ItemText>
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

/** Require a modifier for additive range selection. */
export function ListboxExtendedSelect(): JSX.Element {
  const files = createListCollection({
    items: [
      { label: 'report.pdf', value: 'report-pdf' },
      { label: 'budget.xlsx', value: 'budget-xlsx' },
      { label: 'notes.txt', value: 'notes-txt' },
      { label: 'photo.jpg', value: 'photo-jpg' },
    ],
  });

  return (
    <Listbox.Root collection={files} selectionMode="extended">
      <Listbox.Label>
        Select files (hold <Kbd>⌘</Kbd> or <Kbd>^</Kbd> to select multiple)
      </Listbox.Label>
      <Listbox.Content class="example-listbox-narrow">
        <Listbox.List>
          <For each={files.items}>
            {
              /** Keep the option text and indicator under one machine item. */
              (file) => (
                <Listbox.Item item={file}>
                  <Listbox.ItemText>{file.label}</Listbox.ItemText>
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

/** Read one option's selected and disabled state for its checkmark. */
function ItemCheckmark(): JSX.Element {
  const itemState = Listbox.useListboxItemContext();
  return (
    <Checkmark filled size="sm" checked={itemState().selected} disabled={itemState().disabled} />
  );
}

/** Show a checkmark before each multiple-selection option. */
export function ListboxCheckmark(): JSX.Element {
  const channels = createListCollection({
    items: [
      { label: 'Email', value: 'email' },
      { label: 'Text message', value: 'text-message' },
      { label: 'Push notification', value: 'push-notification' },
      { label: 'In-app message', value: 'in-app-message' },
      { label: 'Weekly digest', value: 'weekly-digest' },
      { label: 'Phone call', value: 'phone-call' },
    ],
  });

  return (
    <Listbox.Root collection={channels} selectionMode="multiple" class="example-listbox-narrow">
      <Listbox.Label>Select channels (with checkmarks)</Listbox.Label>
      <Listbox.Content>
        <Listbox.List>
          <For each={channels.items}>
            {
              /** Pair each option's text with its machine-owned checkmark. */
              (channel) => (
                <Listbox.Item item={channel}>
                  <ItemCheckmark />
                  <Listbox.ItemText>{channel.label}</Listbox.ItemText>
                </Listbox.Item>
              )
            }
          </For>
        </Listbox.List>
      </Listbox.Content>
    </Listbox.Root>
  );
}
