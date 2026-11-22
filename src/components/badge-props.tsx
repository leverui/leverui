import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { NativeElementTag } from './native-element-props';
import type { ResponsiveBadgeSize } from './badge-size';

export type BadgeVariant = 'solid' | 'subtle' | 'outline' | 'surface' | 'plain';

export interface BadgeBaseProps {
  /** Select an authored size at ordinary breakpoints. */
  size?: ResponsiveBadgeSize | undefined;
  /** Choose the palette treatment. */
  variant?: BadgeVariant | undefined;
  /** Select a built-in or consumer-defined color palette. */
  colorPalette?: string | undefined;
  /** Suppress the default Badge appearance. */
  unstyled?: boolean | undefined;
}

export type BadgeRootProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | keyof BadgeBaseProps> &
  BadgeBaseProps & {
    as?: NativeElementTag;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export type BadgeDefaults = Partial<Omit<BadgeRootProps, 'as' | 'asChild' | 'children' | 'ref'>>;

export interface BadgePropsProviderProps {
  value: BadgeDefaults | Accessor<BadgeDefaults>;
  children: JSX.Element;
}

const BadgeContext = createOptionalContext<Accessor<BadgeDefaults>>();

/** Supply reactive Badge appearance and native attribute defaults to descendants. */
export function BadgePropsProvider(props: BadgePropsProviderProps): JSX.Element {
  /** Read the current provider value in each consumer's tracked scope. */
  function readDefaults(): BadgeDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <BadgeContext value={readDefaults}>{props.children}</BadgeContext>;
}

/** Merge the nearest Badge defaults with live instance props. */
export function useBadgeProps(instance: BadgeRootProps): BadgeRootProps {
  const inherited = useOptionalContext(BadgeContext);
  return mergeProps(
    /** Re-evaluate provider defaults when a Badge reads a property. */
    () => inherited?.() ?? {},
    instance,
  );
}
