import type { AccordionRootProps as PrimitiveAccordionRootProps } from '../primitives/components/accordion';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { AccordionAppearance } from './accordion-appearance';
import type { UseAccordionProps, UseAccordionReturn } from './accordion-machine';
import type {
  AccordionRuntimeProviderProps,
  AccordionRuntimeRootProps,
} from './accordion-runtime-props';

type AccordionRenderProps = Pick<PrimitiveAccordionRootProps, 'lazyMount' | 'unmountOnExit'>;
type AccordionBehaviorProps = UseAccordionProps & AccordionRenderProps;

export type AccordionRootBaseProps = AccordionBehaviorProps & AccordionAppearance;
export type AccordionRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  AccordionRootBaseProps,
  As
>;
export type AccordionRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<
    'div',
    { value: UseAccordionReturn } & AccordionRenderProps & AccordionAppearance,
    As
  >;

export interface AccordionPropsProviderProps {
  value: Partial<AccordionRootProps> | Accessor<Partial<AccordionRootProps>>;
  children: JSX.Element;
}

type AccordionDefaults = Partial<AccordionRootProps>;

const AccordionPropsContext = createOptionalContext<Accessor<AccordionDefaults>>();
const machineDefaultNames = new Set<keyof UseAccordionProps>([
  'collapsible',
  'defaultValue',
  'disabled',
  'id',
  'ids',
  'multiple',
  'onFocusChange',
  'onValueChange',
  'orientation',
  'value',
]);

/** Leave native, appearance, and render defaults for a caller-owned machine. */
function rootProviderDefaults(defaults: AccordionDefaults): AccordionDefaults {
  const inherited = { ...defaults };
  for (const name of machineDefaultNames) delete inherited[name];
  return inherited;
}

/** Supply reactive machine and appearance defaults to nested Accordion roots. */
export function AccordionPropsProvider(props: AccordionPropsProviderProps): JSX.Element {
  /** Read current defaults without owning a descendant machine. */
  function readDefaults(): AccordionDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <AccordionPropsContext value={readDefaults}>{props.children}</AccordionPropsContext>;
}

/** Merge inherited defaults before creating a machine-owned Accordion root. */
export function useAccordionRootProps(
  instance: AccordionRuntimeRootProps,
): AccordionRuntimeRootProps {
  const inherited = useOptionalContext(AccordionPropsContext);
  return mergeProps(
    /** Follow provider changes while instance props take precedence. */
    () => inherited?.() ?? {},
    instance,
  ) as AccordionRuntimeRootProps;
}

/** Inherit root defaults without replacing a caller-owned Accordion machine. */
export function useAccordionRootProviderProps(
  instance: AccordionRuntimeProviderProps,
): AccordionRuntimeProviderProps {
  const inherited = useOptionalContext(AccordionPropsContext);
  return mergeProps(
    /** Keep state defaults off a machine already owned by the caller. */
    () => rootProviderDefaults(inherited?.() ?? {}),
    instance,
  ) as AccordionRuntimeProviderProps;
}
