import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { RatingGroupDefaultItems } from './rating-group-items';
import { renderRatingGroupPart, type RatingGroupRuntimePartProps } from './rating-group-part';
import type { RatingGroupControlProps } from './rating-group-part-props';

/** Supply generated items unless the caller composes custom control content. */
function RatingGroupControlImpl(props: RatingGroupRuntimePartProps<'div'>): JSX.Element {
  const controlProps: RatingGroupRuntimePartProps<'div'> = mergeProps(props, {
    /** Read caller children reactively before choosing the default items. */
    get children(): JSX.Element {
      return <>{props.children === undefined ? <RatingGroupDefaultItems /> : props.children}</>;
    },
  });
  return renderRatingGroupPart({ slot: 'control', props: controlProps });
}

/** Type native and selected control elements through their public props. */
export const RatingGroupControl = RatingGroupControlImpl as <
  As extends ComponentIntrinsicElement = 'div',
>(
  props: RatingGroupControlProps<As>,
) => JSX.Element;
