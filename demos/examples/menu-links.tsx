import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ClipboardPasteIcon, CopyIcon, ScissorsIcon } from '@lucide/solid';
import { Button, Menu, Portal } from '../../src';

/** Combine action icons, labels, and keyboard commands. */
export function MenuIconAndCommand(): JSX.Element {
  return (
    <Menu.Root>
      <Menu.Trigger
        asChild={
          /** Keep trigger behavior on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="md">
              Edit
            </Button>
          )
        }
      />
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="cut">
              <ScissorsIcon />
              <span style={{ flex: '1' }}>Cut</span>
              <Menu.ItemCommand>⌘X</Menu.ItemCommand>
            </Menu.Item>
            <Menu.Item value="copy">
              <CopyIcon />
              <span style={{ flex: '1' }}>Copy</span>
              <Menu.ItemCommand>⌘C</Menu.ItemCommand>
            </Menu.Item>
            <Menu.Item value="paste">
              <ClipboardPasteIcon />
              <span style={{ flex: '1' }}>Paste</span>
              <Menu.ItemCommand>⌘V</Menu.ItemCommand>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/** Render actual outbound anchors as selectable menu items. */
export function MenuLinks(): JSX.Element {
  return (
    <Menu.Root>
      <Menu.Trigger
        asChild={
          /** Keep trigger behavior on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Select book
            </Button>
          )
        }
      />
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <For each={links}>
              {
                /** Forward menu selection behavior to each outbound link. */
                (link) => (
                  <Menu.Item
                    value={link.title}
                    asChild={
                      /** Keep the anchor's destination and new-tab behavior. */
                      (getProps) => (
                        <a {...getProps()} href={link.href} target="_blank" rel="noreferrer">
                          {link.title}
                        </a>
                      )
                    }
                  />
                )
              }
            </For>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

const links = [
  { title: 'Lanternwright', href: 'https://example.com/books/lanternwright' },
  { title: 'Saltwind', href: 'https://example.com/books/saltwind' },
  { title: 'The Glass Orchard', href: 'https://example.com/books/the-glass-orchard' },
] as const;
