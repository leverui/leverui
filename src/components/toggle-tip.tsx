import { splitProps } from '../primitives/utils/split-props';
import { type JSX } from '@solidjs/web';
import { getStatusIconPath } from './alert-icons';
import { IconButton, type IconButtonProps } from './icon-button';
import type { PopoverContentProps, PopoverTriggerProps } from './popover-part-props';
import {
  PopoverArrow,
  PopoverArrowTip,
  PopoverContent,
  PopoverPositioner,
  PopoverTrigger,
} from './popover-parts-surface';
import type { PopoverRootBaseProps } from './popover-props';
import { PopoverRoot } from './popover-root';
import { Portal } from './portal';

export interface ToggleTipProps extends PopoverRootBaseProps {
  /** Render the trigger element with the attributes the toggle tip supplies. */
  children: NonNullable<PopoverTriggerProps['asChild']>;
  /** The tip's text or markup. */
  content?: JSX.Element;
  /** Draw an arrow that points at the trigger. */
  showArrow?: boolean | undefined;
  /** Render in place instead of in a portal when false. */
  portalled?: boolean | undefined;
  /** The element that receives the portalled content. */
  portalRef?: HTMLElement | undefined;
  /** Attributes for the content surface. */
  contentProps?: PopoverContentProps | undefined;
}

/** Show compact help text in a popover that the trigger opens and closes on click. */
export function ToggleTip(props: ToggleTipProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    'children',
    'content',
    'showArrow',
    'portalled',
    'portalRef',
    'contentProps',
  ]);

  return (
    <PopoverRoot {...rest} positioning={{ ...rest.positioning, gutter: 4 }}>
      <PopoverTrigger asChild={local.children} />
      <Portal disabled={local.portalled === false} container={local.portalRef}>
        <PopoverPositioner>
          <PopoverContent
            aria-label="Additional information"
            {...local.contentProps}
            class={['leverui-toggle-tip', local.contentProps?.class]}
          >
            {local.showArrow && (
              <PopoverArrow>
                <PopoverArrowTip />
              </PopoverArrow>
            )}
            {local.content}
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
}

export interface InfoTipProps extends Omit<ToggleTipProps, 'children'> {
  /** The tip's text or markup, used when `content` is not given. */
  children?: JSX.Element;
  /** Attributes for the info button. */
  buttonProps?: IconButtonProps | undefined;
}

/** Show a toggle tip behind a small info button. */
export function InfoTip(props: InfoTipProps): JSX.Element {
  const [local, rest] = splitProps(props, ['children', 'buttonProps']);
  return (
    <ToggleTip content={local.children} {...rest}>
      {
        /** Put the toggle tip's trigger attributes on the info button. */
        (getProps) => (
          <IconButton
            {...getProps()}
            variant="ghost"
            aria-label="info"
            size="2xs"
            colorPalette="gray"
            {...local.buttonProps}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={getStatusIconPath('info')} />
            </svg>
          </IconButton>
        )
      }
    </ToggleTip>
  );
}
