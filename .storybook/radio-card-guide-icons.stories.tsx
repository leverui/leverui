import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RadioCardCentered, RadioCardIcon } from './radio-card-guide-icon-specimens';
import {
  RadioCardResponsiveOrientation,
  RadioCardWithoutIndicator,
  RadioCardWithoutIndicatorVertical,
} from './radio-card-guide-payment-specimens';

/** Keep the internal permission specimen under the package components. */
function PermissionExample(): JSX.Element {
  return (
    <>
      <RadioCardIcon testId="guide-radio-card-permission" />
    </>
  );
}

/** Keep the internal horizontal payment specimen addressable by tests. */
function NoIndicatorExample(): JSX.Element {
  return (
    <>
      <RadioCardWithoutIndicator testId="guide-radio-card-payment" />
    </>
  );
}

/** Keep the internal vertical payment specimen addressable by tests. */
function NoIndicatorVerticalExample(): JSX.Element {
  return (
    <>
      <RadioCardWithoutIndicatorVertical testId="guide-radio-card-payment" />
    </>
  );
}

/** Keep the internal responsive payment specimen addressable by tests. */
function ResponsiveOrientationExample(): JSX.Element {
  return (
    <>
      <RadioCardResponsiveOrientation testId="guide-radio-card-payment" />
    </>
  );
}

/** Keep the internal centered contract specimen addressable by tests. */
function CenteredExample(): JSX.Element {
  return (
    <>
      <RadioCardCentered testId="guide-radio-card-centered" />
    </>
  );
}

const meta = {
  title: 'Components/Radio Card Guide Icons',
  component: PermissionExample,
} satisfies Meta<typeof PermissionExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Icon: Story = { render: PermissionExample };
export const NoIndicator: Story = { render: NoIndicatorExample };
export const NoIndicatorVertical: Story = { render: NoIndicatorVerticalExample };
export const ResponsiveOrientation: Story = { render: ResponsiveOrientationExample };
export const Centered: Story = { render: CenteredExample };
