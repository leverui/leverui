import { For, type Accessor } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { CloseIcon } from './close-icon';
import { useTagsInputContext } from './tags-input-machine';
import type { TagsInputItemsProps } from './tags-input-part-props';
import { renderTagsInputPart } from './tags-input-part';

/** Render one tag's visible text and default delete control. */
function renderItemPreview(item: Accessor<string>): JSX.Element {
  return renderTagsInputPart('itemPreview', {
    /** Create preview children within the current primitive item context. */
    get children() {
      return [
        renderTagsInputPart('itemText', {
          /** Follow changes to the value at this index. */
          get children() {
            return item();
          },
        }),
        renderTagsInputPart('itemDeleteTrigger', {}, CloseIcon),
      ];
    },
  });
}

/** Render the current machine values as indexed, editable tag compositions. */
export function TagsInputItems(props: TagsInputItemsProps): JSX.Element {
  const api = useTagsInputContext();

  /** Keep duplicate values distinct by their machine index. */
  function renderItem(item: Accessor<string>, index: number): JSX.Element {
    const itemProps = mergeProps(props, {
      /** Bind this rendered item to its stable machine index. */
      index,
      /** Follow the value currently stored at this index. */
      get value() {
        return item();
      },
      /** Render the preview and inline editor. */
      get children() {
        return [renderItemPreview(item), renderTagsInputPart('itemInput', {})];
      },
    });
    return renderTagsInputPart('item', itemProps);
  }

  return (
    <For keyed={false} each={api().value}>
      {renderItem}
    </For>
  );
}
