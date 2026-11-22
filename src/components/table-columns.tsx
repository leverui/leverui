import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { requireTableRoot } from './table-context';
import type { NativeElementTag } from './native-element-props';
import { renderTablePart } from './table-part';
import type { TableColumnGroupProps, TableColumnProps, TablePartRuntimeProps } from './table-props';

type ColumnRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> & {
  as?: NativeElementTag | undefined;
  asChild?: RenderChild | undefined;
  htmlWidth?: string | number | undefined;
  className?: string | undefined;
  unstyled?: boolean | undefined;
  ref?: ((element: Element) => void) | undefined;
};

/** Render a selected native column without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Group native columns under the nearest Table root. */
function TableColumnGroupComponent(props: TablePartRuntimeProps): JSX.Element {
  return renderTablePart('TableColumnGroup', 'colgroup', 'columnGroup', props);
}

/** Render a native column with its width and span attributes intact. */
function TableColumnComponent(props: ColumnRuntimeProps): JSX.Element {
  requireTableRoot();
  const [local, native] = splitProps(props, [
    'as',
    'asChild',
    'htmlWidth',
    'class',
    'className',
    'unstyled',
    'ref',
  ]);

  /** Forward the selected column node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Map the compatibility width alias to a native column attribute. */
    () => ({
      ...native,
      width: local.htmlWidth,
      class: composeRecipeClassNames('table__column', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('TableColumn', local.asChild, attributes, () => undefined)
      ) : (
        <NativeElement component={local.as ?? 'col'} {...attributes()} />
      )}
    </>
  );
}

/** Expose native column-group attributes and caller-owned children. */
export const TableColumnGroup = TableColumnGroupComponent as <
  As extends NativeElementTag = 'colgroup',
>(
  props: TableColumnGroupProps<As>,
) => JSX.Element;

/** Expose native column attributes and the compatible width alias. */
export const TableColumn = TableColumnComponent as <As extends NativeElementTag = 'col'>(
  props: TableColumnProps<As>,
) => JSX.Element;
