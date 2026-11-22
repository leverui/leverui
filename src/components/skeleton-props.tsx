import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { SquareSize } from './square-size';
import type { StackProps } from './stack';
import type { SkeletonVariantChoice } from './skeleton-choices';

type IntrinsicElement = keyof JSX.IntrinsicElements;

export interface SkeletonBaseProps {
  /** Keep the placeholder active until the content is ready. */
  loading?: boolean | undefined;
  /** Select an authored motion variant at ordinary breakpoints. */
  variant?: SkeletonVariantChoice | undefined;
  /** Suppress the default placeholder presentation. */
  unstyled?: boolean | undefined;
}

export type SkeletonRootProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  keyof SkeletonBaseProps | 'ref'
> &
  SkeletonBaseProps & {
    as?: IntrinsicElement;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

type NativeSkeletonProps<As extends IntrinsicElement> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], keyof SkeletonBaseProps | 'as' | 'asChild'> &
      SkeletonBaseProps &
      (As extends 'div' ? { as?: As } : { as: As }) & { asChild?: never }
  : never;

type ChildSkeletonProps = Omit<
  JSX.IntrinsicElements['div'],
  keyof SkeletonBaseProps | 'as' | 'asChild' | 'ref'
> &
  SkeletonBaseProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

/** Preserve native and caller-owned element types without object styling props. */
export type SkeletonProps<As extends IntrinsicElement = 'div'> =
  NativeSkeletonProps<As> | ChildSkeletonProps;

/** Add Circle's equal-width geometry to a placeholder. */
export type SkeletonCircleProps<As extends IntrinsicElement = 'div'> = SkeletonProps<As> & {
  size?: SquareSize | undefined;
};

/** Configure text line count and wrapper layout separately from each line. */
export type SkeletonTextProps = Omit<SkeletonRootProps, 'children' | 'ref'> & {
  children?: JSX.Element | (() => JSX.Element);
  noOfLines?: number | undefined;
  gap?: StackProps<'div'>['gap'];
  rootProps?: StackProps<'div'> | undefined;
  ref?: ((element: HTMLDivElement) => void) | undefined;
};

export type SkeletonDefaults = Partial<
  Omit<SkeletonRootProps, 'as' | 'asChild' | 'children' | 'ref'>
>;

export interface SkeletonPropsProviderProps {
  value: SkeletonDefaults | Accessor<SkeletonDefaults>;
  children: JSX.Element;
}

const SkeletonContext = createOptionalContext<Accessor<SkeletonDefaults>>();

/** Supply reactive native and appearance defaults to descendant placeholders. */
export function SkeletonPropsProvider(props: SkeletonPropsProviderProps): JSX.Element {
  /** Read provider values in each descendant's tracked scope. */
  function readDefaults(): SkeletonDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <SkeletonContext value={readDefaults}>{props.children}</SkeletonContext>;
}

/** Merge nearest placeholder defaults with live instance props. */
export function useSkeletonProps(instance: SkeletonRootProps): SkeletonRootProps {
  const inherited = useOptionalContext(SkeletonContext);
  return mergeProps(
    /** Give explicit placeholder props precedence over changing defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
