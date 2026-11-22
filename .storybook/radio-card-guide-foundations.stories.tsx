import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Stack } from '../src';
import {
  guidePalettes,
  guideShortFrameworks,
  guideSizes,
  guideVariants,
} from './radio-card-guide-data';
import { FrameworkCards } from './radio-card-guide-frameworks';

/** Show the guide's default selected framework cards. */
function BasicExample(): JSX.Element {
  return (
    <>
      <FrameworkCards testId="guide-radio-card-basic" />
    </>
  );
}

/** Add one description inside each framework card. */
function DescriptionExample(): JSX.Element {
  return (
    <>
      <FrameworkCards description testId="guide-radio-card-description" />
    </>
  );
}

/** Render each size with its own radio machine. */
function SizesExample(): JSX.Element {
  return (
    <>
      <Stack gap="8">
        <For each={guideSizes}>
          {
            /** Label the size while preserving independent values. */
            (size) => (
              <FrameworkCards
                size={size}
                items={guideShortFrameworks}
                label={`size = (${size})`}
                testId={`guide-radio-card-size-${size}`}
              />
            )
          }
        </For>
      </Stack>
    </>
  );
}

/** Render every palette with its own selected card. */
function ColorsExample(): JSX.Element {
  return (
    <>
      <Stack gap="8">
        <For each={guidePalettes}>
          {
            /** Keep palette scopes independent for selected colors. */
            (colorPalette) => (
              <FrameworkCards
                colorPalette={colorPalette}
                items={guideShortFrameworks}
                label="Select Framework"
                testId={`guide-radio-card-color-${colorPalette}`}
              />
            )
          }
        </For>
      </Stack>
    </>
  );
}

/** Render the four CSS treatments with the guide's teal palette. */
function VariantsExample(): JSX.Element {
  return (
    <>
      <Stack gap="8">
        <For each={guideVariants}>
          {
            /** Keep each variant's selection and styling isolated. */
            (variant) => (
              <FrameworkCards
                variant={variant}
                colorPalette="teal"
                items={guideShortFrameworks}
                label={`variant = (${variant})`}
                testId={`guide-radio-card-variant-${variant}`}
              />
            )
          }
        </For>
      </Stack>
    </>
  );
}

/** Keep the guide's selection in a controlled Solid signal. */
function ControlledExample(): JSX.Element {
  const [value, setValue] = createSignal<string | null>('next');

  /** Keep the selected card synchronized with the owner signal. */
  function changeValue(details: { value: string | null }): void {
    setValue(details.value);
  }

  return (
    <>
      <FrameworkCards
        value={value()}
        onValueChange={changeValue}
        testId="guide-radio-card-controlled"
      />
      <output data-testid="guide-radio-card-controlled-value">{value()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Radio Card Guide Foundations',
  component: BasicExample,
} satisfies Meta<typeof BasicExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { render: BasicExample };
export const Description: Story = { render: DescriptionExample };
export const Sizes: Story = { render: SizesExample };
export const Colors: Story = { render: ColorsExample };
export const Variants: Story = { render: VariantsExample };
export const Controlled: Story = { render: ControlledExample };
