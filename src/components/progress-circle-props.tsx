import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import { omit } from '../utils/omit';
import type {
  PrimitiveCompositionProps,
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { ProgressCircleAppearance } from './progress-circle-choices';
import { progressMachineKeys } from './progress-machine-keys';
import type { UseProgressProps, UseProgressReturn } from './progress-types';

export type ProgressCircleRootBaseProps = UseProgressProps &
  ProgressCircleAppearance &
  PrimitiveCompositionProps<'div'>;
export type ProgressCircleRootProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', ProgressCircleRootBaseProps, As>;
export type ProgressCircleRootProviderBaseProps = ProgressCircleAppearance &
  PrimitiveCompositionProps<'div'> & { value: UseProgressReturn };
export type ProgressCircleRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', ProgressCircleRootProviderBaseProps, As>;
type PartAppearance = { unstyled?: boolean; className?: string };
type CircleStrokeAppearance = PartAppearance & {
  strokeLinecap?: string;
  strokeWidth?: string | number;
};
export type ProgressCircleLabelProps<As extends PrimitiveNativeTag = 'span'> =
  PrimitiveNativeElementProps<'span', PartAppearance, As>;
export type ProgressCircleCircleProps<As extends PrimitiveNativeTag = 'svg'> =
  PrimitiveNativeElementProps<'svg', PartAppearance, As>;
export type ProgressCircleTrackProps<As extends PrimitiveNativeTag = 'circle'> =
  PrimitiveNativeElementProps<'circle', CircleStrokeAppearance, As>;
export type ProgressCircleRangeProps<As extends PrimitiveNativeTag = 'circle'> =
  ProgressCircleTrackProps<As>;
export type ProgressCircleValueTextProps<As extends PrimitiveNativeTag = 'span'> =
  ProgressCircleLabelProps<As>;

type ProgressCircleDefaults = Partial<ProgressCircleRootBaseProps>;

export interface ProgressCirclePropsProviderProps {
  value: ProgressCircleDefaults | Accessor<ProgressCircleDefaults>;
  children: JSX.Element;
}

const ProgressCirclePropsContext = createOptionalContext<Accessor<ProgressCircleDefaults>>();

/** Supply reactive machine and appearance defaults to Circle roots. */
export function ProgressCirclePropsProvider(props: ProgressCirclePropsProviderProps): JSX.Element {
  /** Read current static or accessor-based defaults. */
  function readDefaults(): ProgressCircleDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return (
    <ProgressCirclePropsContext value={readDefaults}>{props.children}</ProgressCirclePropsContext>
  );
}

/** Merge inherited defaults before one machine-owned Circle root. */
export function useProgressCircleProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(ProgressCirclePropsContext);
  return mergeProps(
    /** Keep explicit root values ahead of inherited defaults. */
    () => inherited?.() ?? {},
    instance,
  ) as Props;
}

/** Inherit appearance without replacing a caller-owned Progress machine. */
export function useProgressCircleRootProviderProps<
  Props extends ProgressCircleAppearance & { value: UseProgressReturn },
>(instance: Props): Props {
  const inherited = useOptionalContext(ProgressCirclePropsContext);
  return mergeProps(
    /** Leave machine settings on the external accessor. */
    () => omit(inherited?.() ?? {}, progressMachineKeys),
    instance,
  ) as Props;
}
