import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { wrapLayoutAttributes, wrapVariableStyle, type WrapLayoutProps } from './wrap-layout';

interface WrapOptions extends WrapLayoutProps {
  /** Suppress the default flex presentation while retaining layout selections. */
  unstyled?: boolean | undefined;
}

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  WrapOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render a native Wrap without generating a presentation stylesheet. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

export type WrapProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  WrapOptions,
  As
>;

/** Render a native flex container whose children wrap onto new lines. */
function WrapRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'align',
    'justify',
    'direction',
    'gap',
    'rowGap',
    'columnGap',
    'unstyled',
    'class',
    'ref',
  ]);
  const content = children(
    /** Keep mounted children stable while the wrap layout changes. */
    () => local.children,
  );
  /** Read caller content through the native or caller-owned path. */
  function readContent(): JSX.Element {
    return content();
  }

  /** Forward the mounted native element to the caller's ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native props and layout variables reactive after hydration. */
    () => ({
      ...native,
      ...wrapLayoutAttributes(local),
      style: wrapVariableStyle(local, native.style),
      class: composeRecipeClassNames('wrap', undefined, local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Wrap', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Bind native attributes and refs to the selected Wrap element. */
export const Wrap = WrapRoot as <As extends NativeElementTag = 'div'>(
  props: WrapProps<As>,
) => JSX.Element;

export { WrapItem, type WrapItemProps } from './wrap-item';
