import type { PopoverRootProps as PrimitivePopoverRootProps } from '../primitives/components/popover';
import type { UsePresenceProps } from '../primitives/components/presence';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { ActionBarAppearance } from './action-bar-appearance';
import type { UseActionBarProps, UseActionBarReturn } from './action-bar-machine';

type ActionBarPresenceProps = Pick<PrimitivePopoverRootProps, keyof UsePresenceProps>;
type ActionBarRootBaseProps = UseActionBarProps & ActionBarPresenceProps & ActionBarAppearance;

export type ActionBarRootProps = Omit<ActionBarRootBaseProps, 'positioning'> & {
  children: JSX.Element;
};
export type ActionBarRootProviderProps = ActionBarPresenceProps &
  ActionBarAppearance & { value: UseActionBarReturn; children?: JSX.Element };

type ActionBarDefaults = Partial<ActionBarRootBaseProps>;

export interface ActionBarPropsProviderProps {
  value: ActionBarDefaults | Accessor<ActionBarDefaults>;
  children: JSX.Element;
}

const ActionBarPropsContext = createOptionalContext<Accessor<ActionBarDefaults>>();
const machineDefaultNames = new Set<keyof UseActionBarProps>([
  'autoFocus',
  'closeOnEscape',
  'closeOnInteractOutside',
  'defaultOpen',
  'finalFocusEl',
  'id',
  'ids',
  'initialFocusEl',
  'modal',
  'onEscapeKeyDown',
  'onFocusOutside',
  'onInteractOutside',
  'onOpenChange',
  'onPointerDownOutside',
  'onRequestDismiss',
  'open',
  'persistentElements',
  'positioning',
  'restoreFocus',
  'translations',
  'triggerValue',
  'defaultTriggerValue',
  'onTriggerValueChange',
]);

/** Retain appearance and presence defaults without replacing a caller-owned machine. */
function rootProviderDefaults(defaults: ActionBarDefaults): ActionBarDefaults {
  const inherited = { ...defaults };
  for (const name of machineDefaultNames) delete inherited[name];
  return inherited;
}

/** Supply reactive machine and appearance defaults to nested Action Bars. */
export function ActionBarPropsProvider(props: ActionBarPropsProviderProps): JSX.Element {
  /** Read a static or reactive default record at the consumer boundary. */
  function readDefaults(): ActionBarDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <ActionBarPropsContext value={readDefaults}>{props.children}</ActionBarPropsContext>;
}

/** Give an Action Bar's own props precedence over inherited root defaults. */
export function useActionBarRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(ActionBarPropsContext);
  return mergeProps(
    /** Follow provider changes without replacing the primitive machine. */
    () => inherited?.() ?? {},
    instance,
  ) as Props;
}

/** Inherit appearance and presence defaults around a caller-owned Popover machine. */
export function useActionBarRootProviderProps(
  instance: Omit<ActionBarRootProviderProps, 'children'>,
): Omit<ActionBarRootProviderProps, 'children'> {
  const inherited = useOptionalContext(ActionBarPropsContext);
  return mergeProps(
    /** Keep state defaults off a machine already owned by the caller. */
    () => rootProviderDefaults(inherited?.() ?? {}),
    instance,
  ) as Omit<ActionBarRootProviderProps, 'children'>;
}
