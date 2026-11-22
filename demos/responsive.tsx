import { type JSX } from '@solidjs/web';
import type { Demo, DemoMeta } from './demo-types';
import { Box, Button } from '../src';
import { renderResponsiveExample } from './responsive-example';
import './responsive-example.css';

/** Show authored CSS at the public responsive breakpoints. */
function ResponsiveStory(): JSX.Element {
  return renderResponsiveExample({ Box, Button });
}

export const meta = {
  component: ResponsiveStory,
} satisfies DemoMeta;

type Story = Demo;

export const Values: Story = {};
