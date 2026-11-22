import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import { mergeRecipeProps } from './recipe-props-merge';
import type { SwitchAppearance } from './switch-choices';
import type { UseSwitchProps, UseSwitchReturn } from './switch-machine';
import type { ClassValue } from '../utils/class-value';

export type SwitchRootBaseProps = UseSwitchProps & SwitchAppearance;
export type SwitchRootProps<As extends PrimitiveNativeTag = 'label'> = PrimitiveNativeElementProps<
  'label',
  SwitchRootBaseProps & NativeHtmlAliases,
  As
>;
export type SwitchRootProviderProps<As extends PrimitiveNativeTag = 'label'> =
  PrimitiveNativeElementProps<
    'label',
    SwitchAppearance & { value: UseSwitchReturn } & NativeHtmlAliases,
    As
  >;
export type SwitchRuntimeRootProps = SwitchRootBaseProps &
  NativeHtmlAliases & {
    class?: ClassValue | undefined;
    style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: SwitchRootProps['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
export type SwitchRuntimeProviderProps = Omit<
  SwitchRuntimeRootProps,
  keyof UseSwitchProps | 'value'
> & { value: UseSwitchReturn };
type SwitchRootDefaults = Partial<SwitchRootBaseProps>;

export interface SwitchPropsProviderProps {
  value: SwitchRootDefaults | Accessor<SwitchRootDefaults>;
  children: JSX.Element;
}

const SwitchPropsContext = createOptionalContext<Accessor<SwitchRootDefaults>>();

/** Supply reactive machine and appearance defaults to nested Switch roots. */
export function SwitchPropsProvider(props: SwitchPropsProviderProps): JSX.Element {
  /** Read current defaults without taking ownership of a descendant machine. */
  function readDefaults(): SwitchRootDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <SwitchPropsContext value={readDefaults}>{props.children}</SwitchPropsContext>;
}

/** Merge inherited defaults before one machine-owned Switch root. */
export function useSwitchRootProps(instance: SwitchRuntimeRootProps): SwitchRuntimeRootProps {
  const inherited = useOptionalContext(SwitchPropsContext);
  return mergeRecipeProps<SwitchRuntimeRootProps>(
    /** Follow the provider accessor while retaining explicit instance props. */
    () => inherited?.() ?? {},
    instance,
  );
}

/** Inherit appearance without replacing a caller-owned Switch machine. */
export function useSwitchRootProviderProps(
  instance: SwitchRuntimeProviderProps,
): SwitchRuntimeProviderProps {
  const inherited = useOptionalContext(SwitchPropsContext);
  return mergeRecipeProps<SwitchRuntimeProviderProps>(
    /** Keep machine and form defaults off the externally owned store. */
    () => {
      const defaults = inherited?.();
      return {
        size: defaults?.size,
        variant: defaults?.variant,
        colorPalette: defaults?.colorPalette,
        unstyled: defaults?.unstyled,
      };
    },
    instance,
  );
}
