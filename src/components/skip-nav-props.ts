import { type JSX } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

/** Pair the skip link and destination with a Lever UI ID. */
export const skipNavTargetId = 'lui-skip-nav';

export interface SkipNavOptions {
  /** Suppress the authored presentation while retaining navigation behavior. */
  unstyled?: boolean | undefined;
  /** Keep Solid's className alias alongside class. */
  className?: string | undefined;
}

export type SkipNavRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof SkipNavOptions
> &
  SkipNavOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export type SkipNavLinkProps<As extends NativeElementTag = 'a'> = NativeElementProps<
  'a',
  SkipNavOptions,
  As
>;

export type SkipNavContentProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  SkipNavOptions,
  As
>;
