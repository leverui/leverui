import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { centerInlineAttributes, type CenterInline } from './center-inline';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { textStyleAttributes, type TextStyleProps } from '../styled-system/text-style';

interface CenterOptions extends TextStyleProps {
  /** Render as an inline flex container at the selected breakpoints. */
  inline?: CenterInline | undefined;
  /** Suppress default layout rules while retaining the public class. */
  unstyled?: boolean | undefined;
}

export type CenterProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  CenterOptions,
  As
>;

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  CenterOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected HTML element without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Center native or caller-owned content through authored CSS. */
function CenterRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'inline',
    'unstyled',
    'textStyle',
    'class',
    'ref',
  ]);

  /** Read content through either rendering path. */
  function readContent(): JSX.Element {
    return local.children;
  }

  /** Forward the selected element to the consumer's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, classes, and responsive layout reactive. */
    () => ({
      ...native,
      ...centerInlineAttributes(local.inline),
      class: composeRecipeClassNames('center', undefined, local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ...textStyleAttributes(local.textStyle),
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Center', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {local.children}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native, selected-tag, and caller-owned Center props. */
export const Center = CenterRoot as <As extends NativeElementTag = 'div'>(
  props: CenterProps<As>,
) => JSX.Element;
