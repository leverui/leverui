import { splitProps } from '../primitives/utils/split-props';
import { useCheckboxContext } from '../primitives/components/checkbox';
import { createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { responsiveBreakpoints, type ResponsiveValues } from '../styled-system/responsive-values';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { CheckboxCardVariant } from './checkbox-card-choices';
import type { CheckboxCardIndicatorProps } from './checkbox-card-part-props';
import { useCheckboxCardPresentation } from './checkbox-card-presentation';
import { Checkmark } from './checkmark';
import type { CheckmarkVariant } from './checkmark-options';

const indicatorVariants: Record<CheckboxCardVariant, CheckmarkVariant> = {
  surface: 'solid',
  subtle: 'plain',
  outline: 'solid',
  solid: 'inverted',
};

/** Translate Card treatments into the shared Checkmark's finite CSS choices. */
function readIndicatorVariants(
  selected: ResponsiveValues<CheckboxCardVariant>,
): ResponsiveValues<CheckmarkVariant> {
  const mapped: ResponsiveValues<CheckmarkVariant> = {
    base: indicatorVariants[selected.base ?? 'outline'],
  };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = selected[breakpoint];
    if (choice) mapped[breakpoint] = indicatorVariants[choice];
  }
  return mapped;
}

/** Render the Card's checked SVG with authored Checkmark presentation. */
function CheckboxCardIndicatorImpl(props: CheckboxCardIndicatorProps): JSX.Element {
  const checkbox = useCheckboxContext();
  const presentation = useCheckboxCardPresentation();
  const [local, native] = splitProps(props, ['class', 'className', 'unstyled', 'size', 'variant']);
  const variant = createMemo(
    /** Follow the Card treatment unless the Indicator selects its own. */
    () => local.variant ?? readIndicatorVariants(presentation().choices.variant),
  );
  return (
    <Checkmark
      {...native}
      checked={checkbox().checked}
      indeterminate={checkbox().indeterminate}
      disabled={checkbox().disabled}
      size={local.size ?? presentation().choices.size}
      variant={variant()}
      unstyled={presentation().unstyled || local.unstyled}
      data-checkbox-card-indicator=""
      class={composeRecipeClassNames(
        'checkbox-card__indicator',
        undefined,
        local.class,
        local.className,
      )}
    />
  );
}

/** Type each native or caller-rendered Indicator element with its own ref. */
export const CheckboxCardIndicator = CheckboxCardIndicatorImpl as <
  As extends keyof JSX.IntrinsicElements = 'svg',
>(
  props: CheckboxCardIndicatorProps<As>,
) => JSX.Element;
