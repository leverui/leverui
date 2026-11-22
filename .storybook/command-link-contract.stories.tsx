import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { CommandLinksExample } from '../demos/examples/command-links-example';
import { withComponentInset } from '../demos/examples/example-frame';

const localTarget = '/iframe.html?id=contracts-command-links--local-target';

/** Exercise link semantics against an internal local destination. */
function LinkContractExample(): JSX.Element {
  return (
    <CommandLinksExample
      destinations={{
        gettingStarted: localTarget,
        components: localTarget,
        theming: localTarget,
        charts: localTarget,
        templates: localTarget,
        repository: localTarget,
      }}
    />
  );
}

/** Give link activation a same-origin destination for browser checks. */
function LocalTargetExample(): JSX.Element {
  return <p>Destination opened</p>;
}

const meta = {
  title: 'Contracts/Command/Links',
  component: LinkContractExample,
  decorators: [withComponentInset],
} satisfies Meta<typeof LinkContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contract: Story = { name: 'Contract' };
export const LocalTarget: Story = { name: 'Local target', render: LocalTargetExample };
