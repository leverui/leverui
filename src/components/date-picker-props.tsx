import type { UsePresenceProps } from '../primitives/components/presence';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveCompositionProps,
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { DatePickerAppearance } from './date-picker-appearance';
import type { UseDatePickerProps, UseDatePickerReturn } from './date-picker-machine';
import type {
  DatePickerRuntimeProviderProps,
  DatePickerRuntimeRootProps,
} from './date-picker-runtime-props';
import { mergeRecipeProps } from './recipe-props-merge';

type DatePickerMachineProps = UseDatePickerProps & UsePresenceProps;

export type DatePickerRootBaseProps = DatePickerMachineProps &
  DatePickerAppearance &
  PrimitiveCompositionProps<'div'>;
export type DatePickerRootProviderBaseProps = DatePickerAppearance &
  UsePresenceProps &
  PrimitiveCompositionProps<'div'> & { value: UseDatePickerReturn };
export type DatePickerRootProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<
    'div',
    DatePickerRootBaseProps & NativeHtmlAliases & { className?: string },
    As
  >;
export type DatePickerRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<
    'div',
    { value: UseDatePickerReturn } & UsePresenceProps &
      DatePickerAppearance &
      NativeHtmlAliases & { className?: string },
    As
  >;

export interface DatePickerPropsProviderProps {
  value: Partial<DatePickerRootBaseProps> | Accessor<Partial<DatePickerRootBaseProps>>;
  children: JSX.Element;
}

const DatePickerPropsContext = createOptionalContext<Accessor<object>>();

/** Supply reactive machine and appearance defaults to descendant roots. */
export function DatePickerPropsProvider(props: DatePickerPropsProviderProps): JSX.Element {
  /** Read defaults without creating a date machine. */
  function readDefaults(): object {
    return typeof props.value === 'function' ? props.value() : props.value;
  }
  return <DatePickerPropsContext value={readDefaults}>{props.children}</DatePickerPropsContext>;
}

/** Merge inherited defaults before the primitive constructs a DatePicker machine. */
export function useDatePickerRootProps(
  instance: DatePickerRuntimeRootProps,
): DatePickerRuntimeRootProps {
  const inherited = useOptionalContext(DatePickerPropsContext);
  return mergeRecipeProps<DatePickerRuntimeRootProps>(
    /** Keep explicit machine props above reactive provider defaults. */
    () => (inherited?.() ?? {}) as Partial<DatePickerRuntimeRootProps>,
    instance,
  );
}

/** Inherit appearance without replacing the caller-owned date machine. */
export function useDatePickerRootProviderProps(
  instance: DatePickerRuntimeProviderProps,
): DatePickerRuntimeProviderProps {
  const inherited = useOptionalContext(DatePickerPropsContext);
  return mergeRecipeProps<DatePickerRuntimeProviderProps>(
    /** Forward appearance without overriding the external machine. */
    () => {
      const defaults = (inherited?.() ?? {}) as Partial<DatePickerAppearance>;
      return {
        size: defaults.size,
        variant: defaults.variant,
        hideOutsideDays: defaults.hideOutsideDays,
        colorPalette: defaults.colorPalette,
        unstyled: defaults.unstyled,
      } as Partial<DatePickerRuntimeProviderProps>;
    },
    instance,
  );
}
