import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { gridVariableStyle, type GridOptions } from './grid-layout';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

interface GridBehavior extends GridOptions {
  unstyled?: boolean | undefined;
}

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  GridBehavior & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render one native grid element without a style runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

export type { GridOptions } from './grid-layout';
export type GridProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  GridBehavior,
  As
>;

/** Render Grid aliases through authored CSS and live element variables. */
function GridRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'templateColumns',
    'autoFlow',
    'autoRows',
    'autoColumns',
    'templateRows',
    'templateAreas',
    'column',
    'row',
    'inline',
    'unstyled',
    'class',
    'ref',
  ]);
  const content = children(
    /** Keep mounted grid items stable when their tracks change. */
    () => local.children,
  );

  /** Read children through the native or caller-owned path. */
  function readContent(): JSX.Element {
    return content();
  }

  /** Forward the mounted element to the caller's ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and Grid variables reactive after hydration. */
    () => ({
      ...native,
      style: gridVariableStyle(local, native.style),
      class: composeRecipeClassNames('grid', undefined, local.class),
      'data-inline': local.inline ? 'true' : 'false',
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Grid', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Bind native attributes and refs to the selected intrinsic element. */
export const Grid = GridRoot as <As extends NativeElementTag = 'div'>(
  props: GridProps<As>,
) => JSX.Element;
