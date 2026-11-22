import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementTag } from './native-element-props';
import type { TableScrollAreaProps } from './table-props';

type ScrollRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> & {
  as?: NativeElementTag | undefined;
  asChild?: RenderChild | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
  ref?: ((element: Element) => void) | undefined;
};

/** Render a selected native scroll element without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Wrap a table in a horizontally scrolling native div. */
function TableScrollAreaComponent(props: ScrollRuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Keep the table node mounted across scroll container updates. */
    () => local.children,
  );

  /** Forward the scroll container node to the consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and the scroll hook reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('table__scrollArea', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('TableScrollArea', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native scroll-container attributes and caller-owned children. */
export const TableScrollArea = TableScrollAreaComponent as <As extends NativeElementTag = 'div'>(
  props: TableScrollAreaProps<As>,
) => JSX.Element;
