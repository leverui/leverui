import { type JSX } from '@solidjs/web';
import { HStack, RadioGroup } from '../../src';
import {
  radioGroupSizes,
  radioGroupVariants,
  type RadioGroupSize,
  type RadioGroupVariant,
} from '../../src/components/radio-group-choices';
import { PlaygroundMatrix, type ExamplePalette } from './playground-matrix';

/** Render the selected and unselected pair. */
function RadioPair(props: {
  colorPalette: ExamplePalette;
  size?: RadioGroupSize;
  variant?: RadioGroupVariant;
  readOnly?: boolean;
}): JSX.Element {
  return (
    <RadioGroup.Root
      colorPalette={props.colorPalette}
      size={props.size}
      variant={props.variant}
      readOnly={props.readOnly}
      defaultValue="1"
      style={{ 'min-width': '200px' }}
    >
      <HStack gap="4">
        <RadioGroup.Item value="1">
          <RadioGroup.ItemHiddenInput />
          <RadioGroup.ItemIndicator />
          <RadioGroup.ItemText>Radio</RadioGroup.ItemText>
        </RadioGroup.Item>
        <RadioGroup.Item value="2">
          <RadioGroup.ItemHiddenInput />
          <RadioGroup.ItemIndicator />
          <RadioGroup.ItemText>Radio</RadioGroup.ItemText>
        </RadioGroup.Item>
      </HStack>
    </RadioGroup.Root>
  );
}

/** Render one size and palette table cell. */
function renderSize(size: RadioGroupSize, palette: ExamplePalette): JSX.Element {
  return <RadioPair colorPalette={palette} size={size} />;
}

/** Render one variant and palette table cell. */
function renderVariant(variant: RadioGroupVariant, palette: ExamplePalette): JSX.Element {
  return <RadioPair colorPalette={palette} variant={variant} readOnly />;
}

/** Compare all finite sizes across ten palettes. */
export function RadioSizeTable(): JSX.Element {
  return <PlaygroundMatrix values={radioGroupSizes} renderCell={renderSize} />;
}

/** Compare all finite variants across ten palettes. */
export function RadioVariantTable(): JSX.Element {
  return <PlaygroundMatrix values={radioGroupVariants} renderCell={renderVariant} />;
}
