import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { StepsAppearance } from './steps-appearance';
import type { UseStepsProps, UseStepsReturn } from './steps-machine';
import { mergeRecipeProps } from './recipe-props-merge';

/** Root props; `items` may come from a `StepsPropsProvider` instead of the root. */
export type StepsRootBaseProps = Omit<UseStepsProps, 'items'> &
  Partial<Pick<UseStepsProps, 'items'>> &
  StepsAppearance;
export type StepsRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  StepsRootBaseProps,
  As
>;
export type StepsRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', StepsAppearance & { value: UseStepsReturn }, As>;

export interface StepsPropsProviderProps {
  value: Partial<StepsRootBaseProps> | Accessor<Partial<StepsRootBaseProps>>;
  children: JSX.Element;
}

const StepsPropsContext = createOptionalContext<Accessor<Partial<StepsRootBaseProps>>>();
const machinePropNames = [
  'completedValues',
  'defaultCompletedValues',
  'defaultValue',
  'id',
  'ids',
  'items',
  'linear',
  'onComplete',
  'onCompletedChange',
  'onNavigationBlocked',
  'onValueChange',
  'orientation',
  'translations',
  'value',
] as const satisfies readonly (keyof UseStepsProps)[];

/** Defaults left once owned-machine props are removed. */
type ProviderDefaults = Omit<Partial<StepsRootBaseProps>, (typeof machinePropNames)[number]>;

/** Keep machine defaults off a caller-owned Steps accessor. */
function providerDefaults(defaults: Partial<StepsRootBaseProps>): ProviderDefaults {
  const inherited = { ...defaults };
  for (const name of machinePropNames) delete inherited[name];
  return inherited;
}

/** Supply reactive machine and appearance defaults to nested Steps roots. */
export function StepsPropsProvider(props: StepsPropsProviderProps): JSX.Element {
  /** Read the caller's static value or current Solid accessor. */
  function readDefaults(): Partial<StepsRootBaseProps> {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <StepsPropsContext value={readDefaults}>{props.children}</StepsPropsContext>;
}

/** Apply provider defaults before creating an owned Steps machine. */
export function useStepsRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(StepsPropsContext);
  return mergeRecipeProps<Props>(
    /** Preserve current provider defaults until instance props replace them. */
    () => (inherited?.() ?? {}) as Partial<Props>,
    instance,
  );
}

/** Inherit presentation without replacing a supplied Steps machine. */
export function useStepsRootProviderProps<
  Props extends StepsAppearance & { value: UseStepsReturn },
>(instance: Props): Props {
  const inherited = useOptionalContext(StepsPropsContext);
  return mergeRecipeProps<Props>(
    /** Drop state defaults because the caller already owns state. */
    () => providerDefaults(inherited?.() ?? {}) as Partial<Props>,
    instance,
  );
}
