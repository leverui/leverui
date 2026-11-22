import type { HoverCardRootProps as PrimitiveRootProps } from '../primitives/components/hover-card';
import type { UsePresenceProps } from '../primitives/components/presence';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { HoverCardAppearance } from './hover-card-appearance';
import type { UseHoverCardProps, UseHoverCardReturn } from './hover-card-machine';

type PresenceProps = Pick<PrimitiveRootProps, keyof UsePresenceProps>;

export type HoverCardRootBaseProps = UseHoverCardProps & PresenceProps & HoverCardAppearance;
export type HoverCardRootProps = HoverCardRootBaseProps & { children?: JSX.Element };
/** Keep the primitive's presence options while the supplied machine owns the open state. */
export type HoverCardRootProviderBaseProps = Omit<PresenceProps, 'present'> &
  HoverCardAppearance & { value: UseHoverCardReturn };
export type HoverCardRootProviderProps = HoverCardRootProviderBaseProps & {
  children?: JSX.Element;
};
export type HoverCardDefaults = Partial<HoverCardRootBaseProps>;

export interface HoverCardPropsProviderProps {
  value: HoverCardDefaults | Accessor<HoverCardDefaults>;
  children: JSX.Element;
}

const HoverCardPropsContext = createOptionalContext<Accessor<HoverCardDefaults>>();
const providerDefaultNames = [
  'size',
  'unstyled',
  'lazyMount',
  'unmountOnExit',
  'onExitComplete',
  'skipAnimationOnMount',
] as const;

/** Retain appearance and presence defaults while an external accessor owns state. */
function providerDefaults(defaults: HoverCardDefaults): Partial<HoverCardRootProviderBaseProps> {
  const result: Record<string, unknown> = {};
  for (const name of providerDefaultNames) {
    if (name in defaults) result[name] = defaults[name];
  }
  return result as Partial<HoverCardRootProviderBaseProps>;
}

/** Supply reactive defaults to HoverCard roots in this subtree. */
export function HoverCardPropsProvider(props: HoverCardPropsProviderProps): JSX.Element {
  /** Read static defaults or their current accessor value. */
  function readDefaults(): HoverCardDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <HoverCardPropsContext value={readDefaults}>{props.children}</HoverCardPropsContext>;
}

/** Give explicit instance props precedence over inherited defaults. */
export function useHoverCardRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(HoverCardPropsContext);
  return mergeProps(
    /** Follow changing defaults without replacing the primitive's state machine. */
    () => (inherited?.() ?? {}) as Partial<Props>,
    instance,
  ) as Props;
}

/** Keep machine defaults off a caller-owned HoverCard accessor. */
export function useHoverCardRootProviderProps(
  instance: Omit<HoverCardRootProviderProps, 'children'>,
): Omit<HoverCardRootProviderProps, 'children'> {
  const inherited = useOptionalContext(HoverCardPropsContext);
  return mergeProps(
    /** Inherit only appearance and presence props around external state. */
    () => providerDefaults(inherited?.() ?? {}),
    instance,
  ) as Omit<HoverCardRootProviderProps, 'children'>;
}
