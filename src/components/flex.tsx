import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { flexVariableStyle, type FlexLayoutProps } from './flex-layout';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { textStyleAttributes, type TextStyleProps } from '../styled-system/text-style';

interface FlexOptions extends FlexLayoutProps, TextStyleProps {
  /** Mark an unstyled composition while retaining Flex's explicit layout. */
  unstyled?: boolean | undefined;
}

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  FlexOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render one native Flex element without the styled factory. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

export type FlexProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  FlexOptions,
  As
>;

/** Render Flex with authored CSS for native props and live layout aliases. */
function FlexRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'align',
    'justify',
    'wrap',
    'direction',
    'basis',
    'grow',
    'shrink',
    'inline',
    'unstyled',
    'textStyle',
    'class',
    'ref',
  ]);
  const content = children(
    /** Keep mounted items stable as flex configuration changes. */
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
    /** Keep native attributes and alias variables reactive after hydration. */
    () => ({
      ...native,
      style: flexVariableStyle(local, native.style),
      class: composeRecipeClassNames('flex', undefined, local.class),
      'data-inline': local.inline ? 'true' : 'false',
      'data-unstyled': local.unstyled ? '' : undefined,
      ...textStyleAttributes(local.textStyle),
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Flex', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Bind native attributes and refs to the selected intrinsic element. */
export const Flex = FlexRoot as <As extends NativeElementTag = 'div'>(
  props: FlexProps<As>,
) => JSX.Element;
