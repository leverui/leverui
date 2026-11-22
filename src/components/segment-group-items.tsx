import { splitProps } from '../primitives/utils/split-props';
import { createMemo, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { SegmentGroupItem, SegmentGroupItemText } from './segment-group-parts';
import { SegmentGroupItemHiddenInput } from './segment-group-machine';
import type {
  SegmentGroupItemData,
  SegmentGroupItemElement,
  SegmentGroupItemsProps,
} from './segment-group-part-props';

/** Normalize the convenience list while retaining caller-provided label nodes. */
function normalizeItem(item: string | SegmentGroupItemData): SegmentGroupItemData {
  return typeof item === 'string' ? { value: item, label: item } : item;
}

/** Keep a generated item's DOM identity stable when its data object changes. */
function itemValue(item: string | SegmentGroupItemData): string {
  return typeof item === 'string' ? item : item.value;
}

/** Render one native radio input and styled item per convenience value. */
function SegmentGroupItemsImpl(props: SegmentGroupItemsProps): JSX.Element {
  const [local, itemProps] = splitProps(props, ['items']);
  return (
    <For each={local.items} keyed={itemValue}>
      {
        /** Update item props without remounting a radio with the same value. */
        (entry) => {
          const item = createMemo(
            /** Follow the latest generated label and disabled state. */
            () => normalizeItem(entry()),
          );
          return (
            <SegmentGroupItem value={item().value} disabled={item().disabled} {...itemProps}>
              <SegmentGroupItemText>{item().label}</SegmentGroupItemText>
              <SegmentGroupItemHiddenInput />
            </SegmentGroupItem>
          );
        }
      }
    </For>
  );
}

/** Accept the native element selected by each generated item's `as` prop. */
export const SegmentGroupItems = SegmentGroupItemsImpl as <
  As extends SegmentGroupItemElement = 'label',
>(
  props: SegmentGroupItemsProps<As> & { as?: As },
) => JSX.Element;
