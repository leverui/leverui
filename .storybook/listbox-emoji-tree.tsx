import { createMemo, createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Input as InputExport,
  Listbox as ListboxExport,
  Square as SquareExport,
  VisuallyHidden as HiddenExport,
  createGridCollection as CollectionExport,
  useFilter as FilterExport,
} from '../src';
import { createEmojiCollection, emojis, type Emoji } from './listbox-emoji-data';
import { EmojiSmileIcon } from './listbox-emoji-icon';

export type EmojiComponents = {
  Input: typeof InputExport;
  Listbox: typeof ListboxExport;
  Square: typeof SquareExport;
  VisuallyHidden: typeof HiddenExport;
  createGridCollection: typeof CollectionExport;
  useFilter: typeof FilterExport;
};

/** Display the machine's selection above the emoji grid. */
function SelectedEmoji(props: {
  Listbox: typeof ListboxExport;
  Square: typeof SquareExport;
}): JSX.Element {
  const listbox = props.Listbox.useListboxContext();

  /** The primitive's context erases the collection item type across its provider. */
  function selectedEmoji(): Emoji | undefined {
    return listbox().selectedItems[0] as Emoji | undefined;
  }

  return (
    <props.Square
      size="40px"
      textStyle="lg"
      style={{
        background: 'var(--lui-colors-bg-muted)',
        'border-radius': 'var(--lui-radii-sm)',
      }}
      data-testid="selected-emoji"
    >
      {selectedEmoji()?.unicode ?? <EmojiSmileIcon />}
    </props.Square>
  );
}

/** Render one guide tree with source, published server, or browser exports. */
export function renderListboxEmojiTree(
  components: EmojiComponents,
  initialSelection: readonly string[] = [],
  items: Emoji[] = emojis,
): JSX.Element {
  const { Input, Listbox, Square, VisuallyHidden } = components;
  const matcher = components.useFilter({ sensitivity: 'base' });
  const [query, setQuery] = createSignal('');
  const collection = createMemo(
    /** Rebuild the eight-column collection when the query changes. */
    () =>
      createEmojiCollection(
        items.filter(
          /** Match the case-insensitive label search. */
          (emoji) => matcher().contains(emoji.label, query()),
        ),
        components.createGridCollection,
      ),
  );

  /** Keep the filter tied to the native input value. */
  function handleInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setQuery(event.currentTarget.value);
  }

  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root
          collection={collection()}
          defaultValue={[...initialSelection]}
          style={{ 'max-width': 'min-content' }}
        >
          <VisuallyHidden>
            <Listbox.Label>Emojis</Listbox.Label>
          </VisuallyHidden>
          <SelectedEmoji Listbox={Listbox} Square={Square} />
          <Listbox.Input
            asChild={
              /** Put Zag's keyboard and filter props on the styled Input. */
              (getProps) => (
                <Input
                  {...getProps({ onInput: handleInput })}
                  id="emoji-search"
                  aria-label="Filter emojis"
                  placeholder="Type to filter frameworks..."
                />
              )
            }
          />
          <Listbox.Content style={{ width: '374px' }}>
            <Listbox.List
              aria-label="Emojis"
              data-testid="emoji-grid"
              style={{
                display: 'grid',
                'grid-template-columns': 'repeat(8, 1fr)',
                gap: 'var(--lui-spacing-1)',
              }}
            >
              <For each={collection().items}>
                {
                  /** Keep every option under the same reactive grid collection. */
                  (emoji) => (
                    <Listbox.Item
                      item={emoji}
                      aria-label={emoji.label}
                      style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        'align-items': 'center',
                        'justify-content': 'center',
                        'border-radius': 'var(--lui-radii-md)',
                        'font-size': '22px',
                      }}
                    >
                      {emoji.unicode}
                    </Listbox.Item>
                  )
                }
              </For>
            </Listbox.List>
          </Listbox.Content>
        </Listbox.Root>
      </div>
    </>
  );
}
