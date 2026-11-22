import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import { ChevronDownIcon } from '@lucide/solid';
import { Button, Listbox, Popover, useFilter, useListCollection } from '../../src';
import '../listbox-popover-example.css';

/** Open a searchable Listbox from a Popover and show the selected label. */
export function ListboxPopover(): JSX.Element {
  const [inputValue, setInputValue] = createSignal('');
  const [open, setOpen] = createSignal(false);
  const matcher = useFilter({ sensitivity: 'base' });
  let trigger: HTMLElement | undefined;

  /** Match labels without case or accent distinctions. */
  function contains(text: string, query: string): boolean {
    return matcher().contains(text, query);
  }

  const { collection, filter } = useListCollection({
    initialItems: [
      { label: 'English', value: 'english' },
      { label: 'Spanish', value: 'spanish' },
      { label: 'French', value: 'french' },
      { label: 'German', value: 'german' },
      { label: 'Japanese', value: 'japanese' },
      { label: 'Portuguese', value: 'portuguese' },
    ],
    filter: contains,
  });

  /** Update the controlled input and the visible collection together. */
  function updateInput(value: string): void {
    setInputValue(value);
    filter(value);
  }

  /** Close after selecting, reset the filter, and return focus to the trigger. */
  function changeValue(): void {
    setOpen(false);
    updateInput('');
    trigger?.focus();
  }

  const listbox = Listbox.useListbox(
    /** Keep the external machine aligned with the filtered collection. */
    () => ({ collection: collection(), onValueChange: changeValue }),
  );

  /** Follow the Popover trigger and dismissal machine. */
  function changeOpen(details: { open: boolean }): void {
    setOpen(details.open);
  }

  /** Forward the native input value to the filter. */
  function handleInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    updateInput(event.currentTarget.value);
  }

  /** Keep the styled trigger for restoring focus after selection. */
  function setTrigger(element: HTMLElement): void {
    trigger = element;
  }

  return (
    <Popover.Root open={open()} onOpenChange={changeOpen}>
      <Popover.Trigger
        asChild={
          /** Put the Popover trigger behavior on the styled Button. */
          (getProps) => (
            <Button {...getProps({ ref: setTrigger })} size="sm" variant="outline">
              {listbox().selectedItems[0]?.label ?? 'Select'} <ChevronDownIcon />
            </Button>
          )
        }
      />
      <Portal>
        <Popover.Positioner>
          <Popover.Content aria-label="Choose a language" class="listbox-popover-content">
            <Popover.Body class="example-listbox-popover-body">
              <Listbox.RootProvider value={listbox} class="example-listbox-popover-listbox">
                <Listbox.Input
                  aria-label="Search languages"
                  value={inputValue()}
                  onInput={handleInput}
                  class="example-listbox-popover-input"
                />
                <Listbox.Content class="example-listbox-popover-options">
                  <Listbox.List aria-label="Languages">
                    <For each={collection().items}>
                      {
                        /** Keep rendered options in the external machine's collection. */
                        (language) => (
                          <Listbox.Item item={language}>
                            <Listbox.ItemText>{language.label}</Listbox.ItemText>
                            <Listbox.ItemIndicator />
                          </Listbox.Item>
                        )
                      }
                    </For>
                  </Listbox.List>
                </Listbox.Content>
              </Listbox.RootProvider>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
