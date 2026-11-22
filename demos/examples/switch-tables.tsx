import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, Switch } from '../../src';
import {
  switchSizes,
  switchVariants,
  type SwitchSize,
  type SwitchVariant,
} from '../../src/components/switch-choices';
import { PlaygroundMatrix, type ExamplePalette } from './playground-matrix';

/** Render one labeled switch in a matrix. */
function SwitchDemo(props: {
  colorPalette: ExamplePalette;
  defaultChecked?: boolean;
  size?: SwitchSize;
  variant?: SwitchVariant;
}): JSX.Element {
  return (
    <Switch.Root
      colorPalette={props.colorPalette}
      defaultChecked={props.defaultChecked}
      size={props.size}
      variant={props.variant}
    >
      <Switch.HiddenInput />
      <Switch.Control />
      <Switch.Label>Toggle</Switch.Label>
    </Switch.Root>
  );
}

/** Display both variants, checked, for one size and palette. */
function renderSize(size: SwitchSize, palette: ExamplePalette): JSX.Element {
  return (
    <HStack>
      <For each={switchVariants}>
        {(variant) => (
          <SwitchDemo colorPalette={palette} defaultChecked size={size} variant={variant} />
        )}
      </For>
    </HStack>
  );
}

/** Display unchecked and checked states for one variant and palette. */
function renderVariant(variant: SwitchVariant, palette: ExamplePalette): JSX.Element {
  return (
    <HStack>
      <SwitchDemo colorPalette={palette} variant={variant} />
      <SwitchDemo colorPalette={palette} variant={variant} defaultChecked />
    </HStack>
  );
}

/** Compare the four sizes across ten palettes. */
export function SwitchSizeTable(): JSX.Element {
  return <PlaygroundMatrix values={switchSizes} renderCell={renderSize} />;
}

/** Compare the two variants across ten palettes. */
export function SwitchVariantTable(): JSX.Element {
  return <PlaygroundMatrix values={switchVariants} renderCell={renderVariant} />;
}
