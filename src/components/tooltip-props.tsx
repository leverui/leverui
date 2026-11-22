import type { TooltipRootProps as PrimitiveRootProps } from '../primitives/components/tooltip';
import type { UsePresenceProps } from '../primitives/components/presence';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { UseTooltipProps, UseTooltipReturn } from './tooltip-machine';

type AppearanceProps = { unstyled?: boolean };
type PresenceProps = Pick<PrimitiveRootProps, keyof UsePresenceProps>;

export type TooltipRootBaseProps = UseTooltipProps & PresenceProps & AppearanceProps;
export type TooltipRootProps = TooltipRootBaseProps & { children?: JSX.Element };
/** Keep the primitive's presence options while the supplied machine owns the open state. */
export type TooltipRootProviderBaseProps = PresenceProps &
  AppearanceProps & { value: UseTooltipReturn };
export type TooltipRootProviderProps = TooltipRootProviderBaseProps & {
  children?: JSX.Element;
};
export type TooltipDefaults = Partial<TooltipRootBaseProps>;

export interface TooltipPropsProviderProps {
  value: TooltipDefaults | Accessor<TooltipDefaults>;
  children: JSX.Element;
}

const TooltipPropsContext = createOptionalContext<Accessor<TooltipDefaults>>();
const providerDefaultNames = [
  'unstyled',
  'immediate',
  'lazyMount',
  'unmountOnExit',
  'onEnterComplete',
  'onExitComplete',
  'present',
  'skipAnimationOnMount',
] as const;

/** Retain appearance and presence defaults while an external accessor owns state. */
function providerDefaults(defaults: TooltipDefaults): Partial<TooltipRootProviderBaseProps> {
  const result: Record<string, unknown> = {};
  for (const name of providerDefaultNames) {
    if (name in defaults) result[name] = defaults[name];
  }
  return result as Partial<TooltipRootProviderBaseProps>;
}

/** Supply reactive defaults to Tooltip roots in this subtree. */
export function TooltipPropsProvider(props: TooltipPropsProviderProps): JSX.Element {
  /** Read static defaults or their current accessor value. */
  function readDefaults(): TooltipDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <TooltipPropsContext value={readDefaults}>{props.children}</TooltipPropsContext>;
}

/** Give explicit instance props precedence over inherited defaults. */
export function useTooltipRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(TooltipPropsContext);
  return mergeProps(
    /** Follow changing defaults without replacing the primitive's state machine. */
    () => (inherited?.() ?? {}) as Partial<Props>,
    instance,
  ) as Props;
}

/** Keep machine defaults off a caller-owned Tooltip accessor. */
export function useTooltipRootProviderProps(
  instance: Omit<TooltipRootProviderProps, 'children'>,
): Omit<TooltipRootProviderProps, 'children'> {
  const inherited = useOptionalContext(TooltipPropsContext);
  return mergeProps(
    /** Inherit only appearance and presence props around external state. */
    () => providerDefaults(inherited?.() ?? {}),
    instance,
  ) as Omit<TooltipRootProviderProps, 'children'>;
}
