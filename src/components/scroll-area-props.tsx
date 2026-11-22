import type { PolymorphicProps } from '../primitives/components/factory';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveCompositionProps,
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { ScrollAreaAppearance } from './scroll-area-choices';
import type { UseScrollAreaProps, UseScrollAreaReturn } from './scroll-area-machine';
import type { ClassValue } from '../utils/class-value';

export type ScrollAreaRootBaseProps = UseScrollAreaProps &
  ScrollAreaAppearance &
  PrimitiveCompositionProps<'div'>;
export type ScrollAreaRootProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', ScrollAreaRootBaseProps & NativeHtmlAliases, As>;
export type ScrollAreaRootProviderBaseProps = ScrollAreaAppearance &
  PrimitiveCompositionProps<'div'> & { value: UseScrollAreaReturn };
export type ScrollAreaRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', ScrollAreaRootProviderBaseProps & NativeHtmlAliases, As>;

export type ScrollAreaRuntimeRootProps = UseScrollAreaProps &
  ScrollAreaAppearance &
  NativeHtmlAliases & {
    class?: ClassValue | undefined;
    style?: JSX.CSSProperties | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
export type ScrollAreaRuntimeProviderProps = Omit<
  ScrollAreaRuntimeRootProps,
  keyof UseScrollAreaProps | 'value'
> & { value: UseScrollAreaReturn };

type ScrollAreaDefaults = Partial<Omit<ScrollAreaRootBaseProps, 'children' | 'ref' | 'asChild'>> &
  JSX.HTMLAttributes<HTMLElement>;

export interface ScrollAreaPropsProviderProps {
  value: ScrollAreaDefaults | Accessor<ScrollAreaDefaults>;
  children: JSX.Element;
}

const ScrollAreaPropsContext = createOptionalContext<Accessor<ScrollAreaDefaults>>();

/** Supply reactive machine and appearance defaults to descendant roots. */
export function ScrollAreaPropsProvider(props: ScrollAreaPropsProviderProps): JSX.Element {
  /** Read changing defaults without owning a descendant machine. */
  function readDefaults(): ScrollAreaDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <ScrollAreaPropsContext value={readDefaults}>{props.children}</ScrollAreaPropsContext>;
}

/** Merge inherited defaults before the primitive creates one Scroll Area machine. */
export function useScrollAreaRootProps(
  instance: ScrollAreaRuntimeRootProps,
): ScrollAreaRuntimeRootProps {
  const inherited = useOptionalContext(ScrollAreaPropsContext);
  return mergeProps(
    /** Keep explicit root values ahead of changing provider defaults. */
    () => inherited?.() ?? {},
    instance,
  ) as ScrollAreaRuntimeRootProps;
}

/** Inherit presentation without passing machine defaults to a supplied store. */
export function useScrollAreaRootProviderProps(
  instance: ScrollAreaRuntimeProviderProps,
): ScrollAreaRuntimeProviderProps {
  const inherited = useOptionalContext(ScrollAreaPropsContext);
  return mergeProps(
    /** Keep the primitive's supplied machine authoritative over its own settings. */
    () => {
      const defaults = inherited?.() ?? {};
      return {
        size: defaults.size,
        variant: defaults.variant,
        unstyled: defaults.unstyled,
        class: defaults.class,
        className: defaults.className,
        style: defaults.style,
      };
    },
    instance,
  ) as ScrollAreaRuntimeProviderProps;
}
