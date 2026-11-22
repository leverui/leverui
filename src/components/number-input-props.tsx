import { props as numberInputMachineKeys } from '@zag-js/number-input';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import { omit } from '../utils/omit';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { NumberInputAppearance } from './number-input-appearance';
import type { UseNumberInputProps, UseNumberInputReturn } from './number-input-machine';
import type {
  NumberInputRuntimeProviderProps,
  NumberInputRuntimeRootProps,
} from './number-input-runtime-props';

export type NumberInputRootBaseProps = UseNumberInputProps &
  NumberInputAppearance & {
    className?: string | undefined;
  };
export type NumberInputRootProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', NumberInputRootBaseProps, As>;
export type NumberInputRootProviderBaseProps = NumberInputAppearance & {
  value: UseNumberInputReturn;
  className?: string | undefined;
};
export type NumberInputRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', NumberInputRootProviderBaseProps, As>;

type NumberInputDefaults = Partial<NumberInputRootBaseProps>;

export interface NumberInputPropsProviderProps {
  value: NumberInputDefaults | Accessor<NumberInputDefaults>;
  children: JSX.Element;
}

const NumberInputPropsContext = createOptionalContext<Accessor<NumberInputDefaults>>();

/** Supply reactive defaults to nested Number Input roots. */
export function NumberInputPropsProvider(props: NumberInputPropsProviderProps): JSX.Element {
  /** Read the current defaults object or its Solid accessor. */
  function readDefaults(): NumberInputDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <NumberInputPropsContext value={readDefaults}>{props.children}</NumberInputPropsContext>;
}

/** Apply inherited machine and appearance defaults before explicit root props. */
export function useNumberInputRootProps(
  instance: NumberInputRuntimeRootProps,
): NumberInputRuntimeRootProps {
  const inherited = useOptionalContext(NumberInputPropsContext);
  return mergeProps(
    /** Follow defaults while the root's explicit values retain precedence. */
    () => inherited?.() ?? {},
    instance,
  ) as NumberInputRuntimeRootProps;
}

/** Apply only presentation defaults to a caller-owned Number Input machine. */
export function useNumberInputRootProviderProps(
  instance: NumberInputRuntimeProviderProps,
): NumberInputRuntimeProviderProps {
  const inherited = useOptionalContext(NumberInputPropsContext);
  return mergeProps(
    /** Keep machine defaults off the external store's native root element. */
    () => omit(inherited?.() ?? {}, numberInputMachineKeys),
    instance,
  ) as NumberInputRuntimeProviderProps;
}
