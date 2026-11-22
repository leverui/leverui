import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderPopoverPart } from './popover-part';
import type {
  PopoverBodyProps,
  PopoverFooterProps,
  PopoverHeaderProps,
} from './popover-part-props';

/** Group introductory content in a semantic Popover header. */
export function PopoverHeader<As extends PrimitiveNativeTag = 'header'>(
  props: PopoverHeaderProps<As>,
): JSX.Element {
  return renderPopoverPart('header', props);
}

/** Hold the main Popover content with its size-dependent padding. */
export function PopoverBody<As extends PrimitiveNativeTag = 'div'>(
  props: PopoverBodyProps<As>,
): JSX.Element {
  return renderPopoverPart('body', props);
}

/** Group actions in a semantic Popover footer. */
export function PopoverFooter<As extends PrimitiveNativeTag = 'footer'>(
  props: PopoverFooterProps<As>,
): JSX.Element {
  return renderPopoverPart('footer', props);
}
