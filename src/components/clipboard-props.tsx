import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { ClipboardAppearance } from './clipboard-appearance';
import type { UseClipboardProps, UseClipboardReturn } from './clipboard-machine';

export type ClipboardRootBaseProps = UseClipboardProps & ClipboardAppearance;
export type ClipboardRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  ClipboardRootBaseProps,
  As
>;
export type ClipboardRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', { value: UseClipboardReturn } & ClipboardAppearance, As>;

type ClipboardDefaults = Partial<ClipboardRootProps>;

export interface ClipboardPropsProviderProps {
  value: ClipboardDefaults | Accessor<ClipboardDefaults>;
  children: JSX.Element;
}

const ClipboardPropsContext = createOptionalContext<Accessor<ClipboardDefaults>>();
const machineDefaultNames = new Set<keyof UseClipboardProps>([
  'defaultValue',
  'id',
  'ids',
  'onStatusChange',
  'onValueChange',
  'timeout',
  'translations',
  'value',
]);

/** Keep native and appearance defaults while a caller owns the machine. */
function rootProviderDefaults(defaults: ClipboardDefaults): ClipboardDefaults {
  const inherited = { ...defaults };
  for (const name of machineDefaultNames) delete inherited[name];
  return inherited;
}

/** Supply reactive defaults to descendant Clipboard roots. */
export function ClipboardPropsProvider(props: ClipboardPropsProviderProps): JSX.Element {
  /** Read the latest defaults without owning descendant machine state. */
  function readDefaults(): ClipboardDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <ClipboardPropsContext value={readDefaults}>{props.children}</ClipboardPropsContext>;
}

/** Merge inherited defaults before the primitive creates a Clipboard machine. */
export function useClipboardRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(ClipboardPropsContext);
  return mergeProps(
    /** Track defaults while instance props retain precedence. */
    () => inherited?.() ?? {},
    instance,
  ) as Props;
}

/** Apply inherited native defaults without replacing a caller-owned machine. */
export function useClipboardRootProviderProps<
  Props extends ClipboardAppearance & { value: UseClipboardReturn },
>(instance: Props): Props {
  const inherited = useOptionalContext(ClipboardPropsContext);
  return mergeProps(
    /** Exclude machine values supplied through the value accessor. */
    () => rootProviderDefaults(inherited?.() ?? {}),
    instance,
  ) as Props;
}
