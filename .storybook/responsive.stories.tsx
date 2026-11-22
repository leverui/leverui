import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Button } from '../src';
import { renderResponsiveExample } from '../demos/responsive-example';
import '../demos/responsive-example.css';

/** Show responsive authored CSS and finite Button appearance. */
function ResponsiveStory(): JSX.Element {
  return renderResponsiveExample({ Box, Button });
}

const meta = {
  title: 'Setup/Responsive Styles',
  component: ResponsiveStory,
} satisfies Meta<typeof ResponsiveStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Values: Story = {};
