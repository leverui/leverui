import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { AtSignIcon, StarIcon } from '@lucide/solid';
import { Badge, BadgePropsProvider, Group, HStack, Stack } from '../../src';

const variants = ['outline', 'solid', 'subtle', 'surface'] as const;
const sizes = ['xs', 'sm', 'md', 'lg'] as const;

/** Convert a variant name into its display label. */
function titleCase(value: string): string {
  return `${value[0]?.toUpperCase() ?? ''}${value.slice(1)}`;
}

/** Display the four basic Badge palettes. */
export function BadgeBasic(): JSX.Element {
  return (
    <Stack direction="row">
      <Badge>Default</Badge>
      <Badge colorPalette="green">Success</Badge>
      <Badge colorPalette="red">Removed</Badge>
      <Badge colorPalette="purple">New</Badge>
    </Stack>
  );
}

/** Compare the four Badge variants. */
export function BadgeWithVariants(): JSX.Element {
  return (
    <Stack direction="row">
      <For each={variants}>
        {
          /** Label each Badge with its variant. */
          (variant) => <Badge variant={variant}>{titleCase(variant)}</Badge>
        }
      </For>
    </Stack>
  );
}

/** Compare the four Badge sizes. */
export function BadgeWithSizes(): JSX.Element {
  return (
    <HStack>
      <For each={sizes}>
        {
          /** Render one Badge at each size. */
          (size) => <Badge size={size}>New</Badge>
        }
      </For>
    </HStack>
  );
}

/** Inherit size and outline style while one Badge overrides its variant. */
export function BadgeWithContext(): JSX.Element {
  return (
    <BadgePropsProvider value={{ size: 'sm', variant: 'outline' }}>
      <Group>
        <Badge>Badge</Badge>
        <Badge variant="solid">Badge</Badge>
      </Group>
    </BadgePropsProvider>
  );
}

/** Attach two solid Badges as a status pair. */
export function BadgeWithGroup(): JSX.Element {
  return (
    <Group attached>
      <Badge variant="solid" colorPalette="blue">
        Test coverage
      </Badge>
      <Badge variant="solid" colorPalette="green">
        92%
      </Badge>
    </Group>
  );
}

/** Place decorative icons before and after the Badge label. */
export function BadgeWithIcon(): JSX.Element {
  return (
    <Stack align="flex-start">
      <Badge variant="solid" colorPalette="blue">
        <StarIcon />
        New
      </Badge>
      <Badge variant="solid" colorPalette="green">
        New
        <AtSignIcon />
      </Badge>
    </Stack>
  );
}
