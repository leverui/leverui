import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { CollapsibleAppearance } from './collapsible-appearance';
import type { UseCollapsibleProps, UseCollapsibleReturn } from './collapsible-machine';

export type CollapsibleRootProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', UseCollapsibleProps & CollapsibleAppearance, As>;
export type CollapsibleRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', { value: UseCollapsibleReturn } & CollapsibleAppearance, As>;

type CollapsibleDefaults = Partial<CollapsibleRootProps>;

export interface CollapsiblePropsProviderProps {
  value: CollapsibleDefaults | Accessor<CollapsibleDefaults>;
  children: JSX.Element;
}

const CollapsiblePropsContext = createOptionalContext<Accessor<CollapsibleDefaults>>();
const machineDefaultNames = new Set<keyof UseCollapsibleProps>([
  'collapsedHeight',
  'collapsedWidth',
  'defaultOpen',
  'disabled',
  'ids',
  'lazyMount',
  'onExitComplete',
  'onOpenChange',
  'open',
  'unmountOnExit',
]);

/** Keep native and appearance defaults while a caller owns the state machine. */
function rootProviderDefaults(defaults: CollapsibleDefaults): CollapsibleDefaults {
  const inherited = { ...defaults };
  for (const name of machineDefaultNames) delete inherited[name];
  return inherited;
}

/** Supply reactive defaults to descendant Collapsible roots. */
export function CollapsiblePropsProvider(props: CollapsiblePropsProviderProps): JSX.Element {
  /** Read current defaults without owning any descendant state. */
  function readDefaults(): CollapsibleDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <CollapsiblePropsContext value={readDefaults}>{props.children}</CollapsiblePropsContext>;
}

/** Merge inherited defaults before a machine-owned root creates its state. */
export function useCollapsibleRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(CollapsiblePropsContext);
  return mergeProps(
    /** Track provider changes while instance props retain precedence. */
    () => inherited?.() ?? {},
    instance,
  ) as Props;
}

/** Apply inherited native defaults without replacing a caller-owned machine. */
export function useCollapsibleRootProviderProps<
  Props extends CollapsibleAppearance & { value: UseCollapsibleReturn },
>(instance: Props): Props {
  const inherited = useOptionalContext(CollapsiblePropsContext);
  return mergeProps(
    /** Exclude machine props already supplied through the value accessor. */
    () => rootProviderDefaults(inherited?.() ?? {}),
    instance,
  ) as Props;
}
