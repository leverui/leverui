import { type JSX } from '@solidjs/web';
import { useAlertContext } from './alert-context';
import { AlertDefaultIcon } from './alert-icons';
import { renderAlertPart } from './alert-part';
import type {
  AlertContentProps,
  AlertDescriptionProps,
  AlertIndicatorProps,
  AlertPartRuntimeProps,
  AlertTitleProps,
} from './alert-props';
import type { NativeElementTag } from './native-element-props';

/** Render the Alert title with its public native part hook. */
function AlertTitleComponent(props: AlertPartRuntimeProps): JSX.Element {
  return renderAlertPart('AlertTitle', 'title', 'div', props);
}

/** Render supplementary Alert text as a native part. */
function AlertDescriptionComponent(props: AlertPartRuntimeProps): JSX.Element {
  return renderAlertPart('AlertDescription', 'description', 'div', props);
}

/** Arrange the Alert's title and description in its content part. */
function AlertContentComponent(props: AlertPartRuntimeProps): JSX.Element {
  return renderAlertPart('AlertContent', 'content', 'div', props);
}

/** Render a status glyph or caller content in a native indicator. */
function AlertIndicatorComponent(props: AlertPartRuntimeProps): JSX.Element {
  const state = useAlertContext();
  return renderAlertPart(
    'AlertIndicator',
    'indicator',
    'span',
    props,
    /** Keep the default glyph reactive to provider status changes. */
    () => <AlertDefaultIcon status={state.status()} />,
  );
}

/** Expose title props and refs for the selected native element. */
export const AlertTitle = AlertTitleComponent as <As extends NativeElementTag = 'div'>(
  props: AlertTitleProps<As>,
) => JSX.Element;

/** Expose description props and refs for the selected native element. */
export const AlertDescription = AlertDescriptionComponent as <As extends NativeElementTag = 'div'>(
  props: AlertDescriptionProps<As>,
) => JSX.Element;

/** Expose content props and refs for the selected native element. */
export const AlertContent = AlertContentComponent as <As extends NativeElementTag = 'div'>(
  props: AlertContentProps<As>,
) => JSX.Element;

/** Expose indicator props and refs for the selected native element. */
export const AlertIndicator = AlertIndicatorComponent as <As extends NativeElementTag = 'span'>(
  props: AlertIndicatorProps<As>,
) => JSX.Element;
