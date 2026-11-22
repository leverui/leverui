import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { floatPlacementAttributes, floatVariableStyle, type FloatOptions } from './float-layout';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export type FloatProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  FloatOptions,
  As
>;

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  FloatOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected HTML element without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Anchor native or caller-owned content through authored CSS. */
function FloatRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'offset',
    'offsetX',
    'offsetY',
    'placement',
    'unstyled',
    'class',
    'ref',
  ]);
  const content = children(
    /** Preserve the child while placement changes. */
    () => local.children,
  );

  /** Read caller content for the child-owned path. */
  function readContent(): JSX.Element {
    return content();
  }

  /** Forward the selected element to the consumer's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep placement, offsets, and native attributes reactive. */
    () => ({
      ...native,
      ...floatPlacementAttributes(local.placement),
      style: floatVariableStyle(local, native.style),
      class: composeRecipeClassNames('float', undefined, local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Float', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native, selected-tag, and caller-owned Float props. */
export const Float = FloatRoot as <As extends NativeElementTag = 'div'>(
  props: FloatProps<As>,
) => JSX.Element;
