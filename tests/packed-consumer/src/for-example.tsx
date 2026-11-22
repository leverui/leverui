import { For } from '@leverui/components';
import { type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Render a typed item through the public installed component. */
function renderPackedItem(item: string, index: Accessor<number>): JSX.Element {
  return <span data-packed-index={index()}>{item}</span>;
}

/** Exercise typed items and an empty fallback from the installed package. */
export function PackedFor(): JSX.Element {
  return (
    <section id="packed-for">
      <For each={['One', 'Two']}>{renderPackedItem}</For>
      <For<string> each={[]} fallback={<span id="packed-for-fallback">No items</span>}>
        {renderPackedItem}
      </For>
    </section>
  );
}
