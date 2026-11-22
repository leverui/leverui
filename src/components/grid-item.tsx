import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import {
  gridItemSelectionAttributes,
  gridItemVariableStyle,
  type GridItemPlacement,
} from './grid-item-layout';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

interface GridItemBehavior extends GridItemPlacement {
  unstyled?: boolean | undefined;
}

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  GridItemBehavior & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render one native grid item without a style runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

export type GridItemProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  GridItemBehavior,
  As
>;

/** Render GridItem placement through authored CSS and live element variables. */
function GridItemRoot(props: RuntimeProps): JSX.Element {
  const [placement, local, native] = splitProps(
    props,
    ['area', 'colSpan', 'colStart', 'colEnd', 'rowStart', 'rowEnd', 'rowSpan'],
    ['children', 'as', 'asChild', 'unstyled', 'class', 'ref'],
  );
  const content = children(
    /** Retain mounted children when their placement changes. */
    () => local.children,
  );

  /** Read children through the native or caller-owned path. */
  function readContent(): JSX.Element {
    return content();
  }

  /** Forward the mounted item element to the caller's ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and placement variables reactive. */
    () => ({
      ...native,
      ...gridItemSelectionAttributes(placement),
      style: gridItemVariableStyle(placement, native.style),
      class: composeRecipeClassNames('grid-item', undefined, local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('GridItem', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Bind native attributes and refs to the selected intrinsic element. */
export const GridItem = GridItemRoot as <As extends NativeElementTag = 'div'>(
  props: GridItemProps<As>,
) => JSX.Element;
