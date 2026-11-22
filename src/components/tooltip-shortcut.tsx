import { splitProps } from '../primitives/utils/split-props';
import { type JSX } from '@solidjs/web';
import { Portal } from './portal';
import {
  TooltipArrow,
  TooltipArrowTip,
  TooltipContent,
  TooltipPositioner,
  TooltipTrigger,
} from './tooltip-parts';
import type { TooltipContentProps, TooltipTriggerProps } from './tooltip-part-props';
import type { TooltipRootBaseProps } from './tooltip-props';
import { TooltipRoot } from './tooltip-root';

export interface TooltipProps extends TooltipRootBaseProps {
  /** Render the trigger element with the attributes the tooltip supplies. */
  children: NonNullable<TooltipTriggerProps['asChild']>;
  /** The tooltip's text or markup. */
  content: JSX.Element;
  /** Attributes for the content surface. */
  contentProps?: TooltipContentProps | undefined;
  /** Draw an arrow that points at the trigger. */
  showArrow?: boolean | undefined;
  /** Render in place instead of in a portal when false. */
  portalled?: boolean | undefined;
  /** The element that receives the portalled content. */
  portalRef?: HTMLElement | undefined;
}

/** Wrap one trigger with a complete tooltip built from the Tooltip parts. */
export function TooltipShortcut(props: TooltipProps): JSX.Element {
  const [local, rootProps] = splitProps(props, [
    'children',
    'content',
    'contentProps',
    'showArrow',
    'portalled',
    'portalRef',
  ]);

  return (
    <TooltipRoot {...rootProps}>
      <TooltipTrigger asChild={local.children} />
      <Portal disabled={local.portalled === false} container={local.portalRef}>
        <TooltipPositioner>
          <TooltipContent {...local.contentProps}>
            {local.showArrow && (
              <TooltipArrow>
                <TooltipArrowTip />
              </TooltipArrow>
            )}
            {local.content}
          </TooltipContent>
        </TooltipPositioner>
      </Portal>
    </TooltipRoot>
  );
}
