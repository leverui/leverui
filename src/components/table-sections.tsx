import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import { renderTablePart } from './table-part';
import type {
  TableBodyProps,
  TableFooterProps,
  TableHeaderProps,
  TablePartRuntimeProps,
} from './table-props';

/** Render a native Table header with authored part styling. */
function TableHeaderComponent(props: TablePartRuntimeProps): JSX.Element {
  return renderTablePart('TableHeader', 'thead', 'header', props);
}

/** Render a native Table body with authored part styling. */
function TableBodyComponent(props: TablePartRuntimeProps): JSX.Element {
  return renderTablePart('TableBody', 'tbody', 'body', props);
}

/** Render a native Table footer with authored part styling. */
function TableFooterComponent(props: TablePartRuntimeProps): JSX.Element {
  return renderTablePart('TableFooter', 'tfoot', 'footer', props);
}

/** Expose native header attributes and caller-owned children. */
export const TableHeader = TableHeaderComponent as <As extends NativeElementTag = 'thead'>(
  props: TableHeaderProps<As>,
) => JSX.Element;
/** Expose native body attributes and caller-owned children. */
export const TableBody = TableBodyComponent as <As extends NativeElementTag = 'tbody'>(
  props: TableBodyProps<As>,
) => JSX.Element;
/** Expose native footer attributes and caller-owned children. */
export const TableFooter = TableFooterComponent as <As extends NativeElementTag = 'tfoot'>(
  props: TableFooterProps<As>,
) => JSX.Element;
