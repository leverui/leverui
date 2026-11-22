import type { FloatingPanelRootProps as PrimitiveRootProps } from '../primitives/components/floating-panel';
import type { UsePresenceProps } from '../primitives/components/presence';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { floatingPanelProviderDefaults } from './floating-panel-defaults';
import type { UseFloatingPanelProps, UseFloatingPanelReturn } from './floating-panel-machine';
import { mergeRecipeProps } from './recipe-props-merge';

type PresenceProps = Pick<PrimitiveRootProps, keyof UsePresenceProps>;

export type FloatingPanelRootBaseProps = UseFloatingPanelProps &
  PresenceProps & { unstyled?: boolean };
export type FloatingPanelRootProps = FloatingPanelRootBaseProps & { children?: JSX.Element };
export type FloatingPanelRootProviderBaseProps = Omit<PresenceProps, 'present'> & {
  unstyled?: boolean;
  value: UseFloatingPanelReturn;
};
export type FloatingPanelRootProviderProps = FloatingPanelRootProviderBaseProps & {
  children?: JSX.Element;
};
export type FloatingPanelDefaults = Partial<FloatingPanelRootBaseProps>;

export interface FloatingPanelPropsProviderProps {
  value: FloatingPanelDefaults | Accessor<FloatingPanelDefaults>;
  children: JSX.Element;
}

const FloatingPanelPropsContext = createOptionalContext<Accessor<FloatingPanelDefaults>>();

/** Supply reactive defaults to Floating Panel roots in this subtree. */
export function FloatingPanelPropsProvider(props: FloatingPanelPropsProviderProps): JSX.Element {
  /** Read either static defaults or their current accessor value. */
  function readDefaults(): FloatingPanelDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return (
    <FloatingPanelPropsContext value={readDefaults}>{props.children}</FloatingPanelPropsContext>
  );
}

/** Give explicit props precedence over inherited Floating Panel defaults. */
export function useFloatingPanelRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(FloatingPanelPropsContext);
  return mergeRecipeProps<Props>(
    /** Follow changing defaults without remounting the primitive's state machine. */
    () => (inherited?.() ?? {}) as Partial<Props>,
    instance,
  );
}

/** Keep machine defaults off a caller-owned Floating Panel state accessor. */
export function useFloatingPanelRootProviderProps(
  instance: Omit<FloatingPanelRootProviderProps, 'children'>,
): Omit<FloatingPanelRootProviderProps, 'children'> {
  const inherited = useOptionalContext(FloatingPanelPropsContext);
  return mergeRecipeProps<Omit<FloatingPanelRootProviderProps, 'children'>>(
    /** Retain only appearance and presence defaults around external state. */
    () => floatingPanelProviderDefaults(inherited?.() ?? {}),
    instance,
  );
}
