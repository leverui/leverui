import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { FiniteResponsiveChoice } from './finite-responsive-choice';
import type { TabsSize } from './tabs-size';
import type { TabsVariant } from './tabs-variant';

export type TabsJustify = 'start' | 'center' | 'end';
export type TabsFitted = boolean | readonly (boolean | null)[] | ResponsiveValues<boolean>;

/** Keep finite Tabs appearance choices separate from the primitive's machine props. */
export interface TabsAppearance {
  size?: FiniteResponsiveChoice<TabsSize> | undefined;
  variant?: FiniteResponsiveChoice<TabsVariant> | undefined;
  fitted?: TabsFitted | undefined;
  justify?: FiniteResponsiveChoice<TabsJustify> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
}
