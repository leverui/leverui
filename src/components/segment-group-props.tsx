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
import type { SegmentGroupAppearance } from './segment-group-choices';
import type { UseSegmentGroupProps, UseSegmentGroupReturn } from './segment-group-machine';
import type { ClassValue } from '../utils/class-value';

export type SegmentGroupRootBaseProps = UseSegmentGroupProps &
  SegmentGroupAppearance &
  PrimitiveCompositionProps<'div'>;
export type SegmentGroupRootProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', SegmentGroupRootBaseProps & NativeHtmlAliases, As>;
export type SegmentGroupRootProviderBaseProps = SegmentGroupAppearance &
  PrimitiveCompositionProps<'div'> & { value: UseSegmentGroupReturn };
export type SegmentGroupRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', SegmentGroupRootProviderBaseProps & NativeHtmlAliases, As>;

export type SegmentGroupRuntimeRootProps = UseSegmentGroupProps &
  SegmentGroupAppearance &
  NativeHtmlAliases & {
    class?: ClassValue | undefined;
    style?: JSX.CSSProperties | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
export type SegmentGroupRuntimeProviderProps = Omit<
  SegmentGroupRuntimeRootProps,
  keyof UseSegmentGroupProps | 'value'
> & { value: UseSegmentGroupReturn };

type SegmentGroupDefaults = Partial<
  Omit<SegmentGroupRootBaseProps, 'children' | 'ref' | 'asChild'>
> &
  Omit<JSX.HTMLAttributes<HTMLElement>, 'children'>;

export interface SegmentGroupPropsProviderProps {
  value: SegmentGroupDefaults | Accessor<SegmentGroupDefaults>;
  children: JSX.Element;
}

const SegmentGroupPropsContext = createOptionalContext<Accessor<SegmentGroupDefaults>>();

/** Supply reactive machine and appearance defaults to descendant roots. */
export function SegmentGroupPropsProvider(props: SegmentGroupPropsProviderProps): JSX.Element {
  /** Read changing defaults without owning a descendant machine. */
  function readDefaults(): SegmentGroupDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <SegmentGroupPropsContext value={readDefaults}>{props.children}</SegmentGroupPropsContext>;
}

/** Merge inherited defaults before the primitive creates one radio machine. */
export function useSegmentGroupRootProps(
  instance: SegmentGroupRuntimeRootProps,
): SegmentGroupRuntimeRootProps {
  const inherited = useOptionalContext(SegmentGroupPropsContext);
  return mergeProps(
    /** Keep explicit root values ahead of changing provider defaults. */
    () => inherited?.() ?? {},
    instance,
  ) as SegmentGroupRuntimeRootProps;
}

/** Inherit presentation without overriding a caller-owned radio machine. */
export function useSegmentGroupRootProviderProps(
  instance: SegmentGroupRuntimeProviderProps,
): SegmentGroupRuntimeProviderProps {
  const inherited = useOptionalContext(SegmentGroupPropsContext);
  return mergeProps(
    /** Keep the supplied machine authoritative over selection and orientation. */
    () => {
      const defaults = inherited?.() ?? {};
      return {
        size: defaults.size,
        unstyled: defaults.unstyled,
        class: defaults.class,
        className: defaults.className,
        style: defaults.style,
      };
    },
    instance,
  ) as SegmentGroupRuntimeProviderProps;
}
