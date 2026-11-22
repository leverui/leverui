import type {
  CollapsibleContentProps,
  CollapsiblePropsProviderProps,
  CollapsibleRootProps,
  CollapsibleRootProviderProps,
  CollapsibleTriggerProps,
  UseCollapsibleProps,
} from '@leverui/components';

type Assert<Condition extends true> = Condition;
type RootControls =
  | 'collapsedHeight'
  | 'collapsedWidth'
  | 'defaultOpen'
  | 'disabled'
  | 'lazyMount'
  | 'onExitComplete'
  | 'onOpenChange'
  | 'open'
  | 'unmountOnExit';
type ProviderDefaults = Exclude<CollapsiblePropsProviderProps['value'], () => unknown>;

/** Keep the primitive disclosure controls available on the installed root. */
export type RootBehaviorContract = Assert<
  RootControls extends keyof CollapsibleRootProps ? true : false
>;

/** Preserve the caller's machine accessor on RootProvider. */
export type ProviderValueContract = Assert<
  CollapsibleRootProviderProps['value'] extends () => object ? true : false
>;

/** Allow inherited behavior defaults on machine-owned roots. */
export type DefaultsContract = Assert<
  'collapsedHeight' extends keyof ProviderDefaults ? true : false
>;

/** Export the same machine prop family used by the root. */
export type MachineContract = Assert<RootControls extends keyof UseCollapsibleProps ? true : false>;

/** Keep public slot props available in installed declarations. */
export type PartContract = Assert<
  'children' extends keyof CollapsibleTriggerProps & keyof CollapsibleContentProps ? true : false
>;
