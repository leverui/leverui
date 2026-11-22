import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveCompositionProps,
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { DateInputAppearance } from './date-input-appearance';
import type { UseDateInputProps, UseDateInputReturn } from './date-input-machine';
import { mergeRecipeProps } from './recipe-props-merge';
import type {
  DateInputRuntimeProviderProps,
  DateInputRuntimeRootProps,
} from './date-input-runtime-props';

export type DateInputRootBaseProps = UseDateInputProps &
  DateInputAppearance &
  PrimitiveCompositionProps<'div'>;
export type DateInputRootProviderBaseProps = DateInputAppearance &
  PrimitiveCompositionProps<'div'> & { value: UseDateInputReturn };
export type DateInputRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  UseDateInputProps & DateInputAppearance & NativeHtmlAliases & { className?: string },
  As
>;
export type DateInputRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<
    'div',
    { value: UseDateInputReturn } & DateInputAppearance &
      NativeHtmlAliases & { className?: string },
    As
  >;

export interface DateInputPropsProviderProps {
  value: Partial<DateInputRootBaseProps> | Accessor<Partial<DateInputRootBaseProps>>;
  children: JSX.Element;
}

const DateInputPropsContext = createOptionalContext<Accessor<Partial<DateInputRootBaseProps>>>();

/** Supply reactive date-machine and appearance defaults to descendant roots. */
export function DateInputPropsProvider(props: DateInputPropsProviderProps): JSX.Element {
  /** Read the current defaults without constructing a date machine. */
  function readDefaults(): Partial<DateInputRootBaseProps> {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <DateInputPropsContext value={readDefaults}>{props.children}</DateInputPropsContext>;
}

/** Apply inherited defaults before an owned DateInput machine starts. */
export function useDateInputRootProps(
  instance: DateInputRuntimeRootProps,
): DateInputRuntimeRootProps {
  const inherited = useOptionalContext(DateInputPropsContext);
  return mergeRecipeProps<DateInputRuntimeRootProps>(
    /** Keep explicit root settings above reactive provider defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}

/** Inherit appearance without replacing an externally owned date machine. */
export function useDateInputRootProviderProps(
  instance: DateInputRuntimeProviderProps,
): DateInputRuntimeProviderProps {
  const inherited = useOptionalContext(DateInputPropsContext);
  return mergeRecipeProps<DateInputRuntimeProviderProps>(
    /** Forward only appearance settings to the external machine's root. */
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
