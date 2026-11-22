import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { UseMarqueeProps, UseMarqueeReturn } from './marquee-machine';
import type { ClassValue } from '../utils/class-value';

export type MarqueeRootBaseProps = UseMarqueeProps & { unstyled?: boolean };
export type MarqueeRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  MarqueeRootBaseProps & NativeHtmlAliases,
  As
>;
export type MarqueeRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<
    'div',
    { value: UseMarqueeReturn; unstyled?: boolean } & NativeHtmlAliases,
    As
  >;

export type MarqueeRuntimeRootProps = UseMarqueeProps &
  NativeHtmlAliases & {
    unstyled?: boolean | undefined;
    class?: ClassValue | undefined;
    className?: string | undefined;
    style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
    value?: UseMarqueeReturn | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: MarqueeRootProps['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
export type MarqueeRuntimeProviderProps = MarqueeRuntimeRootProps & {
  value: UseMarqueeReturn;
};

type MarqueeRootDefaults = Partial<MarqueeRootBaseProps>;

export interface MarqueePropsProviderProps {
  value: MarqueeRootDefaults | Accessor<MarqueeRootDefaults>;
  children: JSX.Element;
}

const MarqueePropsContext = createOptionalContext<Accessor<MarqueeRootDefaults>>();

/** Supply reactive machine and unstyled defaults to nested Marquee roots. */
export function MarqueePropsProvider(props: MarqueePropsProviderProps): JSX.Element {
  /** Read static defaults or the caller's current Solid accessor. */
  function readDefaults(): MarqueeRootDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <MarqueePropsContext value={readDefaults}>{props.children}</MarqueePropsContext>;
}

/** Merge inherited defaults before a machine-owned Marquee root. */
export function useMarqueeRootProps(instance: MarqueeRuntimeRootProps): MarqueeRuntimeRootProps {
  const inherited = useOptionalContext(MarqueePropsContext);
  return mergeProps(
    /** Follow machine default changes without replacing the primitive's root. */
    () => inherited?.() ?? {},
    instance,
  ) as MarqueeRuntimeRootProps;
}

/** Inherit presentation without replacing a caller-owned Marquee machine. */
export function useMarqueeRootProviderProps(
  instance: MarqueeRuntimeProviderProps,
): MarqueeRuntimeProviderProps {
  const inherited = useOptionalContext(MarqueePropsContext);
  return mergeProps(
    /** Leave all machine settings on the external accessor. */
    () => ({ unstyled: inherited?.().unstyled }),
    instance,
  ) as MarqueeRuntimeProviderProps;
}
