import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export type EmptyStateSize = 'sm' | 'md' | 'lg';
export type ResponsiveEmptyStateSize =
  EmptyStateSize | readonly (EmptyStateSize | null)[] | ResponsiveValues<EmptyStateSize>;

export interface EmptyStateRootBaseProps {
  /** Select padding, gap, and type scale at ordinary breakpoints. */
  size?: ResponsiveEmptyStateSize | undefined;
  /** Suppress authored presentation while retaining native semantics. */
  unstyled?: boolean | undefined;
}

export interface EmptyStatePartOptions {
  /** Suppress authored presentation for this part. */
  unstyled?: boolean | undefined;
}

export type EmptyStateRootProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  EmptyStateRootBaseProps,
  As
>;
export type EmptyStateContentProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  EmptyStatePartOptions,
  As
>;
export type EmptyStateIndicatorProps<As extends NativeElementTag = 'div'> =
  EmptyStateContentProps<As>;
export type EmptyStateTitleProps<As extends NativeElementTag = 'h3'> = NativeElementProps<
  'h3',
  EmptyStatePartOptions,
  As
>;
export type EmptyStateDescriptionProps<As extends NativeElementTag = 'p'> = NativeElementProps<
  'p',
  EmptyStatePartOptions,
  As
>;

export type EmptyStateRootRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof EmptyStateRootBaseProps
> &
  EmptyStateRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export type EmptyStatePartRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof EmptyStatePartOptions
> &
  EmptyStatePartOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface EmptyStatePropsProviderProps {
  value: EmptyStateRootBaseProps | Accessor<EmptyStateRootBaseProps>;
  children: JSX.Element;
}

const EmptyStatePropsContext = createOptionalContext<Accessor<EmptyStateRootBaseProps>>();

/** Supply reactive finite choices to descendant Empty State roots. */
export function EmptyStatePropsProvider(props: EmptyStatePropsProviderProps): JSX.Element {
  /** Read current defaults where a descendant tracks them. */
  function readDefaults(): EmptyStateRootBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }
  return <EmptyStatePropsContext value={readDefaults}>{props.children}</EmptyStatePropsContext>;
}

/** Merge inherited choices with the root's live native props. */
export function useEmptyStateProps(
  instance: EmptyStateRootRuntimeProps,
): EmptyStateRootRuntimeProps {
  const inherited = useOptionalContext(EmptyStatePropsContext);
  return mergeProps(
    /** Keep explicit root values ahead of changing provider defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
