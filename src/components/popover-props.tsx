import type { PopoverRootProps as PrimitiveRootProps } from '../primitives/components/popover';
import type { UsePresenceProps } from '../primitives/components/presence';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { PopoverAppearance } from './popover-appearance';
import type { UsePopoverProps, UsePopoverReturn } from './popover-machine';

type PresenceProps = Pick<PrimitiveRootProps, keyof UsePresenceProps>;

export type PopoverRootBaseProps = UsePopoverProps & PresenceProps & PopoverAppearance;
export type PopoverRootProps = PopoverRootBaseProps & { children?: JSX.Element };
/** Keep the primitive's presence options while the supplied machine owns the open state. */
export type PopoverRootProviderBaseProps = PresenceProps &
  PopoverAppearance & { value: UsePopoverReturn };
export type PopoverRootProviderProps = PopoverRootProviderBaseProps & {
  children?: JSX.Element;
};
export type PopoverDefaults = Partial<PopoverRootBaseProps>;

export interface PopoverPropsProviderProps {
  value: PopoverDefaults | Accessor<PopoverDefaults>;
  children: JSX.Element;
}

const PopoverPropsContext = createOptionalContext<Accessor<PopoverDefaults>>();
const providerDefaultNames = [
  'size',
  'unstyled',
  'immediate',
  'lazyMount',
  'unmountOnExit',
  'onEnterComplete',
  'onExitComplete',
  'present',
  'skipAnimationOnMount',
] as const satisfies ReadonlyArray<keyof PopoverDefaults>;

/** Retain appearance and presence defaults while an external accessor owns state. */
function providerDefaults(defaults: PopoverDefaults): Partial<PopoverRootProviderBaseProps> {
  const result: Record<string, unknown> = {};
  for (const name of providerDefaultNames) {
    if (name in defaults) result[name] = defaults[name];
  }
  return result as Partial<PopoverRootProviderBaseProps>;
}

/** Supply reactive defaults to Popover roots in this subtree. */
export function PopoverPropsProvider(props: PopoverPropsProviderProps): JSX.Element {
  /** Read static defaults or their current accessor value. */
  function readDefaults(): PopoverDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <PopoverPropsContext value={readDefaults}>{props.children}</PopoverPropsContext>;
}

/** Give explicit instance props precedence over inherited defaults. */
export function usePopoverRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(PopoverPropsContext);
  return mergeProps(
    /** Follow changing defaults without replacing the primitive's state machine. */
    () => (inherited?.() ?? {}) as Partial<Props>,
    instance,
  ) as Props;
}

/** Keep machine defaults off a caller-owned Popover accessor. */
export function usePopoverRootProviderProps(
  instance: Omit<PopoverRootProviderProps, 'children'>,
): Omit<PopoverRootProviderProps, 'children'> {
  const inherited = useOptionalContext(PopoverPropsContext);
  return mergeProps(
    /** Inherit only appearance and presence props around external state. */
    () => providerDefaults(inherited?.() ?? {}),
    instance,
  ) as Omit<PopoverRootProviderProps, 'children'>;
}
