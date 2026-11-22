import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { inputAppearanceAttributes } from './input-appearance-attributes';
import type { InputChoice, InputSize, InputVariant } from './input-appearance-options';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

interface InputAddonOptions {
  /** Select one of the authored Input sizes at supported breakpoints. */
  size?: InputChoice<InputSize>;
  /** Select one of the authored Input surface treatments. */
  variant?: InputChoice<InputVariant>;
  /** Keep native markup without the default presentation. */
  unstyled?: boolean;
  /** Add a consumer class through the `className` alias. */
  className?: string;
}

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | 'size'> &
  InputAddonOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render a selected native HTML element without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

export type InputAddonProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  InputAddonOptions,
  As
>;

/** Render fixed Input content with authored CSS size and variant selectors. */
function InputAddonRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'as',
    'asChild',
    'size',
    'variant',
    'unstyled',
    'children',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Preserve the caller's child while appearance choices change. */
    () => local.children,
  );
  const attributes = createMemo(
    /** Keep native attributes, choices, and classes reactive. */
    () => ({
      ...native,
      ...inputAppearanceAttributes(local.size, local.variant, 'InputAddon'),
      class: composeRecipeClassNames('input-addon', undefined, local.class, local.className),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: local.ref,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('InputAddon', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Preserve selected native tag and ref types in the public signature. */
export const InputAddon = InputAddonRoot as <As extends NativeElementTag = 'div'>(
  props: InputAddonProps<As>,
) => JSX.Element;
