import { type JSX } from '@solidjs/web';
import { renderDataListPart } from './data-list-part';
import type { DataListItemLabelProps, DataListPartRuntimeProps } from './data-list-props';
import type { NativeElementTag } from './native-element-props';

/** Render one description term as a native dt. */
function DataListItemLabelComponent(props: DataListPartRuntimeProps): JSX.Element {
  return renderDataListPart('DataListItemLabel', 'dt', 'itemLabel', props);
}

/** Expose native term attributes and caller-owned child rendering. */
export const DataListItemLabel = DataListItemLabelComponent as <As extends NativeElementTag = 'dt'>(
  props: DataListItemLabelProps<As>,
) => JSX.Element;
