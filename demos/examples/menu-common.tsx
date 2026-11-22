import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Menu, Portal, type MenuRootProps } from '../../src';

export const standardActions = [
  { value: 'new-txt', label: 'New text file' },
  { value: 'new-file', label: 'New file...' },
  { value: 'new-win', label: 'New window' },
  { value: 'open-file', label: 'Open file...' },
  { value: 'export', label: 'Export' },
] as const;

/** Render the five file actions shared by the menus. */
export function MenuActionItems(): JSX.Element {
  return (
    <For each={standardActions}>
      {
        /** Preserve each action's label and machine value. */
        (item) => <Menu.Item value={item.value}>{item.label}</Menu.Item>
      }
    </For>
  );
}

/** Apply the trigger behavior to the outline button. */
export function MenuTriggerButton(props: {
  label?: JSX.Element | undefined;
  size?: 'sm' | 'md' | undefined;
}): JSX.Element {
  return (
    <Menu.Trigger
      asChild={
        /** Keep trigger keyboard behavior on the styled native button. */
        (getProps) => (
          <Button {...getProps()} variant="outline" size={props.size ?? 'sm'}>
            {props.label ?? 'Open'}
          </Button>
        )
      }
    />
  );
}

/** Give a menu its ordinary trigger and portal surface. */
export function MenuExample(props: {
  children: JSX.Element;
  label?: JSX.Element;
  size?: 'sm' | 'md';
  positioning?: MenuRootProps['positioning'];
  open?: boolean;
  onOpenChange?: MenuRootProps['onOpenChange'];
  contentProps?: { style?: JSX.HTMLAttributes<HTMLElement>['style'] };
}): JSX.Element {
  return (
    <Menu.Root positioning={props.positioning} open={props.open} onOpenChange={props.onOpenChange}>
      <MenuTriggerButton label={props.label} size={props.size} />
      <Portal>
        <Menu.Positioner>
          <Menu.Content {...props.contentProps}>{props.children}</Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
