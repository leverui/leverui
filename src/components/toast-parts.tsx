import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { CloseIcon } from './close-icon';
import { renderToastPart, type ToastPartRenderProps } from './toast-part';
import type {
  ToastActionTriggerProps,
  ToastCloseTriggerProps,
  ToastContentProps,
  ToastDescriptionProps,
  ToastTitleProps,
} from './toast-props';

/** Preserve explicit empty content while providing the default close glyph. */
function closeTriggerChildren(children: JSX.Element | undefined): JSX.Element {
  if (children !== undefined) return children;
  return <CloseIcon />;
}

/** Wrap the toast's text so its height follows its content. */
function ToastContentImpl(props: ToastPartRenderProps): JSX.Element {
  return renderToastPart('content', props);
}

/** Expose native content props and selected tags. */
export const ToastContent = ToastContentImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ToastContentProps<As>,
) => JSX.Element;

/** Render the toast's accessible title. */
function ToastTitleImpl(props: ToastPartRenderProps): JSX.Element {
  return renderToastPart('title', props);
}

/** Expose native title props and selected tags. */
export const ToastTitle = ToastTitleImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ToastTitleProps<As>,
) => JSX.Element;

/** Render the toast's accessible description. */
function ToastDescriptionImpl(props: ToastPartRenderProps): JSX.Element {
  return renderToastPart('description', props);
}

/** Expose native description props and selected tags. */
export const ToastDescription = ToastDescriptionImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ToastDescriptionProps<As>,
) => JSX.Element;

/** Render an action through the primitive's current toast context. */
function ToastActionTriggerImpl(props: ToastPartRenderProps): JSX.Element {
  return renderToastPart('actionTrigger', props);
}

/** Expose native action button props and selected tags. */
export const ToastActionTrigger = ToastActionTriggerImpl as <
  As extends PrimitiveNativeTag = 'button',
>(
  props: ToastActionTriggerProps<As>,
) => JSX.Element;

/** Render a dismiss button with a default decorative glyph. */
function ToastCloseTriggerImpl(props: ToastPartRenderProps): JSX.Element {
  const withDefaultIcon = mergeProps(props, {
    /** Supply a close glyph only when the caller omitted content. */
    get children() {
      return closeTriggerChildren(props.children);
    },
  });
  return renderToastPart('closeTrigger', withDefaultIcon);
}

/** Expose native dismiss button props and selected tags. */
export const ToastCloseTrigger = ToastCloseTriggerImpl as <
  As extends PrimitiveNativeTag = 'button',
>(
  props: ToastCloseTriggerProps<As>,
) => JSX.Element;
