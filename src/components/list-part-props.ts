import { type JSX } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import type { GetElementChildProps } from '../styled-system/element-child-props';
import type { GetSvgChildProps } from '../styled-system/svg-child-props';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export interface ListPartOptions {
  /** Suppress authored presentation for this List part. */
  unstyled?: boolean | undefined;
  /** Preserve Solid's className alias alongside class. */
  className?: string | undefined;
}

export type ListPartRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof ListPartOptions
> &
  ListPartOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export type ListIndicatorGetChildProps = GetElementChildProps & GetSvgChildProps;
export type ListIndicatorRenderChild = (getProps: ListIndicatorGetChildProps) => JSX.Element;
export type ListIndicatorRuntimeProps = Omit<ListPartRuntimeProps, 'asChild'> & {
  asChild?: ListIndicatorRenderChild | undefined;
};

type NativeIndicatorProps<As extends NativeElementTag> = Exclude<
  NativeElementProps<'span', ListPartOptions, As>,
  { asChild: RenderChild }
>;

type ChildIndicatorProps = Omit<JSX.HTMLAttributes<Element>, 'ref' | keyof ListPartOptions> &
  ListPartOptions & {
    as?: never;
    asChild: ListIndicatorRenderChild;
    ref?: ((element: Element) => void) | undefined;
  };

/** Permit native HTML indicators and caller-owned HTML or SVG children. */
export type ListPartProps<As extends NativeElementTag = 'span'> =
  NativeIndicatorProps<As> | ChildIndicatorProps;
