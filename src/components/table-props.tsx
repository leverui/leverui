import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export type TableSize = 'sm' | 'md' | 'lg';
export type TableVariant = 'line' | 'outline';
export type ResponsiveTableChoice<T extends string> =
  T | readonly (T | null)[] | ResponsiveValues<T>;

export interface TableRootBaseProps {
  /** Select cell padding and table text scale. */
  size?: ResponsiveTableChoice<TableSize> | undefined;
  /** Select the line or outline treatment. */
  variant?: ResponsiveTableChoice<TableVariant> | undefined;
  /** Highlight body rows on hover. */
  interactive?: boolean | undefined;
  /** Keep header rows at the scroll container's top edge. */
  stickyHeader?: boolean | undefined;
  /** Alternate the background of odd rows. */
  striped?: boolean | undefined;
  /** Separate columns with inline borders. */
  showColumnBorder?: boolean | undefined;
  /** Style plain native table descendants with the same rules as Table parts. */
  native?: boolean | undefined;
  /** Select a semantic color palette for row states. */
  colorPalette?: string | undefined;
  /** Omit authored presentation while retaining table semantics. */
  unstyled?: boolean | undefined;
}

export interface TablePartOptions {
  /** Omit authored presentation for this part. */
  unstyled?: boolean | undefined;
}

export type TableRootProps<As extends NativeElementTag = 'table'> = NativeElementProps<
  'table',
  TableRootBaseProps,
  As
>;
export type TableHeaderProps<As extends NativeElementTag = 'thead'> = NativeElementProps<
  'thead',
  TablePartOptions,
  As
>;
export type TableBodyProps<As extends NativeElementTag = 'tbody'> = NativeElementProps<
  'tbody',
  TablePartOptions,
  As
>;
export type TableFooterProps<As extends NativeElementTag = 'tfoot'> = NativeElementProps<
  'tfoot',
  TablePartOptions,
  As
>;
export type TableRowProps<As extends NativeElementTag = 'tr'> = NativeElementProps<
  'tr',
  TablePartOptions,
  As
>;
export type TableColumnHeaderProps<As extends NativeElementTag = 'th'> = NativeElementProps<
  'th',
  TablePartOptions,
  As
>;
export type TableCellProps<As extends NativeElementTag = 'td'> = NativeElementProps<
  'td',
  TablePartOptions,
  As
>;
export type TableCaptionProps<As extends NativeElementTag = 'caption'> = NativeElementProps<
  'caption',
  TablePartOptions & { captionSide?: 'top' | 'bottom' },
  As
>;
export type TableColumnGroupProps<As extends NativeElementTag = 'colgroup'> = NativeElementProps<
  'colgroup',
  TablePartOptions,
  As
>;
export type TableColumnProps<As extends NativeElementTag = 'col'> = NativeElementProps<
  'col',
  TablePartOptions & { htmlWidth?: string | number },
  As
>;
export type TableScrollAreaProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  TablePartOptions,
  As
>;

export type TableRootRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof TableRootBaseProps
> &
  TableRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type TablePartRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  TablePartOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    captionSide?: 'top' | 'bottom' | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface TableRootPropsProviderProps {
  value: TableRootBaseProps | Accessor<TableRootBaseProps>;
  children: JSX.Element;
}

const TablePropsContext = createOptionalContext<Accessor<TableRootBaseProps>>();

/** Supply reactive Table choices to descendant roots. */
export function TableRootPropsProvider(props: TableRootPropsProviderProps): JSX.Element {
  /** Read changing defaults inside each root's tracked scope. */
  function readDefaults(): TableRootBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }
  return <TablePropsContext value={readDefaults}>{props.children}</TablePropsContext>;
}

/** Merge nearest Table defaults with the root's current props. */
export function useTableProps(instance: TableRootRuntimeProps): TableRootRuntimeProps {
  const inherited = useOptionalContext(TablePropsContext);
  return mergeProps(
    /** Give explicit root values precedence over changing defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
