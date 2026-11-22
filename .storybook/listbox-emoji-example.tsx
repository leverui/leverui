import { type JSX } from '@solidjs/web';
import { Input, Listbox, Square, VisuallyHidden, createGridCollection, useFilter } from '../src';
import { renderListboxEmojiTree } from './listbox-emoji-tree';
import { galleryEmojis } from './listbox-emoji-data';

/** Show the same Emoji Grid tree used by the published hydration fixture. */
export function ListboxEmojiExample(props: { gallery?: boolean } = {}): JSX.Element {
  return renderListboxEmojiTree(
    {
      Input,
      Listbox,
      Square,
      VisuallyHidden,
      createGridCollection,
      useFilter,
    },
    [],
    props.gallery ? galleryEmojis : undefined,
  );
}
