import { createUniqueId, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Button,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
  ScrollArea,
} from '../../src';
import './scroll-area-advanced.css';

const menuItems = [
  { value: 'profile', label: 'Profile' },
  { value: 'settings', label: 'Settings' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'messages', label: 'Messages' },
  { value: 'documents', label: 'Documents' },
  { value: 'files', label: 'Files' },
  { value: 'images', label: 'Images' },
  { value: 'videos', label: 'Videos' },
  { value: 'music', label: 'Music' },
  { value: 'downloads', label: 'Downloads' },
  { value: 'share', label: 'Share' },
  { value: 'copy', label: 'Copy' },
  { value: 'edit', label: 'Edit' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'liked', label: 'Liked items' },
  { value: 'bookmarks', label: 'Bookmarks' },
  { value: 'flagged', label: 'Flagged items' },
  { value: 'help', label: 'Help & support' },
  { value: 'trash', label: 'Trash' },
  { value: 'logout', label: 'Log out' },
] as const;

/** Put a long menu on the ScrollArea viewport element. */
export function ScrollAreaWithMenu(): JSX.Element {
  const contentId = createUniqueId();
  return (
    <MenuRoot ids={{ content: contentId }}>
      <MenuTrigger
        asChild={
          /** Render the menu trigger on the outline Button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open menu with scroll
            </Button>
          )
        }
      />
      <Portal>
        <MenuPositioner>
          <ScrollArea.Root class="scroll-area-example-menu-root" ids={{ viewport: contentId }}>
            <ScrollArea.Viewport
              asChild={
                /** Use MenuContent as the viewport's native element. */
                (getProps) => (
                  <MenuContent
                    {...getProps()}
                    class="scroll-area-example-menu-content"
                    id={contentId}
                  >
                    <For each={menuItems}>
                      {(item) => <MenuItem value={item.value}>{item.label}</MenuItem>}
                    </For>
                    <ScrollArea.Scrollbar class="scroll-area-example-transparent-track">
                      <ScrollArea.Thumb />
                    </ScrollArea.Scrollbar>
                  </MenuContent>
                )
              }
            />
          </ScrollArea.Root>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
}
