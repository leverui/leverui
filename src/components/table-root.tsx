import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { tableAttributes } from './table-attributes';
import { readTableChoices, readTablePalette } from './table-choices';
import { TableContextProvider } from './table-context';
import type { NativeElementTag } from './native-element-props';
import { useTableProps, type TableRootProps, type TableRootRuntimeProps } from './table-props';

/** Render a selected native table element without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a semantic Table with authored variants and native descendants. */
function TableRootComponent(props: TableRootRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children', 'asChild']);
  const merged = useTableProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'size',
    'variant',
    'interactive',
    'stickyHeader',
    'striped',
    'showColumnBorder',
    'native',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const choices = createMemo(
    /** Validate finite choices before reflecting them on the table. */
    () => readTableChoices(local),
  );

  /** Forward the selected table node to the consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and Table CSS selectors reactive. */
    () => ({
      ...native,
      ...tableAttributes(choices()),
      'data-interactive': local.interactive ? '' : undefined,
      'data-sticky-header': local.stickyHeader ? '' : undefined,
      'data-striped': local.striped ? '' : undefined,
      'data-show-column-border': local.showColumnBorder ? '' : undefined,
      'data-native': local.native ? '' : undefined,
      'data-lui-color-palette': readTablePalette(local.colorPalette),
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('table__root', undefined, local.class, local.className),
      ref: attachNode,
    }),
  );

  /** Resolve table descendants inside their nearest semantic root. */
  function renderRoot(): JSX.Element {
    const content = children(
      /** Preserve native rows and cells across variant changes. */
      () => contentProps.children,
    );
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild('TableRoot', contentProps.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'table'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(TableContextProvider, {
    value: true,
    /** Mount native descendants while Table parts can read their root. */
    get children() {
      return renderRoot();
    },
  });
}

/** Expose native table attributes and caller-owned child rendering. */
export const TableRoot = TableRootComponent as <As extends NativeElementTag = 'table'>(
  props: TableRootProps<As>,
) => JSX.Element;
