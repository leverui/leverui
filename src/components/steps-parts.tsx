import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { StepsCheckIcon, StepsNumber, StepsStatus } from './steps-indicator-content';
import { renderStepsPart } from './steps-part';
import type {
  StepsCompletedContentProps,
  StepsContentProps,
  StepsDescriptionProps,
  StepsIndicatorProps,
  StepsItemProps,
  StepsListProps,
  StepsNextTriggerProps,
  StepsPrevTriggerProps,
  StepsSeparatorProps,
  StepsTitleProps,
  StepsTriggerProps,
} from './steps-part-props';

/** Lay out the ordered Steps items. */
export function StepsList<As extends ComponentIntrinsicElement = 'div'>(
  props: StepsListProps<As>,
): JSX.Element {
  return renderStepsPart('list', props);
}

/** Bind an item, by its value, to the Steps machine. */
export function StepsItem<As extends ComponentIntrinsicElement = 'div'>(
  props: StepsItemProps<As>,
): JSX.Element {
  return renderStepsPart('item', props);
}

/** Render a machine-controlled step selection trigger. */
export function StepsTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: StepsTriggerProps<As>,
): JSX.Element {
  return renderStepsPart('trigger', props);
}

/** Render content for one item, by its value. */
export function StepsContent<As extends ComponentIntrinsicElement = 'div'>(
  props: StepsContentProps<As>,
): JSX.Element {
  return renderStepsPart('content', props);
}

/** Render content after the last step is complete. */
export function StepsCompletedContent<As extends ComponentIntrinsicElement = 'div'>(
  props: StepsCompletedContentProps<As>,
): JSX.Element {
  return renderStepsPart('completedContent', props);
}

/** Style a step title without changing the primitive's item state. */
export function StepsTitle<As extends ComponentIntrinsicElement = 'div'>(
  props: StepsTitleProps<As>,
): JSX.Element {
  return renderStepsPart('title', props);
}

/** Style supporting text beneath a step title. */
export function StepsDescription<As extends ComponentIntrinsicElement = 'div'>(
  props: StepsDescriptionProps<As>,
): JSX.Element {
  return renderStepsPart('description', props);
}

/** Render the stateful connection between Steps items. */
export function StepsSeparator<As extends ComponentIntrinsicElement = 'div'>(
  props: StepsSeparatorProps<As>,
): JSX.Element {
  return renderStepsPart('separator', props);
}

/** Render the stateful indicator with a replaceable check and number. */
export function StepsIndicator<As extends ComponentIntrinsicElement = 'div'>(
  props: StepsIndicatorProps<As>,
): JSX.Element {
  const indicator = mergeProps(
    { children: <StepsStatus complete={<StepsCheckIcon />} incomplete={<StepsNumber />} /> },
    props,
  );
  return renderStepsPart('indicator', indicator);
}

/** Advance to the next valid step when the primitive permits it. */
export function StepsNextTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: StepsNextTriggerProps<As>,
): JSX.Element {
  return renderStepsPart('nextTrigger', props);
}

/** Return to the previous available step. */
export function StepsPrevTrigger<As extends ComponentIntrinsicElement = 'button'>(
  props: StepsPrevTriggerProps<As>,
): JSX.Element {
  return renderStepsPart('prevTrigger', props);
}
