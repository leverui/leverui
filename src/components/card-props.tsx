import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { mergeRecipeProps } from './recipe-props-merge';

export type CardChoice<T extends string> = T | readonly (T | null)[] | ResponsiveValues<T>;

// A type alias, unlike an interface, is assignable to JSX props with `data-*` index signatures.
export type CardRootBaseProps = {
  /** Select one of the authored Card padding and title sizes. */
  size?: CardChoice<'sm' | 'md' | 'lg'> | undefined;
  /** Select the authored surface treatment. */
  variant?: CardChoice<'elevated' | 'outline' | 'subtle'> | undefined;
  /** Omit default Card presentation while retaining public hooks. */
  unstyled?: boolean | undefined;
};

export interface CardPartOptions {
  /** Omit authored presentation for this part. */
  unstyled?: boolean | undefined;
}

export type CardRootProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  CardRootBaseProps,
  As
>;
export type CardBodyProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  CardPartOptions,
  As
>;
export type CardHeaderProps<As extends NativeElementTag = 'div'> = CardBodyProps<As>;
export type CardFooterProps<As extends NativeElementTag = 'div'> = CardBodyProps<As>;
export type CardTitleProps<As extends NativeElementTag = 'h3'> = NativeElementProps<
  'h3',
  CardPartOptions,
  As
>;
export type CardDescriptionProps<As extends NativeElementTag = 'p'> = NativeElementProps<
  'p',
  CardPartOptions,
  As
>;

export type CardRootRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  keyof CardRootBaseProps | 'ref'
> &
  CardRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type CardPartRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  CardPartOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface CardPropsProviderProps {
  value: CardRootBaseProps | Accessor<CardRootBaseProps>;
  children: JSX.Element;
}

const CardPropsContext = createOptionalContext<Accessor<CardRootBaseProps>>();

/** Supply reactive Card defaults to descendant roots. */
export function CardPropsProvider(props: CardPropsProviderProps): JSX.Element {
  /** Read static or changing defaults in a descendant's tracked scope. */
  function readDefaults(): CardRootBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <CardPropsContext value={readDefaults}>{props.children}</CardPropsContext>;
}

/** Merge nearest Card defaults with live instance props. */
export function useCardProps(instance: CardRootRuntimeProps): CardRootRuntimeProps {
  const inherited = useOptionalContext(CardPropsContext);
  return mergeRecipeProps<CardRootRuntimeProps>(
    /** Let explicit root props override changing provider defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
