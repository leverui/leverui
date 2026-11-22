import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementTag } from './native-element-props';
import { squareVariableStyle } from './square-layout';
import type { SquareSizeOptions } from './square-size';
import { textStyleAttributes } from '../styled-system/text-style';

export type ShapeRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  SquareSizeOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

type SquareFrameProps = ShapeRuntimeProps & { family: 'Square' | 'Circle' };

/** Render the selected HTML element without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Bind equal geometry and native attributes for Square and Circle. */
export function SquareFrame(props: SquareFrameProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'family',
    'size',
    'unstyled',
    'textStyle',
    'class',
    'ref',
  ]);

  /** Read caller content through either rendering path. */
  function readContent(): JSX.Element {
    return local.children;
  }

  /** Forward the selected native element to the caller. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep size, native styles, and the public hook reactive. */
    () => ({
      ...native,
      style: squareVariableStyle(local.size, native.style),
      class: composeRecipeClassNames(
        local.family === 'Square' ? 'square' : 'circle',
        undefined,
        local.class,
      ),
      'data-unstyled': local.unstyled ? '' : undefined,
      ...textStyleAttributes(local.textStyle),
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(local.family, local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {local.children}
        </NativeElement>
      )}
    </>
  );
}
