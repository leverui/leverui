import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Center as CenterExport,
  Flex as FlexExport,
  IconButton as IconButtonExport,
  Listbox as ListboxExport,
  VisuallyHidden as VisuallyHiddenExport,
  VStack as VStackExport,
  createListCollection as CollectionExport,
} from '../src';
import { TransferLeftIcon, TransferRightIcon } from './listbox-transfer-icons';
import { createTransferListState, type TransferItem } from './listbox-transfer-state';

type TransferState = ReturnType<typeof createTransferListState>;
export type TransferComponents = {
  Center: typeof CenterExport;
  Flex: typeof FlexExport;
  IconButton: typeof IconButtonExport;
  Listbox: typeof ListboxExport;
  VisuallyHidden: typeof VisuallyHiddenExport;
  VStack: typeof VStackExport;
  createListCollection: typeof CollectionExport;
};

/** Scroll the moved option into the destination after its reactive render. */
function scrollToMovedItem(
  container: HTMLDivElement | undefined,
  item: TransferItem | undefined,
): void {
  if (!container || !item) return;
  requestAnimationFrame(
    /** Read the live destination node after Solid updates its list. */
    () => {
      const option = Array.from(container.querySelectorAll<HTMLElement>('[data-value]')).find(
        /** Match the moved item's collection value without selector escaping. */
        (candidate) => candidate.dataset.value === item.value,
      );
      option?.scrollIntoView({ block: 'nearest' });
    },
  );
}

/** Render one independently labeled, controlled side of the transfer list. */
function TransferListbox(props: {
  Listbox: typeof ListboxExport;
  VisuallyHidden: typeof VisuallyHiddenExport;
  Center: typeof CenterExport;
  label: string;
  collection: ReturnType<TransferState['source']>;
  selected: TransferItem[];
  onSelectionChange: (items: TransferItem[]) => void;
  onContentRef: (element: HTMLDivElement) => void;
}): JSX.Element {
  const { Listbox, VisuallyHidden, Center } = props;
  return (
    <Listbox.Root
      collection={props.collection}
      selectionMode="multiple"
      value={props.selected.map(
        /** Convert controlled collection items to Zag values. */
        (item) => item.value,
      )}
      onValueChange={
        /** Keep this side's selection in the parent state. */
        (details) => props.onSelectionChange(details.items)
      }
    >
      <VisuallyHidden>
        <Listbox.Label>{props.label}</Listbox.Label>
      </VisuallyHidden>
      <Listbox.Content style={{ 'min-height': 'var(--lui-sizes-96)' }}>
        <Listbox.List ref={props.onContentRef}>
          <Show
            when={props.collection.items.length > 0}
            fallback={
              <Center
                style={{
                  width: '100%',
                  height: '100%',
                  padding: 'var(--lui-spacing-4)',
                  color: 'var(--lui-colors-fg-muted)',
                  'font-size': 'var(--lui-font-sizes-sm)',
                }}
              >
                No items available
              </Center>
            }
          >
            <For each={props.collection.items}>
              {
                /** Retain each option's the primitive selection and indicator semantics. */
                (item) => (
                  <Listbox.Item item={item} style={{ flex: '0' }}>
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

/** Compose the same transfer tree with source, server, or browser exports. */
export function renderListboxTransferTree(
  components: TransferComponents,
  initialSelectedSource: readonly string[] = [],
): JSX.Element {
  const { Center, Flex, IconButton, Listbox, VisuallyHidden, VStack } = components;
  const state = createTransferListState(components.createListCollection, initialSelectedSource);
  let sourceContent: HTMLDivElement | undefined;
  let targetContent: HTMLDivElement | undefined;

  /** Move selected source items and reveal the last moved destination option. */
  function moveRight(): void {
    scrollToMovedItem(targetContent, state.moveToTarget());
  }

  /** Move selected target items and reveal the last moved source option. */
  function moveLeft(): void {
    scrollToMovedItem(sourceContent, state.moveToSource());
  }

  /** Retain the source content node for post-transfer scrolling. */
  function setSourceContent(element: HTMLDivElement): void {
    sourceContent = element;
  }

  /** Retain the target content node for post-transfer scrolling. */
  function setTargetContent(element: HTMLDivElement): void {
    targetContent = element;
  }

  return (
    <>
      <div style={{ padding: '24px' }}>
        <Flex style={{ gap: 'var(--lui-spacing-4)', 'max-width': '600px' }} align="stretch">
          <TransferListbox
            Listbox={Listbox}
            VisuallyHidden={VisuallyHidden}
            Center={Center}
            label="Available characters"
            collection={state.source()}
            selected={state.selectedSource()}
            onSelectionChange={state.setSelectedSource}
            onContentRef={setSourceContent}
          />
          <VStack justify="center" gap="2" style={{ 'padding-block': 'var(--lui-spacing-8)' }}>
            <IconButton
              aria-label="Move selected characters right"
              size="xs"
              variant="subtle"
              disabled={state.selectedSource().length === 0}
              onClick={moveRight}
            >
              <TransferRightIcon />
            </IconButton>
            <IconButton
              aria-label="Move selected characters left"
              size="xs"
              variant="subtle"
              disabled={state.selectedTarget().length === 0}
              onClick={moveLeft}
            >
              <TransferLeftIcon />
            </IconButton>
          </VStack>
          <TransferListbox
            Listbox={Listbox}
            VisuallyHidden={VisuallyHidden}
            Center={Center}
            label="Selected characters"
            collection={state.target()}
            selected={state.selectedTarget()}
            onSelectionChange={state.setSelectedTarget}
            onContentRef={setTargetContent}
          />
        </Flex>
      </div>
    </>
  );
}
