import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { NativeElementTag } from './native-element-props';
import type { ResponsiveMarkVariant } from './mark-variant';

export interface MarkBaseProps {
  /** Choose an authored treatment at ordinary breakpoints. */
  variant?: ResponsiveMarkVariant | undefined;
  /** Select a built-in or consumer-defined palette. */
  colorPalette?: string | undefined;
  /** Suppress the authored Mark appearance. */
  unstyled?: boolean | undefined;
}

export type MarkRootProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | keyof MarkBaseProps> &
  MarkBaseProps & {
    as?: NativeElementTag;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Share native defaults while each instance owns its child renderer and ref. */
export type MarkDefaults = Partial<Omit<MarkRootProps, 'asChild' | 'children' | 'ref'>>;

export interface MarkPropsProviderProps {
  value: MarkDefaults | Accessor<MarkDefaults>;
  children: JSX.Element;
}

const MarkContext = createOptionalContext<Accessor<MarkDefaults>>();

/** Supply reactive Mark choices and native attributes to descendants. */
export function MarkPropsProvider(props: MarkPropsProviderProps): JSX.Element {
  /** Read the current provider defaults in each consumer's tracked scope. */
  function readDefaults(): MarkDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <MarkContext value={readDefaults}>{props.children}</MarkContext>;
}

/** Compose provider defaults with live instance props and classes. */
export function useMarkProps(instance: MarkRootProps): MarkRootProps {
  const inherited = useOptionalContext(MarkContext);
  return mergeProps(
    /** Re-read provider defaults when a Mark property changes. */
    () => inherited?.() ?? {},
    instance,
  );
}
