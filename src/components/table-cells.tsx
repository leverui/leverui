import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import { renderTablePart } from './table-part';
import type {
  TableCellProps,
  TableColumnHeaderProps,
  TablePartRuntimeProps,
  TableRowProps,
} from './table-props';

/** Render a native Table row with authored state styling. */
function TableRowComponent(props: TablePartRuntimeProps): JSX.Element {
  return renderTablePart('TableRow', 'tr', 'row', props);
}

/** Render a native column header with authored part styling. */
function TableColumnHeaderComponent(props: TablePartRuntimeProps): JSX.Element {
  return renderTablePart('TableColumnHeader', 'th', 'columnHeader', props);
}

/** Render a native data cell with authored part styling. */
function TableCellComponent(props: TablePartRuntimeProps): JSX.Element {
  return renderTablePart('TableCell', 'td', 'cell', props);
}

/** Expose native row attributes and caller-owned children. */
export const TableRow = TableRowComponent as <As extends NativeElementTag = 'tr'>(
  props: TableRowProps<As>,
) => JSX.Element;
/** Expose native column-header attributes and caller-owned children. */
export const TableColumnHeader = TableColumnHeaderComponent as <As extends NativeElementTag = 'th'>(
  props: TableColumnHeaderProps<As>,
) => JSX.Element;
/** Expose native cell attributes and caller-owned children. */
export const TableCell = TableCellComponent as <As extends NativeElementTag = 'td'>(
  props: TableCellProps<As>,
) => JSX.Element;
