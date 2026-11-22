import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export type StatusSize = 'sm' | 'md' | 'lg';
export type ResponsiveStatusSize =
  StatusSize | readonly (StatusSize | null)[] | ResponsiveValues<StatusSize>;

export interface StatusRootBaseProps {
  /** Set the root text size at the selected breakpoints. */
  size?: ResponsiveStatusSize | undefined;
  /** Select the indicator's semantic solid color. */
  colorPalette?: string | undefined;
  /** Omit authored presentation while retaining native markup. */
  unstyled?: boolean | undefined;
}

export interface StatusIndicatorOptions {
  /** Omit authored presentation for this indicator. */
  unstyled?: boolean | undefined;
}

type NativeStatusProps<
  Tag extends NativeElementTag,
  Behavior,
  As extends NativeElementTag,
> = Exclude<NativeElementProps<Tag, Behavior, As>, { asChild: RenderChild }>;

type ChildStatusProps<Tag extends NativeElementTag, Behavior> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof Behavior | 'ref'
> &
  Behavior & { as?: never; asChild: RenderChild; ref?: (element: HTMLElement) => void };

export type StatusRootProps<As extends NativeElementTag = 'div'> =
  NativeStatusProps<'div', StatusRootBaseProps, As> | ChildStatusProps<'div', StatusRootBaseProps>;
export type StatusIndicatorProps<As extends NativeElementTag = 'div'> =
  | NativeStatusProps<'div', StatusIndicatorOptions, As>
  | ChildStatusProps<'div', StatusIndicatorOptions>;

export type StatusRootRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | 'size'> &
  StatusRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type StatusIndicatorRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  StatusIndicatorOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface StatusPropsProviderProps {
  value: StatusRootBaseProps | Accessor<StatusRootBaseProps>;
  children: JSX.Element;
}

const StatusPropsContext = createOptionalContext<Accessor<StatusRootBaseProps>>();

/** Supply reactive Status choices to descendant roots. */
export function StatusPropsProvider(props: StatusPropsProviderProps): JSX.Element {
  /** Read current defaults where a descendant tracks them. */
  function readDefaults(): StatusRootBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <StatusPropsContext value={readDefaults}>{props.children}</StatusPropsContext>;
}

/** Merge nearest Status defaults with live instance props. */
export function useStatusProps(instance: StatusRootRuntimeProps): StatusRootRuntimeProps {
  const inherited = useOptionalContext(StatusPropsContext);
  return mergeProps(
    /** Give explicit root values precedence over changing defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
