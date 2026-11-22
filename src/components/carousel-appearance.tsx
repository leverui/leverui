import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface CarouselAppearance {
  /** Suppress authored presentation without changing the slide machine. */
  unstyled?: boolean | undefined;
}

export interface CarouselAppearanceState {
  unstyled: Accessor<boolean>;
}

const CarouselAppearanceContext = createOptionalContext<CarouselAppearanceState>();

/** Share the nearest root's current presentation choice. */
export const CarouselAppearanceProvider = CarouselAppearanceContext;

/** Read the nearest Carousel root's presentation choice. */
export function useCarouselAppearance(): CarouselAppearanceState {
  const state = useOptionalContext(CarouselAppearanceContext);
  if (!state) throw new Error('Carousel parts require CarouselRoot or CarouselRootProvider.');
  return state;
}
