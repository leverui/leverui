import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

interface SeparatorOptions {
  unstyled?: boolean | undefined;
}

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  SeparatorOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render one native separator without a style runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

export type StackSeparatorProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  SeparatorOptions,
  As
>;

/** Render a stretchable separator with a stable CSS class hook. */
function StackSeparatorRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'unstyled',
    'class',
    'ref',
  ]);
  const content = children(
    /** Keep separator content under its Solid owner. */
    () => local.children,
  );

  /** Read children through the native or caller-owned path. */
  function readContent(): JSX.Element {
    return content();
  }

  /** Forward the mounted separator element to the caller's ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and classes reactive after hydration. */
    () => ({
      ...native,
      class: composeRecipeClassNames('stack-separator', undefined, local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('StackSeparator', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Bind separator attributes and refs to the selected native element. */
export const StackSeparator = StackSeparatorRoot as <As extends NativeElementTag = 'div'>(
  props: StackSeparatorProps<As>,
) => JSX.Element;
