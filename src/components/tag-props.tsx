import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export type TagSize = 'sm' | 'md' | 'lg' | 'xl';
export type TagVariant = 'subtle' | 'solid' | 'outline' | 'surface';
export type ResponsiveTagChoice<T extends string> = T | readonly (T | null)[] | ResponsiveValues<T>;

export interface TagRootBaseProps {
  /** Set root geometry and part sizes at ordinary breakpoints. */
  size?: ResponsiveTagChoice<TagSize> | undefined;
  /** Select the Tag's color treatment at ordinary breakpoints. */
  variant?: ResponsiveTagChoice<TagVariant> | undefined;
  /** Select the Tag's semantic color palette. */
  colorPalette?: string | undefined;
  /** Omit authored presentation while retaining native markup. */
  unstyled?: boolean | undefined;
}

export interface TagPartOptions {
  /** Omit authored presentation for this part. */
  unstyled?: boolean | undefined;
}

type NativeTagProps<Tag extends NativeElementTag, Behavior, As extends NativeElementTag> = Exclude<
  NativeElementProps<Tag, Behavior, As>,
  { asChild: RenderChild }
>;

type ChildTagProps<Tag extends NativeElementTag, Behavior> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof Behavior | 'ref'
> &
  Behavior & { as?: never; asChild: RenderChild; ref?: (element: HTMLElement) => void };

export type TagRootProps<As extends NativeElementTag = 'div'> =
  NativeTagProps<'div', TagRootBaseProps, As> | ChildTagProps<'div', TagRootBaseProps>;
export type TagLabelProps<As extends NativeElementTag = 'span'> =
  NativeTagProps<'span', TagPartOptions, As> | ChildTagProps<'span', TagPartOptions>;
export type TagStartElementProps<As extends NativeElementTag = 'span'> = TagLabelProps<As>;
export type TagEndElementProps<As extends NativeElementTag = 'span'> = TagLabelProps<As>;
export type TagCloseTriggerProps<As extends NativeElementTag = 'button'> =
  NativeTagProps<'button', TagPartOptions, As> | ChildTagProps<'button', TagPartOptions>;

export type TagRootRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | 'size'> &
  TagRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type TagPartRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  TagPartOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type TagCloseRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  TagPartOptions & {
    type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'] | undefined;
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface TagRootPropsProviderProps {
  value: TagRootBaseProps | Accessor<TagRootBaseProps>;
  children: JSX.Element;
}

const TagPropsContext = createOptionalContext<Accessor<TagRootBaseProps>>();

/** Supply reactive Tag choices to descendant roots. */
export function TagRootPropsProvider(props: TagRootPropsProviderProps): JSX.Element {
  /** Read current defaults where a descendant tracks them. */
  function readDefaults(): TagRootBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <TagPropsContext value={readDefaults}>{props.children}</TagPropsContext>;
}

/** Merge nearest Tag defaults with current root props. */
export function useTagProps(instance: TagRootRuntimeProps): TagRootRuntimeProps {
  const inherited = useOptionalContext(TagPropsContext);
  return mergeProps(
    /** Preserve explicit root values over changing provider defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
