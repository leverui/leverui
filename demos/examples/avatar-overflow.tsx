import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import { Avatar, Group, Menu } from '../../src';
import './avatar-overflow.css';

const visibleNames = ['Wren Ashford', 'Mira Solis', 'Tobin Hale'] as const;
const overflowNames = ['Greta Lindqvist', 'Hollis Grant'] as const;
const randomPalettes = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'] as const;

/** Select a stable palette from the first letter of a display name. */
function pickPalette(name: string): (typeof randomPalettes)[number] {
  const index = name.charCodeAt(0) % randomPalettes.length;
  const palette = randomPalettes[index];
  if (!palette) throw new Error('Avatar palette lookup failed.');
  return palette;
}

/** Reveal names beyond the first three Avatars in a menu. */
export function AvatarWithOverflow(): JSX.Element {
  return (
    <Group style={{ '--lui-group-gap': 'var(--lui-spacing-2)' }}>
      <For each={visibleNames}>
        {
          /** Show one visible Avatar with its stable palette. */
          (name) => (
            <Avatar.Root colorPalette={pickPalette(name)}>
              <Avatar.Fallback name={name} />
            </Avatar.Root>
          )
        }
      </For>
      <Menu.Root positioning={{ placement: 'bottom' }}>
        <Menu.Trigger class="avatar-example-overflow-trigger">
          <Avatar.Root variant="outline">
            <Avatar.Fallback>+{overflowNames.length}</Avatar.Fallback>
          </Avatar.Root>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <For each={overflowNames}>
                {
                  /** Give an overflow item its label and small Avatar. */
                  (name) => (
                    <Menu.Item value={name}>
                      <Avatar.Root size="xs" colorPalette={pickPalette(name)}>
                        <Avatar.Fallback name={name} />
                      </Avatar.Root>
                      {name}
                    </Menu.Item>
                  )
                }
              </For>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Group>
  );
}
