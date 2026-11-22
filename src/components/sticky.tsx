import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

interface StickyOptions {
  /** Suppress default positioning while retaining the public class. */
  unstyled?: boolean | undefined;
}

export type StickyProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  StickyOptions,
  As
>;

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  StickyOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected HTML element without presentation styles in JavaScript. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Pin native or caller-owned content through authored CSS. */
function StickyRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'unstyled',
    'class',
    'ref',
  ]);

  /** Read caller content through either rendering path. */
  function readContent(): JSX.Element {
    return local.children;
  }

  /** Forward the selected native element to the consumer. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes, classes, and unstyled state reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames('sticky', undefined, local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Sticky', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {local.children}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native, selected-tag, and caller-owned Sticky props. */
export const Sticky = StickyRoot as <As extends NativeElementTag = 'div'>(
  props: StickyProps<As>,
) => JSX.Element;
