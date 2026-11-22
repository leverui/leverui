import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import { omit } from '../utils/omit';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { ProgressAppearance } from './progress-choices';
import { progressMachineKeys } from './progress-machine-keys';
import type { UseProgressProps, UseProgressReturn } from './progress-types';

export type ProgressRootBaseProps = UseProgressProps & ProgressAppearance;
export type ProgressRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  ProgressRootBaseProps,
  As
>;
export type ProgressRootProviderBaseProps = ProgressAppearance;
export type ProgressRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', { value: UseProgressReturn } & ProgressAppearance, As>;
type PartAppearance = { unstyled?: boolean; className?: string };
export type ProgressLabelProps<As extends PrimitiveNativeTag = 'span'> =
  PrimitiveNativeElementProps<'span', PartAppearance, As>;
export type ProgressTrackProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  PartAppearance,
  As
>;
export type ProgressRangeProps<As extends PrimitiveNativeTag = 'div'> = ProgressTrackProps<As>;
export type ProgressValueTextProps<As extends PrimitiveNativeTag = 'span'> = ProgressLabelProps<As>;

type ProgressDefaults = Partial<ProgressRootBaseProps>;

export interface ProgressPropsProviderProps {
  value: ProgressDefaults | Accessor<ProgressDefaults>;
  children: JSX.Element;
}

const ProgressPropsContext = createOptionalContext<Accessor<ProgressDefaults>>();
/** Supply reactive appearance and machine defaults to descendant roots. */
export function ProgressPropsProvider(props: ProgressPropsProviderProps): JSX.Element {
  /** Read the current static or accessor-based defaults. */
  function readDefaults(): ProgressDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <ProgressPropsContext value={readDefaults}>{props.children}</ProgressPropsContext>;
}

/** Merge inherited defaults before one machine-owned Progress root. */
export function useProgressProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(ProgressPropsContext);
  return mergeProps(
    /** Keep explicit root values ahead of inherited defaults. */
    () => inherited?.() ?? {},
    instance,
  ) as Props;
}

/** Inherit appearance without replacing a caller-owned Progress machine. */
export function useProgressRootProviderProps<
  Props extends ProgressAppearance & { value: UseProgressReturn },
>(instance: Props): Props {
  const inherited = useOptionalContext(ProgressPropsContext);
  return mergeProps(
    /** Leave machine settings on the external accessor. */
    () => omit(inherited?.() ?? {}, progressMachineKeys),
    instance,
  ) as Props;
}
