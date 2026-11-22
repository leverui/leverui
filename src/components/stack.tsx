import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { createStackContent, type StackSeparatorRenderer } from './stack-content';
import {
  stackDirectionAttributes,
  stackVariableStyle,
  type StackLayoutProps,
} from './stack-layout';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { textStyleAttributes, type TextStyleProps } from '../styled-system/text-style';

export type { StackSeparatorRenderProps, StackSeparatorRenderer } from './stack-content';

interface StackOptions extends StackLayoutProps, TextStyleProps {
  /** Recompute a changing Solid child list before placing separators. */
  renderChildren?: (() => JSX.Element) | undefined;
  separator?: StackSeparatorRenderer | undefined;
  unstyled?: boolean | undefined;
}

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  StackOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render one native Stack element without a style runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

export type StackProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  StackOptions,
  As
>;

/** Render Stack layout and separately owned separators through authored CSS. */
export function StackRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'renderChildren',
    'as',
    'asChild',
    'align',
    'justify',
    'wrap',
    'direction',
    'gap',
    'separator',
    'unstyled',
    'textStyle',
    'class',
    'ref',
  ]);
  const stackContent = createStackContent(local);

  /** Forward the mounted native element to the caller's ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep layout selections and native attributes reactive after hydration. */
    () => ({
      ...native,
      ...stackDirectionAttributes(local.direction),
      style: stackVariableStyle(local, Boolean(local.separator), native.style),
      class: composeRecipeClassNames('stack', undefined, local.class),
      'data-has-separator': local.separator ? '' : undefined,
      'data-unstyled': local.unstyled ? '' : undefined,
      ...textStyleAttributes(local.textStyle),
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Stack', local.asChild, attributes, stackContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {stackContent()}
        </NativeElement>
      )}
    </>
  );
}

/** Bind native attributes and refs to the selected Stack element. */
export const Stack = StackRoot as <As extends NativeElementTag = 'div'>(
  props: StackProps<As>,
) => JSX.Element;

/** Fix the horizontal direction while allowing consumer alignment. */
function HStackRoot(props: RuntimeProps): JSX.Element {
  const [local, rest] = splitProps(props, ['align', 'direction']);
  return <StackRoot {...rest} align={local.align ?? 'center'} direction="row" />;
}

/** Bind horizontal Stack props and refs to the selected native element. */
export const HStack = HStackRoot as <As extends NativeElementTag = 'div'>(
  props: StackProps<As>,
) => JSX.Element;

/** Fix the vertical direction while allowing consumer alignment. */
function VStackRoot(props: RuntimeProps): JSX.Element {
  const [local, rest] = splitProps(props, ['align', 'direction']);
  return <StackRoot {...rest} align={local.align ?? 'center'} direction="column" />;
}

/** Bind vertical Stack props and refs to the selected native element. */
export const VStack = VStackRoot as <As extends NativeElementTag = 'div'>(
  props: StackProps<As>,
) => JSX.Element;
