import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Button,
  Center,
  HStack,
  Splitter,
  Stack,
  useSplitter,
  type UseSplitterReturn,
} from '../../src';

type SplitterItem = ReturnType<ReturnType<UseSplitterReturn>['getItems']>[number];

type OrderedPanel = { id: string; order: number };
const initialPanels: OrderedPanel[] = [
  { id: 'left', order: 0 },
  { id: 'center', order: 1 },
  { id: 'right', order: 2 },
];

/** Give each visible panel arrangement a stable size-cache key. */
function layoutKey(panels: readonly OrderedPanel[]): string {
  return panels
    .map(
      /** Include one panel's stable ID in the layout key. */
      (panel) => panel.id,
    )
    .join(':');
}

/** Divide the available width evenly between the visible panels. */
function distributeSizes(count: number): number[] {
  return Array<number>(count).fill(100 / count);
}

/** Keep each panel layout's sizes while the left or right panel is toggled. */
export function SplitterConditionalRendering(): JSX.Element {
  const [panels, setPanels] = createSignal(initialPanels);
  const [sizes, setSizes] = createSignal<number[]>([]);
  const layoutCache = new Map<string, number[]>([[layoutKey(initialPanels), []]]);

  /** Save machine updates for the current arrangement. */
  function updateSizes(details: { size: number[]; layout: string }): void {
    setSizes(details.size);
    layoutCache.set(details.layout, details.size);
  }

  const splitter = useSplitter(
    /** Supply the machine with the current visible panels and controlled sizes. */
    () => ({
      panels: panels().map(
        /** Require each visible panel to retain at least 20 percent width. */
        (panel) => ({ id: panel.id, minSize: 20 }),
      ),
      size: sizes(),
      orientation: 'horizontal',
      onResize: updateSizes,
    }),
  );

  /** Remove a panel and remember the sizes before it disappears. */
  function hidePanel(id: string): void {
    layoutCache.set(layoutKey(panels()), sizes());
    const index = panels().findIndex(
      /** Locate the panel's current size slot. */
      (panel) => panel.id === id,
    );
    setPanels(
      /** Remove the selected panel from the visible layout. */
      (current) =>
        current.filter(
          /** Retain every other panel. */
          (panel) => panel.id !== id,
        ),
    );
    setSizes(
      /** Remove the selected panel's size. */
      (current) =>
        current.filter(
          /** Retain sizes belonging to visible panels. */
          (_, position) => position !== index,
        ),
    );
  }

  /** Restore a hidden panel in its original position and recover saved sizes. */
  function showPanel(id: string): void {
    const panel = initialPanels.find(
      /** Find the original panel definition. */
      (item) => item.id === id,
    );
    if (!panel) return;
    const nextPanels = [...panels(), panel].sort(
      /** Restore the original left-to-right order. */
      (left, right) => left.order - right.order,
    );
    setPanels(nextPanels);
    setSizes(layoutCache.get(layoutKey(nextPanels)) ?? distributeSizes(nextPanels.length));
  }

  /** Tell the controls whether their panel is currently visible. */
  function isVisible(id: string): boolean {
    return panels().some(
      /** Match a visible panel by its stable ID. */
      (panel) => panel.id === id,
    );
  }

  /** Add or remove one optional panel. */
  function togglePanel(id: string): void {
    if (isVisible(id)) hidePanel(id);
    else showPanel(id);
  }

  /** Render a panel or its following resize handle from the machine layout. */
  function renderItem(item: SplitterItem): JSX.Element {
    return item.type === 'panel' ? (
      <Splitter.Panel id={item.id}>
        <Center textStyle="lg" style={{ width: '100%', height: '100%' }}>
          {item.id}
        </Center>
      </Splitter.Panel>
    ) : (
      <Splitter.ResizeTrigger id={item.id} />
    );
  }

  /** Toggle the optional left panel from the first control. */
  function toggleLeft(): void {
    togglePanel('left');
  }

  /** Toggle the optional right panel from the second control. */
  function toggleRight(): void {
    togglePanel('right');
  }

  return (
    <Stack gap="4">
      <HStack gap="2" justify="space-between">
        <Button size="sm" variant="outline" onClick={toggleLeft}>
          {isVisible('left') ? 'Hide left' : 'Show left'}
        </Button>
        <Button size="sm" variant="outline" onClick={toggleRight}>
          {isVisible('right') ? 'Hide right' : 'Show right'}
        </Button>
      </HStack>
      <Splitter.RootProvider value={splitter} class="splitter-example-framed">
        <For each={splitter().getItems()}>{renderItem}</For>
      </Splitter.RootProvider>
    </Stack>
  );
}
