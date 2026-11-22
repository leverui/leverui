import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import { renderTimelinePart } from './timeline-part';
import type {
  TimelineConnectorProps,
  TimelineContentProps,
  TimelineDescriptionProps,
  TimelineIndicatorProps,
  TimelineItemProps,
  TimelinePartRuntimeProps,
  TimelineSeparatorProps,
  TimelineTitleProps,
} from './timeline-props';

/** Render one event with native list-item semantics. */
function TimelineItemComponent(props: TimelinePartRuntimeProps): JSX.Element {
  return renderTimelinePart('TimelineItem', 'item', props);
}
/** Render the continuous line behind an event indicator. */
function TimelineSeparatorComponent(props: TimelinePartRuntimeProps): JSX.Element {
  return renderTimelinePart('TimelineSeparator', 'separator', props);
}
/** Render an event marker inside its connector. */
function TimelineIndicatorComponent(props: TimelinePartRuntimeProps): JSX.Element {
  return renderTimelinePart('TimelineIndicator', 'indicator', props);
}
/** Group an event marker with its separator. */
function TimelineConnectorComponent(props: TimelinePartRuntimeProps): JSX.Element {
  return renderTimelinePart('TimelineConnector', 'connector', props);
}
/** Render event content before or after its connector. */
function TimelineContentComponent(props: TimelinePartRuntimeProps): JSX.Element {
  return renderTimelinePart('TimelineContent', 'content', props);
}
/** Render the heading for one event. */
function TimelineTitleComponent(props: TimelinePartRuntimeProps): JSX.Element {
  return renderTimelinePart('TimelineTitle', 'title', props);
}
/** Render muted supporting text for one event. */
function TimelineDescriptionComponent(props: TimelinePartRuntimeProps): JSX.Element {
  return renderTimelinePart('TimelineDescription', 'description', props);
}

/** Expose native event item attributes. */
export const TimelineItem = TimelineItemComponent as <As extends NativeElementTag = 'div'>(
  props: TimelineItemProps<As>,
) => JSX.Element;
/** Expose native separator attributes. */
export const TimelineSeparator = TimelineSeparatorComponent as <
  As extends NativeElementTag = 'div',
>(
  props: TimelineSeparatorProps<As>,
) => JSX.Element;
/** Expose native indicator attributes. */
export const TimelineIndicator = TimelineIndicatorComponent as <
  As extends NativeElementTag = 'div',
>(
  props: TimelineIndicatorProps<As>,
) => JSX.Element;
/** Expose native connector attributes. */
export const TimelineConnector = TimelineConnectorComponent as <
  As extends NativeElementTag = 'div',
>(
  props: TimelineConnectorProps<As>,
) => JSX.Element;
/** Expose native content attributes. */
export const TimelineContent = TimelineContentComponent as <As extends NativeElementTag = 'div'>(
  props: TimelineContentProps<As>,
) => JSX.Element;
/** Expose native title attributes. */
export const TimelineTitle = TimelineTitleComponent as <As extends NativeElementTag = 'div'>(
  props: TimelineTitleProps<As>,
) => JSX.Element;
/** Expose native description attributes. */
export const TimelineDescription = TimelineDescriptionComponent as <
  As extends NativeElementTag = 'div',
>(
  props: TimelineDescriptionProps<As>,
) => JSX.Element;
