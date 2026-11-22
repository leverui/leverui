import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Listbox as ListboxExport,
  Popover as PopoverExport,
  Portal as PortalExport,
  createListCollection as CollectionExport,
} from '../src';

export type ListboxOverlayHydrationComponents = {
  Listbox: typeof ListboxExport;
  Popover: typeof PopoverExport;
  Portal: typeof PortalExport;
  createListCollection: typeof CollectionExport;
};

const items = [
  { label: 'React.js', value: 'react' },
  { label: 'Solid', value: 'solid' },
];

/** Share one deterministic server and browser tree with a nested portal. */
export function renderListboxOverlayHydrationTree(
  components: ListboxOverlayHydrationComponents,
  initialOpen: boolean,
): JSX.Element {
  const { Listbox, Popover, Portal, createListCollection } = components;
  const [open, setOpen] = createSignal(initialOpen);
  const collection = createListCollection({ items });

  /** Close the overlay when the external Listbox machine selects an option. */
  function closeOnSelection(): void {
    setOpen(false);
  }

  const listbox = Listbox.useListbox({
    id: 'hydrated-overlay-listbox',
    collection,
    defaultValue: ['react'],
    onValueChange: closeOnSelection,
  });

  /** Follow Popover trigger and dismissal changes in the same signal. */
  function changeOpen(details: { open: boolean }): void {
    setOpen(details.open);
  }

  return (
    <>
      <Popover.Root id="hydrated-overlay-popover" open={open()} onOpenChange={changeOpen}>
        <Popover.Trigger data-testid="hydrated-overlay-trigger">
          {listbox().selectedItems[0]?.label ?? 'Select'}
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content data-testid="hydrated-overlay-content">
              <Popover.Title>Choose a framework</Popover.Title>
              <Popover.Body>
                <Listbox.RootProvider value={listbox}>
                  <Listbox.Content>
                    <Listbox.List aria-label="Frameworks" data-testid="hydrated-overlay-listbox">
                      <For each={items}>
                        {
                          /** Retain identical option objects across server and client renders. */
                          (item) => (
                            <Listbox.Item
                              item={item}
                              data-testid={`hydrated-overlay-${item.value}`}
                            >
                              <Listbox.ItemText>{item.label}</Listbox.ItemText>
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
    </>
  );
}
