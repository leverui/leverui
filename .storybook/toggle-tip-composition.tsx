import { splitProps } from '../src/primitives/utils/split-props';
import { type JSX } from '@solidjs/web';
import {
  IconButton,
  Popover,
  Portal,
  type PopoverContentProps,
  type PopoverRootProps,
  type PopoverTriggerProps,
} from '../src';

export type ToggleTipCompositionProps = Omit<PopoverRootProps, 'children'> & {
  trigger: NonNullable<PopoverTriggerProps['asChild']>;
  content: JSX.Element;
  contentLabel: string;
  showArrow?: boolean;
  portalled?: boolean;
  container?: HTMLElement | (() => HTMLElement | null | undefined);
  contentProps?: PopoverContentProps;
  contentTestId?: string;
};

/** Compose a small informational Popover without adding a package export. */
export function ToggleTipComposition(props: ToggleTipCompositionProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    'trigger',
    'content',
    'contentLabel',
    'showArrow',
    'portalled',
    'container',
    'contentProps',
    'contentTestId',
  ]);

  return (
    <Popover.Root {...rest} positioning={{ ...rest.positioning, gutter: 4 }}>
      <Popover.Trigger asChild={local.trigger} />
      <Portal disabled={local.portalled === false} container={local.container}>
        <Popover.Positioner>
          <Popover.Content
            style={{
              width: 'auto',
              'padding-inline': 'var(--lui-spacing-2)',
              'padding-block': 'var(--lui-spacing-1)',
              'font-size': 'var(--lui-font-sizes-xs)',
              'line-height': '1rem',
              'border-radius': 'var(--lui-radii-sm)',
            }}
            aria-label={local.contentLabel}
            {...local.contentProps}
            data-testid={local.contentTestId}
          >
            {local.showArrow && (
              <Popover.Arrow>
                <Popover.ArrowTip />
              </Popover.Arrow>
            )}
            {local.content}
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

export type InfoTipCompositionProps = Omit<ToggleTipCompositionProps, 'trigger'> & {
  triggerTestId: string;
  triggerLabel: string;
  buttonSize?: '2xs' | 'xs' | 'sm' | 'md' | 'lg';
  icon?: JSX.Element;
};

/** Match the small information trigger around the Popover. */
export function InfoTipComposition(props: InfoTipCompositionProps): JSX.Element {
  const [local, rest] = splitProps(props, ['triggerTestId', 'triggerLabel', 'buttonSize', 'icon']);
  return (
    <ToggleTipComposition
      {...rest}
      trigger={
        /** Put Popover trigger behavior on the icon button. */
        (getProps) => (
          <IconButton
            {...getProps()}
            variant="ghost"
            aria-label={local.triggerLabel}
            size={local.buttonSize ?? '2xs'}
            colorPalette="gray"
            data-testid={local.triggerTestId}
          >
            {local.icon ?? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </IconButton>
        )
      }
    />
  );
}
