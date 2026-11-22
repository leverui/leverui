import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { RenderSvgChild } from '../styled-system/svg-child-props';
import type { BlockquoteJustify, BlockquoteVariant } from './blockquote-choices';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export type BlockquoteChoice<T extends string> = T | readonly (T | null)[] | ResponsiveValues<T>;

export interface BlockquoteRootBaseProps {
  /** Select the border and icon treatment at ordinary breakpoints. */
  variant?: BlockquoteChoice<BlockquoteVariant> | undefined;
  /** Align quote content at ordinary breakpoints. */
  justify?: BlockquoteChoice<BlockquoteJustify> | undefined;
  /** Select the semantic palette used by the border and icon. */
  colorPalette?: string | undefined;
  /** Omit authored presentation while retaining semantic markup. */
  unstyled?: boolean | undefined;
}

export interface BlockquotePartOptions {
  /** Omit authored presentation for this part. */
  unstyled?: boolean | undefined;
}

export type BlockquoteRootProps<As extends NativeElementTag = 'figure'> = NativeElementProps<
  'figure',
  BlockquoteRootBaseProps,
  As
>;
export type BlockquoteContentProps<As extends NativeElementTag = 'blockquote'> = NativeElementProps<
  'blockquote',
  BlockquotePartOptions,
  As
>;
export type BlockquoteCaptionProps<As extends NativeElementTag = 'figcaption'> = NativeElementProps<
  'figcaption',
  BlockquotePartOptions,
  As
>;

type IntrinsicElement = keyof JSX.IntrinsicElements;
type NativeIconProps<As extends IntrinsicElement> = Omit<
  JSX.IntrinsicElements[NoInfer<As>],
  keyof BlockquotePartOptions | 'as' | 'asChild'
> &
  BlockquotePartOptions &
  (As extends 'svg' ? { as?: As } : { as: As }) & { asChild?: never };
type ChildIconProps = Omit<
  JSX.IntrinsicElements['svg'],
  keyof BlockquotePartOptions | 'as' | 'asChild' | 'ref'
> &
  BlockquotePartOptions & {
    as?: never;
    asChild: RenderSvgChild;
    ref?: ((element: SVGSVGElement) => void) | undefined;
  };
export type BlockquoteIconProps<As extends IntrinsicElement = 'svg'> =
  NativeIconProps<As> | ChildIconProps;

export type BlockquoteRootRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof BlockquoteRootBaseProps
> &
  BlockquoteRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type BlockquotePartRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  BlockquotePartOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type BlockquoteIconRuntimeProps = Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'ref'> &
  BlockquotePartOptions & {
    as?: IntrinsicElement | undefined;
    asChild?: RenderSvgChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface BlockquotePropsProviderProps {
  value: BlockquoteRootBaseProps | Accessor<BlockquoteRootBaseProps>;
  children: JSX.Element;
}

const BlockquotePropsContext = createOptionalContext<Accessor<BlockquoteRootBaseProps>>();

/** Supply reactive Blockquote defaults to descendant roots. */
export function BlockquotePropsProvider(props: BlockquotePropsProviderProps): JSX.Element {
  /** Read current defaults when a descendant tracks them. */
  function readDefaults(): BlockquoteRootBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <BlockquotePropsContext value={readDefaults}>{props.children}</BlockquotePropsContext>;
}

/** Merge the nearest Blockquote defaults with live root props. */
export function useBlockquoteProps(
  instance: BlockquoteRootRuntimeProps,
): BlockquoteRootRuntimeProps {
  const inherited = useOptionalContext(BlockquotePropsContext);
  return mergeProps(
    /** Give explicit root props precedence over changing defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
