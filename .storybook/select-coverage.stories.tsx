import { createMemo, createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Portal, Select } from '../src';

const sizes = ['xs', 'sm', 'md', 'lg'] as const;
const variants = ['outline', 'subtle', 'ghost'] as const;
const baseItems = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
];
const staticCollection = Select.createListCollection({ items: baseItems });

/** Cycle the complete size and variant matrix on one mounted Select. */
function MatrixExample(): JSX.Element {
  const [sizeIndex, setSizeIndex] = createSignal(0);
  const [variantIndex, setVariantIndex] = createSignal(0);

  /** Select the next of four supported sizes. */
  function nextSize(): void {
    setSizeIndex(
      /** Wrap the size index after the largest size. */
      (index) => (index + 1) % sizes.length,
    );
  }

  /** Select the next of three supported variants. */
  function nextVariant(): void {
    setVariantIndex(
      /** Wrap the variant index after ghost. */
      (index) => (index + 1) % variants.length,
    );
  }

  return (
    <>
      <form data-testid="select-matrix-form" style={{ padding: '240px 24px 24px', width: '360px' }}>
        <Select.Root
          collection={staticCollection}
          name="matrix"
          size={sizes[sizeIndex()]}
          variant={variants[variantIndex()]}
          positioning={{ placement: 'top', flip: false, sameWidth: false }}
          invalid
          required
          data-testid="select-matrix-root"
        >
          <Select.HiddenSelect />
          <Select.Label>Matrix framework</Select.Label>
          <Select.Control>
            <Select.Trigger data-testid="select-matrix-trigger">
              <Select.ValueText placeholder="Choose framework" />
            </Select.Trigger>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.List>
                  <For each={staticCollection.items}>
                    {
                      /** Keep the option tied to its typed collection item. */
                      (item) => <Select.Item item={item}>{item.label}</Select.Item>
                    }
                  </For>
                </Select.List>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <button type="button" onClick={nextSize}>
          Next size
        </button>
        <button type="button" onClick={nextVariant}>
          Next variant
        </button>
      </form>
    </>
  );
}

/** Resolve options after opening so the collection changes reactively. */
function loadItems(): Promise<typeof baseItems> {
  return new Promise(
    /** Resolve the asynchronous options after the loading state renders. */
    (resolve) =>
      setTimeout(
        /** Return fresh collection items. */
        () => resolve(baseItems),
        80,
      ),
  );
}

/** Exercise async loading and selected-label updates from new collections. */
function ReactiveExample(): JSX.Element {
  const [items, setItems] = createSignal<typeof baseItems>([]);
  const [loaded, setLoaded] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [version, setVersion] = createSignal(0);
  const collection = createMemo(
    /** Rebuild the typed collection when items or labels change. */
    () =>
      Select.createListCollection({
        items: items().map(
          /** Preserve item values while changing the display labels. */
          (item) => ({ ...item, label: `${item.label} ${version()}` }),
        ),
      }),
  );

  /** Complete the pending load with new collection items. */
  function finishLoading(result: typeof baseItems): void {
    setItems(result);
    setLoaded(true);
    setLoading(false);
  }

  /** Fetch the collection the first time the popup opens. */
  function handleOpenChange(details: { open: boolean }): void {
    if (!details.open || loaded() || loading()) return;
    setLoading(true);
    void loadItems().then(finishLoading);
  }

  /** Change labels without changing selected values. */
  function renameItems(): void {
    setVersion(version() + 1);
  }

  return (
    <>
      <div style={{ padding: '24px', width: '360px' }}>
        <Select.Root
          collection={collection()}
          onOpenChange={handleOpenChange}
          data-testid="select-reactive-root"
        >
          <Select.Label>Reactive framework</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Choose framework" />
            </Select.Trigger>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.List>
                  <Show when={loading()}>
                    <div data-testid="select-loading">Loading options</div>
                  </Show>
                  <For each={collection().items}>
                    {
                      /** Render current labels from the rebuilt collection. */
                      (item) => <Select.Item item={item}>{item.label}</Select.Item>
                    }
                  </For>
                </Select.List>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <button type="button" onClick={renameItems}>
          Rename options
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Select Coverage',
  component: MatrixExample,
} satisfies Meta<typeof MatrixExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Matrix: Story = {};
export const Reactive: Story = { render: ReactiveExample };
