import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { HeadingSize } from './heading-size';

type IntrinsicElement = keyof JSX.IntrinsicElements;
export type HeadingSizeChoice =
  HeadingSize | readonly (HeadingSize | null)[] | ResponsiveValues<HeadingSize>;

export interface HeadingBaseProps {
  /** Select authored typography at ordinary breakpoints. */
  size?: HeadingSizeChoice | undefined;
  /** Skip default typography while retaining native semantics. */
  unstyled?: boolean | undefined;
}

type NativeHeadingProps<As extends IntrinsicElement> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], keyof HeadingBaseProps | 'as' | 'asChild'> &
      HeadingBaseProps &
      (As extends 'h2' ? { as?: As } : { as: As }) & { asChild?: undefined }
  : never;

type ChildHeadingProps = Omit<JSX.IntrinsicElements['h2'], keyof HeadingBaseProps | 'ref'> &
  HeadingBaseProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

export type HeadingProps<As extends IntrinsicElement = 'h2'> =
  NativeHeadingProps<As> | ChildHeadingProps;
export type HeadingDefaults = Partial<
  Omit<JSX.IntrinsicElements['h2'], 'ref' | 'children' | 'innerHTML'>
> &
  HeadingBaseProps;
export type HeadingRootProps = JSX.HTMLAttributes<HTMLElement> &
  HeadingBaseProps & {
    as?: IntrinsicElement;
    asChild?: RenderChild | undefined;
    className?: string;
    ref?: ((element: Element) => void) | undefined;
  };

export interface HeadingPropsProviderProps {
  value: HeadingDefaults;
  children: JSX.Element;
}

const HeadingContext = createOptionalContext<Accessor<HeadingDefaults>>();

/** Supply reactive native Heading defaults to descendant instances. */
export function HeadingPropsProvider(props: HeadingPropsProviderProps): JSX.Element {
  /** Read current defaults where a descendant tracks them. */
  function readDefaults(): HeadingDefaults {
    return props.value;
  }
  return <HeadingContext value={readDefaults}>{props.children}</HeadingContext>;
}

/** Merge inherited native defaults before explicit instance props. */
export function useHeadingProps(instance: HeadingRootProps): HeadingRootProps {
  const inherited = useOptionalContext(HeadingContext);
  return mergeProps(
    /** Track provider changes without replacing the native element. */
    () => inherited?.() ?? {},
    instance,
  ) as HeadingRootProps;
}
