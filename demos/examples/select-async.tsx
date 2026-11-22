import { createMemo, createSignal, For, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal, Select, Spinner } from '../../src';
import { simulateRequest } from './simulated-request';

interface Plant {
  readonly name: string;
}

/** A small local plant catalog served by the simulated request below. */
const plants: readonly Plant[] = [
  { name: 'Monstera' },
  { name: 'Snake plant' },
  { name: 'Pothos' },
  { name: 'Fiddle-leaf fig' },
  { name: 'ZZ plant' },
  { name: 'Peace lily' },
  { name: 'Rubber plant' },
  { name: 'Spider plant' },
  { name: 'Calathea' },
  { name: 'Aloe vera' },
  { name: 'String of pearls' },
  { name: 'Bird of paradise' },
];

/** Load the plant catalog after a simulated network round trip. */
async function fetchPlants(): Promise<Plant[]> {
  await simulateRequest(600);
  return [...plants];
}

/** Load the plant options while showing a small spinner. */
export function SelectAsyncLoading(): JSX.Element {
  const [plantOptions, setPlantOptions] = createSignal<Plant[]>([]);
  const [loading, setLoading] = createSignal(true);
  onSettled(() => {
    void fetchPlants()
      .then(setPlantOptions)
      .finally(() => setLoading(false));
  });
  const collection = createMemo(
    /** Rebuild the collection as soon as the request resolves. */
    () =>
      Select.createListCollection({
        items: plantOptions(),
        itemToString:
          /** Display the plant name. */
          (item) => item.name,
        itemToValue:
          /** Submit the plant name. */
          (item) => item.name,
      }),
  );

  return (
    <Select.Root collection={collection()} size="sm" style={{ width: '320px' }}>
      <Select.HiddenSelect />
      <Select.Label>Select plant</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select plant" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          {loading() && (
            <Spinner
              size="xs"
              style={{ 'border-width': '1.5px', color: 'var(--leverui-colors-fg-muted)' }}
            />
          )}
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={collection().items}>
                {
                  /** Bind each loaded result to the current list collection. */
                  (item) => (
                    <Select.Item item={item}>
                      {item.name}
                      <Select.ItemIndicator />
                    </Select.Item>
                  )
                }
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
