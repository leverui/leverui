import { type JSX } from '@solidjs/web';
import { renderDataListPart } from './data-list-part';
import type { DataListItemValueProps, DataListPartRuntimeProps } from './data-list-props';
import type { NativeElementTag } from './native-element-props';

/** Render one description value as a native dd. */
function DataListItemValueComponent(props: DataListPartRuntimeProps): JSX.Element {
  return renderDataListPart('DataListItemValue', 'dd', 'itemValue', props);
}

/** Expose native value attributes and caller-owned child rendering. */
export const DataListItemValue = DataListItemValueComponent as <As extends NativeElementTag = 'dd'>(
  props: DataListItemValueProps<As>,
) => JSX.Element;
