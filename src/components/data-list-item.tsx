import { type JSX } from '@solidjs/web';
import { renderDataListPart } from './data-list-part';
import type { DataListItemProps, DataListPartRuntimeProps } from './data-list-props';
import type { NativeElementTag } from './native-element-props';

/** Group one term and description in a native div. */
function DataListItemComponent(props: DataListPartRuntimeProps): JSX.Element {
  return renderDataListPart('DataListItem', 'div', 'item', props);
}

/** Expose native item attributes and caller-owned child rendering. */
export const DataListItem = DataListItemComponent as <As extends NativeElementTag = 'div'>(
  props: DataListItemProps<As>,
) => JSX.Element;
