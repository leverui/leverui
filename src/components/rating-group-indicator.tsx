import { splitProps } from '../primitives/utils/split-props';
import { createComponent, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import {
  nativeHtmlAliasNames,
  nativeHtmlAttributes,
  type NativeHtmlAliases,
} from '../styled-system/native-html-aliases';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { useRatingGroupAppearance } from './rating-group-appearance';
import { useRatingGroupItemContext } from './rating-group-machine';
import type { RatingGroupIcon, RatingGroupItemIndicatorProps } from './rating-group-part-props';
import { RatingGroupStarIcon } from './rating-group-star-icon';

type IndicatorRuntimeProps = JSX.HTMLAttributes<HTMLElement> &
  NativeHtmlAliases & {
    icon?: RatingGroupIcon | undefined;
    unstyled?: boolean | undefined;
    className?: string | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: RenderChild | undefined;
  };
type IndicatorAttributes = JSX.HTMLAttributes<HTMLElement> & {
  'data-unstyled': string | undefined;
  'data-highlighted': string | undefined;
  'data-checked': string | undefined;
  'data-half': string | undefined;
};

/** Render two native icon layers with the primitive's live item state. */
function RatingGroupItemIndicatorImpl(props: IndicatorRuntimeProps): JSX.Element {
  const item = useRatingGroupItemContext();
  const appearance = useRatingGroupAppearance();
  const [local, native] = splitProps(props, [
    'icon',
    'unstyled',
    'class',
    'className',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);
  const attributes = createMemo(
    /** Keep native attributes, public hooks, and item states reactive. */
    (): IndicatorAttributes => ({
      ...native,
      ...nativeHtmlAttributes(local),
      class: composeRecipeClassNames(
        'rating-group__itemIndicator',
        undefined,
        local.class,
        local.className,
      ),
      'data-unstyled': appearance.unstyled() || local.unstyled ? '' : undefined,
      'data-highlighted': item().highlighted ? '' : undefined,
      'data-checked': item().checked ? '' : undefined,
      'data-half': item().half ? '' : undefined,
    }),
  );

  /** Create distinct SVG nodes for the background and foreground layers. */
  function renderIcons(): JSX.Element {
    const Icon = local.icon ?? RatingGroupStarIcon;
    return (
      <>
        {createComponent(Icon, { 'data-bg': '', 'aria-hidden': 'true' })}
        {createComponent(Icon, { 'data-fg': '', 'aria-hidden': 'true' })}
      </>
    );
  }

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(
          'Rating Group ItemIndicator',
          local.asChild,
          attributes,
          renderIcons,
        )
      ) : (
        <Dynamic component={local.as ?? 'span'} {...attributes()}>
          {renderIcons()}
        </Dynamic>
      )}
    </>
  );
}

/** Type the selected native tag while the runtime handles each render path. */
export const RatingGroupItemIndicator = RatingGroupItemIndicatorImpl as <
  As extends PrimitiveNativeTag = 'span',
>(
  props: RatingGroupItemIndicatorProps<As>,
) => JSX.Element;
