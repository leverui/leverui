import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import { renderTablePart } from './table-part';
import type { TableCaptionProps, TablePartRuntimeProps } from './table-props';

/** Render a native Table caption below the table unless a side is supplied. */
function TableCaptionComponent(props: TablePartRuntimeProps): JSX.Element {
  return renderTablePart('TableCaption', 'caption', 'caption', props);
}

/** Expose native caption attributes and caller-owned children. */
export const TableCaption = TableCaptionComponent as <As extends NativeElementTag = 'caption'>(
  props: TableCaptionProps<As>,
) => JSX.Element;
