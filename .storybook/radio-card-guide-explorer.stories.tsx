import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { HStack, RadioCard } from '../dist/index.js';
import { renderRadioCardExplorer } from './radio-card-guide-explorer-tree';
import '../demos/radio-card-consumer.css';

const components = { HStack, RadioCard };

/** Display the same Explorer tree used by published hydration checks. */
function ExplorerExample(): JSX.Element {
  return renderRadioCardExplorer(components);
}

const meta = {
  title: 'Components/Radio Card Guide Explorer',
  component: ExplorerExample,
} satisfies Meta<typeof ExplorerExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Explorer: Story = { render: ExplorerExample };
