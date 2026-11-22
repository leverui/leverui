import { props as pinInputMachineKeys } from '@zag-js/pin-input';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import { omit } from '../utils/omit';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { PinInputAppearance } from './pin-input-appearance';
import type { UsePinInputProps, UsePinInputReturn } from './pin-input-machine';
import { mergeRecipeProps } from './recipe-props-merge';
import type {
  PinInputRuntimeProviderProps,
  PinInputRuntimeRootProps,
} from './pin-input-runtime-props';

export type PinInputRootBaseProps = UsePinInputProps & PinInputAppearance;
export type PinInputRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  PinInputRootBaseProps & NativeHtmlAliases,
  As
>;
export type PinInputRootProviderBaseProps = PinInputAppearance & { value: UsePinInputReturn };
export type PinInputRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', PinInputRootProviderBaseProps & NativeHtmlAliases, As>;

type PinInputDefaults = Partial<PinInputRootBaseProps>;

export interface PinInputPropsProviderProps {
  value: PinInputDefaults | Accessor<PinInputDefaults>;
  children: JSX.Element;
}

const PinInputPropsContext = createOptionalContext<Accessor<PinInputDefaults>>();

/** Supply reactive defaults to nested Pin Input roots. */
export function PinInputPropsProvider(props: PinInputPropsProviderProps): JSX.Element {
  /** Read the current defaults object or its Solid accessor. */
  function readDefaults(): PinInputDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <PinInputPropsContext value={readDefaults}>{props.children}</PinInputPropsContext>;
}

/** Apply inherited machine and appearance defaults before explicit root props. */
export function usePinInputRootProps(instance: PinInputRuntimeRootProps): PinInputRuntimeRootProps {
  const inherited = useOptionalContext(PinInputPropsContext);
  return mergeRecipeProps<PinInputRuntimeRootProps>(
    /** Follow defaults while the root's explicit values retain precedence. */
    () => inherited?.() ?? {},
    instance,
  );
}

/** Apply only presentation defaults to a caller-owned Pin Input machine. */
export function usePinInputRootProviderProps(
  instance: PinInputRuntimeProviderProps,
): PinInputRuntimeProviderProps {
  const inherited = useOptionalContext(PinInputPropsContext);
  return mergeRecipeProps<PinInputRuntimeProviderProps>(
    /** Keep machine defaults off the external store's native root element. */
    () => omit(inherited?.() ?? {}, pinInputMachineKeys),
    instance,
  );
}
