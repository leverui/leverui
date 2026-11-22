import { For } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { useRatingGroupContext } from './rating-group-machine';
import type { RatingGroupItemsProps } from './rating-group-part-props';
import { renderRatingGroupPart, type RatingGroupRuntimePartProps } from './rating-group-part';
import { RatingGroupItemIndicator } from './rating-group-indicator';

/** Render one styled item for every value supplied by the primitive machine. */
function RatingGroupItemsImpl(
  props: Omit<RatingGroupRuntimePartProps<'span'>, 'children'>,
): JSX.Element {
  const rating = useRatingGroupContext();
  return (
    <For keyed={false} each={rating().items}>
      {
        /** Bind each generated item to its stable machine index. */
        (index) => {
          const itemProps = mergeProps(props, {
            /** Follow machine item values when count changes. */
            get index() {
              return index();
            },
            /** Place the default indicator within the primitive item context. */
            get children() {
              return <RatingGroupItemIndicator />;
            },
          });
          return renderRatingGroupPart({ slot: 'item', props: itemProps });
        }
      }
    </For>
  );
}

/** The default items with their internal prop type, for composition inside Lever. */
export const RatingGroupDefaultItems = RatingGroupItemsImpl;

/** Preserve each item's native and child prop contract without exposing index. */
export const RatingGroupItems = RatingGroupItemsImpl as <
  As extends ComponentIntrinsicElement = 'span',
>(
  props: RatingGroupItemsProps<As>,
) => JSX.Element;
