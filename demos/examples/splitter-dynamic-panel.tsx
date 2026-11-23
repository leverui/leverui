import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { MinusIcon, PlusIcon } from '@lucide/solid';
import {
  Button,
  Center,
  HStack,
  IconButton,
  Splitter,
  Stack,
  useSplitter,
  type UseSplitterReturn,
} from '../../src';

type SplitterItem = ReturnType<ReturnType<UseSplitterReturn>['getItems']>[number];

const maximumPanels = 5;

/** Divide the available width evenly between panels. */
function distributeSizes(count: number): number[] {
  return Array<number>(count).fill(100 / count);
}

/** Make room for one new panel while preserving the relative existing sizes. */
function sizesAfterAddition(sizes: readonly number[], count: number): number[] {
  const total = sizes.reduce(
    /** Sum the currently allocated panel widths. */
    (sum, size) => sum + size,
    0,
  );
  const newSize = total / count;
  return [
    ...sizes.map(
      /** Reduce each existing width proportionally. */
      (size) => size - (newSize * size) / total,
    ),
    newSize,
  ];
}

/** Return a removed panel's width proportionally to the remaining panels. */
function sizesAfterRemoval(sizes: readonly number[], index: number): number[] {
  const removed = sizes[index] ?? 0;
  const remaining = sizes.filter(
    /** Exclude the removed panel's size. */
    (_, position) => position !== index,
  );
  const total = remaining.reduce(
    /** Sum the sizes that remain. */
    (sum, size) => sum + size,
    0,
  );
  return remaining.map(
    /** Redistribute the removed width in proportion to each panel. */
    (size) => size + (removed * size) / total,
  );
}

/** Add and remove panels while retaining their proportions and resize behavior. */
export function SplitterDynamicPanel(): JSX.Element {
  const [panelIds, setPanelIds] = createSignal(['a', 'b']);
  const [sizes, setSizes] = createSignal(distributeSizes(2));
  let nextPanelCode = 'c'.charCodeAt(0);

  /** Keep controlled panel sizes synchronized with machine updates. */
  function updateSizes(details: { size: number[] }): void {
    setSizes(details.size);
  }

  const splitter = useSplitter(
    /** Keep the machine in sync with changing panel IDs and sizes. */
    () => ({
      size: sizes(),
      panels: panelIds().map(
        /** Give each dynamic panel a stable ID and minimum width. */
        (id) => ({ id, minSize: 15 }),
      ),
      onResize: updateSizes,
    }),
  );

  /** Add a panel without allowing duplicate IDs or exceeding the example limit. */
  function addPanel(): void {
    if (panelIds().length >= maximumPanels) return;
    const id = String.fromCharCode(nextPanelCode++);
    setSizes(sizesAfterAddition(sizes(), panelIds().length + 1));
    setPanelIds(
      /** Append the new panel after the existing ones. */
      (current) => [...current, id],
    );
  }

  /** Remove one panel and redistribute its width among the others. */
  function removePanel(id: string): void {
    if (panelIds().length <= 1) return;
    setSizes(sizesAfterRemoval(sizes(), panelIds().indexOf(id)));
    setPanelIds(
      /** Retain every panel except the one the user removed. */
      (current) =>
        current.filter(
          /** Match the selected panel by stable ID. */
          (panelId) => panelId !== id,
        ),
    );
  }

  /** Render one panel and its removal control, or a resize handle. */
  function renderItem(item: SplitterItem): JSX.Element {
    if (item.type !== 'panel') return <Splitter.ResizeTrigger id={item.id} />;

    /** Remove the panel represented by this control. */
    function removeThisPanel(): void {
      removePanel(item.id);
    }

    return (
      <Splitter.Panel id={item.id}>
        <Center
          textStyle="2xl"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {item.id}
          <IconButton
            aria-label={`Remove panel ${item.id}`}
            size="xs"
            variant="ghost"
            style={{
              position: 'absolute',
              top: 'var(--lui-spacing-2)',
              right: 'var(--lui-spacing-2)',
            }}
            onClick={removeThisPanel}
            disabled={panelIds().length === 1}
          >
            <MinusIcon />
          </IconButton>
        </Center>
      </Splitter.Panel>
    );
  }

  return (
    <Stack gap="4">
      <HStack gap="2" justify="space-between">
        <Button size="sm" variant="outline" onClick={addPanel} disabled={panelIds().length >= 5}>
          <PlusIcon /> Add panel
        </Button>
        <HStack
          gap="1"
          textStyle="sm"
          style={{
            color: 'var(--lui-colors-fg-muted)',
          }}
        >
          <span>
            {panelIds().length} panel{panelIds().length !== 1 ? 's' : ''}
          </span>
        </HStack>
      </HStack>
      <Splitter.RootProvider value={splitter} class="splitter-example-framed">
        <For each={splitter().getItems()}>{renderItem}</For>
      </Splitter.RootProvider>
    </Stack>
  );
}
