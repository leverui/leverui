import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type {
  BreadcrumbSize,
  BreadcrumbVariant,
  ResponsiveBreadcrumbChoice,
} from './breadcrumb-choices';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export interface BreadcrumbRootBaseProps {
  /** Set item spacing and text scale. */
  size?: ResponsiveBreadcrumbChoice<BreadcrumbSize> | undefined;
  /** Select plain or underlined links. */
  variant?: ResponsiveBreadcrumbChoice<BreadcrumbVariant> | undefined;
  /** Bind scoped palette variables to the navigation landmark. */
  colorPalette?: string | undefined;
  /** Omit authored presentation while retaining navigation semantics. */
  unstyled?: boolean | undefined;
}

export interface BreadcrumbPartOptions {
  /** Omit authored presentation for this part. */
  unstyled?: boolean | undefined;
}

type NativeBreadcrumbProps<
  Tag extends NativeElementTag,
  Behavior,
  As extends NativeElementTag,
> = Exclude<NativeElementProps<Tag, Behavior, As>, { asChild: RenderChild }>;

type ChildBreadcrumbProps<
  Tag extends NativeElementTag,
  Behavior,
  ChildElement extends HTMLElement,
> = Omit<JSX.IntrinsicElements[Tag], keyof Behavior | 'ref'> &
  Behavior & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: ChildElement) => void) | undefined;
  };

export type BreadcrumbRootProps<As extends NativeElementTag = 'nav'> =
  | NativeBreadcrumbProps<'nav', BreadcrumbRootBaseProps, As>
  | ChildBreadcrumbProps<'nav', BreadcrumbRootBaseProps, HTMLElement>;
export type BreadcrumbListProps<As extends NativeElementTag = 'ol'> =
  | NativeBreadcrumbProps<'ol', BreadcrumbPartOptions, As>
  | ChildBreadcrumbProps<'ol', BreadcrumbPartOptions, HTMLOListElement>;
export type BreadcrumbItemProps<As extends NativeElementTag = 'li'> =
  | NativeBreadcrumbProps<'li', BreadcrumbPartOptions, As>
  | ChildBreadcrumbProps<'li', BreadcrumbPartOptions, HTMLLIElement>;
export type BreadcrumbLinkProps<As extends NativeElementTag = 'a'> =
  | NativeBreadcrumbProps<'a', BreadcrumbPartOptions, As>
  | ChildBreadcrumbProps<'a', BreadcrumbPartOptions, HTMLAnchorElement>;
export type BreadcrumbCurrentLinkProps<As extends NativeElementTag = 'span'> =
  | NativeBreadcrumbProps<'span', BreadcrumbPartOptions, As>
  | ChildBreadcrumbProps<'span', BreadcrumbPartOptions, HTMLSpanElement>;
export type BreadcrumbSeparatorProps<As extends NativeElementTag = 'li'> =
  | NativeBreadcrumbProps<'li', BreadcrumbPartOptions, As>
  | ChildBreadcrumbProps<'li', BreadcrumbPartOptions, HTMLLIElement>;
export type BreadcrumbEllipsisProps<As extends NativeElementTag = 'li'> =
  | NativeBreadcrumbProps<'li', BreadcrumbPartOptions, As>
  | ChildBreadcrumbProps<'li', BreadcrumbPartOptions, HTMLLIElement>;

export type BreadcrumbRootRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof BreadcrumbRootBaseProps
> &
  BreadcrumbRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export type BreadcrumbPartRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof BreadcrumbPartOptions
> &
  BreadcrumbPartOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface BreadcrumbPropsProviderProps {
  value: BreadcrumbRootBaseProps | Accessor<BreadcrumbRootBaseProps>;
  children: JSX.Element;
}

const BreadcrumbPropsContext = createOptionalContext<Accessor<BreadcrumbRootBaseProps>>();

/** Supply reactive choice defaults to descendant Breadcrumb roots. */
export function BreadcrumbPropsProvider(props: BreadcrumbPropsProviderProps): JSX.Element {
  /** Read static defaults or the current Solid accessor value. */
  function readDefaults(): BreadcrumbRootBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }
  return <BreadcrumbPropsContext value={readDefaults}>{props.children}</BreadcrumbPropsContext>;
}

/** Give instance root props precedence over inherited Breadcrumb defaults. */
export function useBreadcrumbRootProps(
  instance: BreadcrumbRootRuntimeProps,
): BreadcrumbRootRuntimeProps {
  const inherited = useOptionalContext(BreadcrumbPropsContext);
  return mergeProps(
    /** Follow provider changes without replacing the navigation node. */
    () => inherited?.() ?? {},
    instance,
  );
}
