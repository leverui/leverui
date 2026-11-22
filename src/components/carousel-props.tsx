import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { CarouselAppearance } from './carousel-appearance';
import type { UseCarouselProps, UseCarouselReturn } from './carousel-machine';

export type CarouselRootBaseProps = UseCarouselProps & CarouselAppearance;
export type CarouselRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  CarouselRootBaseProps,
  As
>;
export type CarouselRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', { value: UseCarouselReturn } & CarouselAppearance, As>;
type CarouselRootDefaults = Partial<CarouselRootBaseProps>;

export interface CarouselPropsProviderProps {
  value: CarouselRootDefaults | Accessor<CarouselRootDefaults>;
  children: JSX.Element;
}

const CarouselPropsContext = createOptionalContext<Accessor<CarouselRootDefaults>>();
/** Supply reactive machine and appearance defaults to nested Carousel roots. */
export function CarouselPropsProvider(props: CarouselPropsProviderProps): JSX.Element {
  /** Read current static defaults or the caller's Solid accessor. */
  function readDefaults(): CarouselRootDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <CarouselPropsContext value={readDefaults}>{props.children}</CarouselPropsContext>;
}

/** Merge inherited defaults before one machine-owned Carousel root. */
export function useCarouselRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(CarouselPropsContext);
  return mergeProps(
    /** Keep instance props after inherited defaults. */
    () => inherited?.() ?? {},
    instance,
  ) as Props;
}

/** Inherit appearance without replacing a caller-owned machine. */
export function useCarouselRootProviderProps<
  Props extends CarouselAppearance & { value: UseCarouselReturn },
>(instance: Props): Props {
  const inherited = useOptionalContext(CarouselPropsContext);
  return mergeProps(
    /** Leave slide settings on the external machine accessor. */
    () => ({ unstyled: inherited?.().unstyled }),
    instance,
  ) as Props;
}
