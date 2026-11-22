import { createMemo, createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import emojiData from 'emojibase-data/en/compact.json';
import { FaceSlightlySmilingIcon } from '@lucide/solid';
import { Input, Listbox, Square, VisuallyHidden, createGridCollection, useFilter } from '../../src';
import './listbox-examples.css';

type Emoji = (typeof emojiData)[number];

const codes = `
  1F600 1F603 1F604 1F601 1F606 1F605 1F923 1F602 1F642 1F643 1FAE0 1F609 1F60A 1F607 1F970
  1F60D 1F929 1F618 1F617 263A 1F61A 1F619 1F972 1F60B 1F61B 1F61C 1F92A 1F61D 1F911 1F917
  1F92D 1FAE2 1FAE3 1F92B 1F914 1FAE1 1F910 1F928 1F610 1F611 1F636 1FAE5
  1F636-200D-1F32B-FE0F 1F60F 1F612 1F644 1F62C 1F62E-200D-1F4A8 1F925 1FAE8
  1F642-200D-2194-FE0F 1F642-200D-2195-FE0F 1F60C 1F614 1F62A 1F924 1F634 1FAE9 1F637 1F912
  1F915 1F922 1F92E 1F927 1F975 1F976 1F974 1F635 1F635-200D-1F4AB 1F92F 1F920 1F973 1F978
  1F60E 1F913 1F9D0 1F615 1FAE4 1F61F 1F641 2639 1F62E 1F62F 1F632 1F633 1FAEA 1F97A 1F979
  1F626 1F627 1F628 1F630 1F625 1F622 1F62D 1F631 1F616 1F623 1F61E 1F613 1F629 1F62B 1F971
  1F624 1F621 1F620 1F92C 1F608 1F47F 1F480 2620 1F4A9 1F921 1F479 1F47A 1F47B 1F47D 1F47E
  1F916 1F63A 1F638 1F639 1F63B 1F63C 1F63D 1F640 1F63F 1F63E 1F648 1F649 1F64A 1F48C 1F498
  1F49D 1F496 1F497 1F493 1F49E 1F495 1F49F 2763 1F494 2764-FE0F-200D-1F525
  2764-FE0F-200D-1FA79 2764 1FA77 1F9E1 1F49B 1F49A 1F499 1FA75 1F49C 1F90E 1F5A4 1FA76 1F90D
  1F48B 1F4AF 1F4A2 1FAEF 1F4A5 1F4AB 1F4A6 1F4A8 1F573 1F4AC 1F441-FE0F-200D-1F5E8-FE0F
  1F5E8 1F5EF 1F4AD 1F4A4 1F44B 1F91A 1F590 270B 1F596 1FAF1 1FAF2 1FAF3 1FAF4 1FAF7 1FAF8
  1F44C 1F90C 1F90F 270C 1F91E 1FAF0 1F91F 1F918 1F919 1F448 1F449 1F446 1F595 1F447 261D
  1FAF5 1F44D 1F44E
`;

const emojis = codes
  .trim()
  .split(/\s+/)
  .flatMap(
    /** Look up each listed emoji in the dataset, in this order. */
    (code) => emojiData.filter((emoji) => emoji.hexcode === code),
  );

/** Filter a selectable emoji grid by name. */
export function ListboxEmojiGrid(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const [query, setQuery] = createSignal('');
  const collection = createMemo(
    /** Rebuild the eight-column collection when the query changes. */
    () =>
      createGridCollection({
        columnCount: 8,
        items: emojis.filter((emoji) => matcher().contains(emoji.label, query())),
        /** Use the emoji's label for typeahead. */
        itemToString: (item) => item.label,
        /** Keep selection stable while the grid is filtered. */
        itemToValue: (item) => item.hexcode,
      }),
  );

  return (
    <Listbox.Root collection={collection()} style={{ 'max-width': 'min-content' }}>
      <VisuallyHidden>
        <Listbox.Label>Emojis</Listbox.Label>
      </VisuallyHidden>
      <SelectedEmoji />
      <Listbox.Input
        asChild={
          /** Keep the Listbox input behavior on the styled Input. */
          (getProps) => (
            <Input
              {...getProps({
                /** Filter the grid as the user types. */
                onInput: (event) => setQuery(event.currentTarget.value),
              })}
              aria-label="Filter emojis"
              placeholder="Type to filter emojis..."
            />
          )
        }
      />
      <Listbox.Content class="example-listbox-emoji-grid">
        <Listbox.List aria-label="Emojis">
          <For each={collection().items}>
            {
              /** Render each emoji as one selectable grid cell. */
              (emoji) => (
                <Listbox.Item item={emoji} aria-label={emoji.label} class="example-listbox-emoji">
                  {emoji.unicode}
                </Listbox.Item>
              )
            }
          </For>
        </Listbox.List>
      </Listbox.Content>
    </Listbox.Root>
  );
}

/** Show the selected emoji above the grid. */
function SelectedEmoji(): JSX.Element {
  const listbox = Listbox.useListboxContext();
  /** Read the selected emoji; the context does not carry the item type. */
  const selected = () => listbox().selectedItems[0] as Emoji | undefined;
  return (
    <Square size="40px" textStyle="lg" class="example-listbox-emoji-preview">
      {selected()?.unicode ?? <FaceSlightlySmilingIcon />}
    </Square>
  );
}
