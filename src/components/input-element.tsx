import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import {
  inputElementPlacementAttributes,
  type InputElementPlacementChoice,
} from './input-element-attributes';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

interface InputElementOptions {
  /** Place the adornment at a logical edge at supported breakpoints. */
  placement?: InputElementPlacementChoice;
  /** Keep native markup without default presentation. */
  unstyled?: boolean;
  /** Add a consumer class through the `className` alias. */
  className?: string;
}

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  InputElementOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render a selected native HTML element without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

export type InputElementProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  InputElementOptions,
  As
>;

/** Render an adornment with authored CSS and responsive placement attributes. */
function InputElementRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'as',
    'asChild',
    'placement',
    'unstyled',
    'children',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Preserve the caller's child while placement changes. */
    () => local.children,
  );
  const attributes = createMemo(
    /** Keep native attributes, placement, and classes reactive. */
    () => ({
      ...native,
      ...inputElementPlacementAttributes(local.placement),
      class: composeRecipeClassNames('input-element', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: local.ref,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('InputElement', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Preserve selected native tag and ref types in the public signature. */
export const InputElement = InputElementRoot as <As extends NativeElementTag = 'div'>(
  props: InputElementProps<As>,
) => JSX.Element;
