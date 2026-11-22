import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { TextStyleProps } from '../styled-system/text-style';

type IntrinsicElement = keyof JSX.IntrinsicElements;

export interface TextClippingProps extends TextStyleProps {
  /** Clip overflow to one line. */
  truncate?: boolean | undefined;
  /** Clip to a positive line count or clear a prior clamp. */
  lineClamp?: number | `${number}` | 'none' | undefined;
  /** Skip default presentation while retaining native semantics. */
  unstyled?: boolean | undefined;
}

type NativeTextProps<As extends IntrinsicElement> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], keyof TextClippingProps | 'as' | 'asChild'> &
      TextClippingProps &
      (As extends 'p' ? { as?: As } : { as: As }) & { asChild?: undefined }
  : never;

type ChildTextProps = Omit<JSX.IntrinsicElements['p'], 'ref'> &
  TextClippingProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

export type TextProps<As extends IntrinsicElement = 'p'> = NativeTextProps<As> | ChildTextProps;
export type TextDefaults = Partial<
  Omit<JSX.IntrinsicElements['p'], 'ref' | 'children' | 'innerHTML'>
> &
  TextClippingProps;

export type TextRuntimeProps = JSX.HTMLAttributes<HTMLElement> &
  TextClippingProps & {
    as?: IntrinsicElement | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface TextPropsProviderProps {
  value: TextDefaults;
  children: JSX.Element;
}

const TextContext = createOptionalContext<Accessor<TextDefaults>>();

/** Supply reactive native Text defaults to descendant instances. */
export function TextPropsProvider(props: TextPropsProviderProps): JSX.Element {
  /** Read the latest defaults when a descendant uses them. */
  function readDefaults(): TextDefaults {
    return props.value;
  }
  return <TextContext value={readDefaults}>{props.children}</TextContext>;
}

/** Merge inherited native defaults before explicit instance props. */
export function useTextProps(instance: TextRuntimeProps): TextRuntimeProps {
  const inherited = useOptionalContext(TextContext);
  // The merge preserves native event tuples and styles across this typed boundary.
  return mergeProps(
    /** Read provider changes without rebuilding the native element. */
    () => inherited?.() ?? {},
    instance,
  ) as TextRuntimeProps;
}
