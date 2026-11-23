import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { renderSegmentGroupPart } from './segment-group-part';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type {
  SegmentGroupIndicatorProps,
  SegmentGroupItemElement,
  SegmentGroupItemProps,
  SegmentGroupItemTextProps,
} from './segment-group-part-props';

/** Bind an item to a selectable Segment Group value. */
export function SegmentGroupItem<As extends SegmentGroupItemElement = 'label'>(
  props: SegmentGroupItemProps<As>,
): JSX.Element {
  /** Detect item surfaces that need an inner native label. */
  function usesNonLabel(): boolean {
    return Boolean((props.as && props.as !== 'label') || props.asChild);
  }

  // The proxy preserves the selected native prop branch while replacing only children.
  const itemProps = mergeProps(
    props,
    /** `false` removes Zag's label-only association; an undefined override would fall through. */
    () => (usesNonLabel() ? { for: false } : {}),
    {
      /** Preserve a full native label hit area when the item uses another tag. */
      get children() {
        return (
          <>
            {usesNonLabel() ? (
              <label class="lui-segment-group__item-hit-area">
                <span class="lui-segment-group__item-hit-target" aria-hidden="true" />
                {props.children}
              </label>
            ) : (
              props.children
            )}
          </>
        );
      },
    },
  ) as SegmentGroupItemProps<As>;
  return renderSegmentGroupPart({ slot: 'item', props: itemProps });
}

/** Render visible text for the nearest Segment Group item. */
export function SegmentGroupItemText<As extends PrimitiveNativeTag = 'span'>(
  props: SegmentGroupItemTextProps<As>,
): JSX.Element {
  return renderSegmentGroupPart({ slot: 'itemText', props });
}

/** Position the selected-item indicator using the primitive machine geometry. */
export function SegmentGroupIndicator<As extends PrimitiveNativeTag = 'div'>(
  props: SegmentGroupIndicatorProps<As>,
): JSX.Element {
  return renderSegmentGroupPart({ slot: 'indicator', props });
}
