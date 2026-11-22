import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Input,
  Listbox,
  Text,
  createListCollection,
  useFilter,
  useListCollection,
} from '../../src';
import './listbox-examples.css';

/** Filter fruit options through the Listbox input. */
export function ListboxInput(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });

  /** Match labels without case or accent distinctions. */
  function contains(text: string, query: string): boolean {
    return matcher().contains(text, query);
  }

  const { collection, filter } = useListCollection({
    initialItems: [
      { label: 'Apple', value: 'apple' },
      { label: 'Apricot', value: 'apricot' },
      { label: 'Banana', value: 'banana' },
      { label: 'Blueberry', value: 'blueberry' },
      { label: 'Cherry', value: 'cherry' },
      { label: 'Grape', value: 'grape' },
      { label: 'Lemon', value: 'lemon' },
      { label: 'Mango', value: 'mango' },
      { label: 'Orange', value: 'orange' },
      { label: 'Peach', value: 'peach' },
    ],
    filter: contains,
  });

  /** Refilter the collection as the input value changes. */
  function handleInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    filter(event.currentTarget.value);
  }

  return (
    <Listbox.Root collection={collection()} class="example-listbox-narrow">
      <Listbox.Label>Select fruit</Listbox.Label>
      <Listbox.Input
        asChild={
          /** Keep the Listbox input behavior on the styled Input. */
          (getProps) => (
            <Input
              {...getProps({ onInput: handleInput })}
              placeholder="Type to filter fruits..."
              aria-label="Filter fruits"
            />
          )
        }
      />
      <Listbox.Content style={{ 'max-height': '200px' }}>
        <Listbox.Empty>No fruits found</Listbox.Empty>
        <Listbox.List>
          <For each={collection().items}>
            {
              /** Keep the option text and indicator under one machine item. */
              (fruit) => (
                <Listbox.Item item={fruit}>
                  <Listbox.ItemText>{fruit.label}</Listbox.ItemText>
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

/** Give Home and End keys priority over the text caret. */
export function ListboxKeyboardPriority(): JSX.Element {
  const days = createListCollection({
    items: [
      { label: 'Monday', value: 'monday' },
      { label: 'Tuesday', value: 'tuesday' },
      { label: 'Wednesday', value: 'wednesday' },
      { label: 'Thursday', value: 'thursday' },
      { label: 'Friday', value: 'friday' },
    ],
  });

  return (
    <Listbox.Root collection={days} class="example-listbox-narrow">
      <Listbox.Label>Select day</Listbox.Label>
      <Listbox.Input
        keyboardPriority="navigate"
        asChild={
          /** Keep the Listbox input behavior on the styled Input. */
          (getProps) => (
            <Input {...getProps()} placeholder="Press Home or End" aria-label="Navigate days" />
          )
        }
      />
      <Text textStyle="xs" class="example-listbox-hint">
        Home and End highlight the first and last item instead of moving the text caret.
      </Text>
      <Listbox.Content>
        <Listbox.List>
          <For each={days.items}>
            {
              /** Keep the option text and indicator under one machine item. */
              (day) => (
                <Listbox.Item item={day}>
                  <Listbox.ItemText>{day.label}</Listbox.ItemText>
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
