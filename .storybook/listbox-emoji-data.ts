import emojiData from 'emojibase-data/en/compact.json';
import type { createGridCollection, GridCollection } from '../src';
import { galleryEmojiCodes } from './listbox-emoji-order';

/** Keep the guide's first 200 non-regional emoji entries. */
export const emojis = emojiData
  .filter(
    /** Exclude regional indicator letters, which do not display as standalone flags. */
    (emoji) => !emoji.label.startsWith('regional indicator'),
  )
  .slice(0, 200);

export type Emoji = (typeof emojis)[number];

const emojiByCode = new Map(
  emojiData.map(
    /** Index the current emoji dataset for the gallery order. */
    (emoji) => [emoji.hexcode, emoji] as const,
  ),
);

/** Keep the gallery stable as the emoji dependency is updated. */
export const galleryEmojis = galleryEmojiCodes.map(
  /** Resolve each code and fail visibly if the dataset drops it. */
  (code): Emoji => {
    const emoji = emojiByCode.get(code);
    if (!emoji) throw new Error(`Missing gallery emoji: ${code}`);
    return emoji;
  },
);

/** Preserve eight-column keyboard navigation for the visible emoji collection. */
export function createEmojiCollection(
  items: Emoji[],
  createCollection: typeof createGridCollection,
): GridCollection<Emoji> {
  return createCollection({
    columnCount: 8,
    items,
    /** Use the current dataset's stable label for typeahead and accessible text. */
    itemToString: (item) => item.label,
    /** Keep selection stable as the filtered collection changes. */
    itemToValue: (item) => item.hexcode,
  });
}
