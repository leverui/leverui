import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { TextareaSize, TextareaVariant } from './textarea-options';

type IntrinsicElement = keyof JSX.IntrinsicElements;
export type TextareaChoice<T extends string> = T | readonly (T | null)[] | ResponsiveValues<T>;

export interface TextareaBaseProps {
  /** Select authored geometry at ordinary breakpoints. */
  size?: TextareaChoice<TextareaSize> | undefined;
  /** Select the authored surface treatment at ordinary breakpoints. */
  variant?: TextareaChoice<TextareaVariant> | undefined;
  /** Select the semantic focus palette. */
  colorPalette?: string | undefined;
  /** Follow the native textarea's content with Zag automatic sizing. */
  autoresize?: boolean | undefined;
  /** Set an uncontrolled initial value without replacing later edits. */
  defaultValue?: string | number | undefined;
  /** Omit authored presentation while retaining Field semantics. */
  unstyled?: boolean | undefined;
}

type NativeTextareaProps<As extends IntrinsicElement> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], keyof TextareaBaseProps | 'as' | 'asChild'> &
      TextareaBaseProps &
      (As extends 'textarea' ? { as?: As } : { as: As }) & { asChild?: undefined }
  : never;

type ChildTextareaProps = Omit<JSX.IntrinsicElements['textarea'], keyof TextareaBaseProps | 'ref'> &
  TextareaBaseProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

export type TextareaProps<As extends IntrinsicElement = 'textarea'> =
  NativeTextareaProps<As> | ChildTextareaProps;
export type TextareaDefaults = Partial<
  Omit<JSX.IntrinsicElements['textarea'], 'ref' | 'children' | 'innerHTML'>
> &
  TextareaBaseProps;
export type TextareaRootProps = Omit<JSX.IntrinsicElements['textarea'], 'ref' | 'size'> &
  TextareaBaseProps & {
    as?: IntrinsicElement;
    asChild?: RenderChild | undefined;
    className?: string;
    ref?: ((element: Element) => void) | undefined;
  };

export interface TextareaPropsProviderProps {
  value: TextareaDefaults;
  children: JSX.Element;
}

const TextareaContext = createOptionalContext<Accessor<TextareaDefaults>>();

/** Supply reactive native Textarea defaults to descendant controls. */
export function TextareaPropsProvider(props: TextareaPropsProviderProps): JSX.Element {
  /** Read the current Solid prop where a descendant tracks it. */
  function readDefaults(): TextareaDefaults {
    return props.value;
  }
  return <TextareaContext value={readDefaults}>{props.children}</TextareaContext>;
}

/** Merge inherited native defaults before explicit instance props. */
export function useTextareaProps(instance: TextareaRootProps): TextareaRootProps {
  const inherited = useOptionalContext(TextareaContext);
  return mergeProps(
    /** Track provider changes without replacing the native textarea. */
    () => inherited?.() ?? {},
    instance,
  ) as TextareaRootProps;
}
