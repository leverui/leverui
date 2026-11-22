import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import {
  Center,
  Flex,
  IconButton,
  Listbox,
  VisuallyHidden,
  VStack,
  createListCollection,
  type ListCollection,
} from '../../src';
import './listbox-examples.css';

interface Item {
  label: string;
  value: string;
}

const storyCharacters: Item[] = [
  { label: 'Wren', value: 'wren' },
  { label: 'Corin', value: 'corin' },
  { label: 'Mira', value: 'mira' },
  { label: 'Tobin', value: 'tobin' },
  { label: 'Ansel', value: 'ansel' },
  { label: 'Juniper', value: 'juniper' },
  { label: 'Calla', value: 'calla' },
  { label: 'Dorian', value: 'dorian' },
  { label: 'Elsie', value: 'elsie' },
  { label: 'Fenwick', value: 'fenwick' },
  { label: 'Greta', value: 'greta' },
  { label: 'Hollis', value: 'hollis' },
  { label: 'Isolde', value: 'isolde' },
  { label: 'Jasper', value: 'jasper' },
  { label: 'Linnea', value: 'linnea' },
];

/** Scroll the moved option into view after the destination list updates. */
function scrollToItem(container: HTMLDivElement | undefined, item: Item | undefined): void {
  if (!container || !item) return;
  requestAnimationFrame(
    /** Find the moved option once Solid has rendered it. */
    () => {
      const option = Array.from(container.querySelectorAll<HTMLElement>('[data-value]')).find(
        /** Match the moved item's collection value. */
        (candidate) => candidate.dataset.value === item.value,
      );
      option?.scrollIntoView({ block: 'nearest' });
    },
  );
}

/** Render one labeled, controlled side of the transfer list. */
function TransferListbox(props: {
  label: string;
  collection: ListCollection<Item>;
  selected: Item[];
  onSelect: (items: Item[]) => void;
  contentRef: (element: HTMLDivElement) => void;
}): JSX.Element {
  return (
    <Listbox.Root
      collection={props.collection}
      selectionMode="multiple"
      value={props.selected.map(
        /** Convert the selected items to machine values. */
        (item) => item.value,
      )}
      onValueChange={
        /** Report the selected items to the parent state. */
        (details) => props.onSelect(details.items)
      }
    >
      <VisuallyHidden>
        <Listbox.Label>{props.label}</Listbox.Label>
      </VisuallyHidden>
      <Listbox.Content class="example-listbox-transfer-list">
        <Listbox.List ref={props.contentRef}>
          <Show
            when={props.collection.items.length > 0}
            fallback={<Center class="example-listbox-empty">No items available</Center>}
          >
            <For each={props.collection.items}>
              {
                /** Keep the option text and indicator under one machine item. */
                (item) => (
                  <Listbox.Item item={item} class="example-listbox-transfer-item">
                    <Listbox.ItemText>{item.label}</Listbox.ItemText>
                    <Listbox.ItemIndicator />
                  </Listbox.Item>
                )
              }
            </For>
          </Show>
        </Listbox.List>
      </Listbox.Content>
    </Listbox.Root>
  );
}

/** Move selected story characters between two collections. */
export function ListboxTransferList(): JSX.Element {
  const [source, setSource] = createSignal(createListCollection({ items: storyCharacters }));
  const [target, setTarget] = createSignal(createListCollection<Item>({ items: [] }));
  const [selectedSource, setSelectedSource] = createSignal<Item[]>([]);
  const [selectedTarget, setSelectedTarget] = createSignal<Item[]>([]);
  let sourceContent: HTMLDivElement | undefined;
  let targetContent: HTMLDivElement | undefined;

  /** Move the selected source items into the target list. */
  function moveToTarget(): void {
    const items = selectedSource();
    setSource(source().remove(...items));
    setTarget(target().append(...items));
    setSelectedSource([]);
    scrollToItem(targetContent, items.at(-1));
  }

  /** Move the selected target items back to the source list. */
  function moveToSource(): void {
    const items = selectedTarget();
    setSource(source().append(...items));
    setTarget(target().remove(...items));
    setSelectedTarget([]);
    scrollToItem(sourceContent, items.at(-1));
  }

  return (
    <Flex class="example-listbox-transfer" align="stretch">
      <TransferListbox
        label="Available characters"
        collection={source()}
        selected={selectedSource()}
        onSelect={setSelectedSource}
        contentRef={
          /** Keep the source list for scrolling after a move. */
          (element) => (sourceContent = element)
        }
      />
      <VStack justify="center" gap="2" class="example-listbox-transfer-actions">
        <IconButton
          aria-label="Move selected characters right"
          size="xs"
          variant="subtle"
          disabled={selectedSource().length === 0}
          onClick={moveToTarget}
        >
          <ChevronRightIcon />
        </IconButton>
        <IconButton
          aria-label="Move selected characters left"
          size="xs"
          variant="subtle"
          disabled={selectedTarget().length === 0}
          onClick={moveToSource}
        >
          <ChevronLeftIcon />
        </IconButton>
      </VStack>
      <TransferListbox
        label="Selected characters"
        collection={target()}
        selected={selectedTarget()}
        onSelect={setSelectedTarget}
        contentRef={
          /** Keep the target list for scrolling after a move. */
          (element) => (targetContent = element)
        }
      />
    </Flex>
  );
}
