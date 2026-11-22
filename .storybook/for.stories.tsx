import { createSignal, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from '../src';

interface Item {
  id: string;
  label: string;
}

const initialItems: readonly Item[] = [
  { id: 'one', label: 'One' },
  { id: 'two', label: 'Two' },
  { id: 'three', label: 'Three' },
];

/** Exercise object identity, reactive order, primitives, and fallback states. */
function ForContractExample(): JSX.Element {
  const [items, setItems] = createSignal<readonly Item[] | undefined>(initialItems);
  const [alternateFallback, setAlternateFallback] = createSignal(false);
  const [alternateRenderer, setAlternateRenderer] = createSignal(false);

  /** Reverse the same item objects to check keyed node reuse. */
  function reverseItems(): void {
    setItems(
      /** Reverse the current array without changing item identities. */
      (current) => current?.slice().reverse(),
    );
  }

  /** Show the fallback for an empty collection. */
  function clearItems(): void {
    setItems([]);
  }

  /** Omit the collection without showing its empty-array fallback. */
  function omitItems(): void {
    setItems(undefined);
  }

  /** Replace the fallback element while the list remains empty. */
  function changeFallback(): void {
    setAlternateFallback(
      /** Replace the fallback element while the list stays empty. */
      (current) => !current,
    );
  }

  /** Replace the item renderer without changing the list. */
  function changeRenderer(): void {
    setAlternateRenderer(
      /** Toggle the render-function prop while preserving item identities. */
      (current) => !current,
    );
  }

  /** Show one present item after two missing array slots. */
  function showSparseItems(): void {
    const sparse = new Array<Item>(3);
    const present = initialItems[2];
    if (present) sparse[2] = present;
    setItems(sparse);
  }

  /** Show that an all-hole array has no items and is not an empty array. */
  function showHoles(): void {
    setItems(new Array<Item>(2));
  }

  /** Restore the original objects after a fallback. */
  function restoreItems(): void {
    setItems(initialItems);
  }

  /** Render an object and its current position. */
  function renderItem(item: Item, index: Accessor<number>): JSX.Element {
    return (
      <li data-testid={`for-item-${item.id}`} data-index={index()}>
        {item.label}
      </li>
    );
  }

  /** Render the same item through a different function identity. */
  function renderAlternateItem(item: Item, index: Accessor<number>): JSX.Element {
    return (
      <li data-testid={`for-item-${item.id}`} data-index={index()}>
        Changed: {item.label}
      </li>
    );
  }

  /** Render a primitive item with Solid's index accessor. */
  function renderPrimitive(item: string, index: Accessor<number>): JSX.Element {
    return <span data-testid={`for-primitive-${index()}`}>{item}</span>;
  }

  return (
    <section data-testid="for-contract">
      <button type="button" data-testid="for-reverse" onClick={reverseItems}>
        Reverse
      </button>
      <button type="button" data-testid="for-clear" onClick={clearItems}>
        Clear
      </button>
      <button type="button" data-testid="for-omit" onClick={omitItems}>
        Omit
      </button>
      <button type="button" data-testid="for-change-fallback" onClick={changeFallback}>
        Change fallback
      </button>
      <button type="button" data-testid="for-change-renderer" onClick={changeRenderer}>
        Change renderer
      </button>
      <button type="button" data-testid="for-sparse" onClick={showSparseItems}>
        Sparse
      </button>
      <button type="button" data-testid="for-holes" onClick={showHoles}>
        Holes
      </button>
      <button type="button" data-testid="for-restore" onClick={restoreItems}>
        Restore
      </button>
      <ul data-testid="for-list">
        <For
          each={items()}
          fallback={
            alternateFallback() ? (
              <li data-testid="for-fallback">Still empty</li>
            ) : (
              <li data-testid="for-fallback">No items</li>
            )
          }
        >
          {alternateRenderer() ? renderAlternateItem : renderItem}
        </For>
      </ul>
      <div data-testid="for-primitives">
        <For each={['Alpha', 'Beta']}>{renderPrimitive}</For>
      </div>
    </section>
  );
}

const meta = {
  title: 'Utilities/For',
  component: ForContractExample,
} satisfies Meta<typeof ForContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
