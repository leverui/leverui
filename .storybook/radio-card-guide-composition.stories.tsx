import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RadioCardComposition } from './radio-card-guide-composition-specimen';
import { FrameworkCards } from './radio-card-guide-frameworks';

/** Keep the internal attached-card specimen addressable by tests. */
function CompositionExample(): JSX.Element {
  return (
    <>
      <RadioCardComposition testId="guide-radio-card-composition" />
    </>
  );
}

/** Keep the internal addon specimen under the package components. */
function AddonExample(): JSX.Element {
  return (
    <>
      <FrameworkCards description addon testId="guide-radio-card-addon" />
    </>
  );
}

const meta = {
  title: 'Components/Radio Card Guide Composition',
  component: CompositionExample,
} satisfies Meta<typeof CompositionExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Composition: Story = { render: CompositionExample };
export const Addon: Story = { render: AddonExample };
