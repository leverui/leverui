import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import { FloatWithAvatar, FloatWithPlacements } from './examples/float-placements';
import {
  FloatBasic,
  FloatWithOffset,
  FloatWithOffsetX,
  FloatWithOffsetY,
} from './examples/float-standard';
import './float-examples.css';

export const meta = {
  component: FloatBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = {
  render: FloatBasic,
};
export const OffsetX: Story = {
  render: FloatWithOffsetX,
  parameters: {
    guide: {
      description: 'Use `offsetX` to move the marker horizontally.',
    },
  },
};
export const OffsetY: Story = {
  render: FloatWithOffsetY,
  parameters: {
    guide: {
      description: 'Use `offsetY` to move the marker vertically.',
    },
  },
};
export const Offset: Story = {
  render: FloatWithOffset,
  parameters: {
    guide: {
      description: 'Use `offset` to move the marker on both axes.',
    },
  },
};
export const Placements: Story = {
  render: FloatWithPlacements,
  parameters: {
    guide: {
      description: 'Position the marker along a container edge.',
    },
  },
};
export const Avatar: Story = {
  render: FloatWithAvatar,
  parameters: {
    guide: {
      description: 'Compose `Float` with an `Avatar` status badge.',
    },
  },
};
