import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface SliderAppearanceState {
  unstyled: Accessor<boolean>;
}

const SliderAppearanceContext = createOptionalContext<SliderAppearanceState>();

/** Share a Slider root's presentation choice with its public parts. */
export const SliderAppearanceProvider = SliderAppearanceContext;

/** Read the nearest Slider root's presentation choice. */
export function useSliderAppearance(): SliderAppearanceState {
  const state = useOptionalContext(SliderAppearanceContext);
  if (!state) throw new Error('Slider parts require SliderRoot or SliderRootProvider.');
  return state;
}
