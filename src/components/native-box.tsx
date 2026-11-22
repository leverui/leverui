import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { textStyleAttributes, type TextStyleProps } from '../styled-system/text-style';

type IntrinsicElement = keyof JSX.IntrinsicElements;

export type NativeBoxRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  TextStyleProps & {
    as?: IntrinsicElement | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected native tag without a presentation runtime. */
const NativeElement = Dynamic as (
  props: { component: IntrinsicElement } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a class-only Box with native attributes and caller-owned children. */
export function NativeBox(props: NativeBoxRuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'textStyle',
    'class',
    'ref',
  ]);

  /** Read children through either rendering path. */
  function readContent(): JSX.Element {
    return local.children;
  }

  /** Forward the selected native element to the caller. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and the public Box hook reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('box', undefined, local.class),
      ...textStyleAttributes(local.textStyle),
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Box', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {local.children}
        </NativeElement>
      )}
    </>
  );
}
