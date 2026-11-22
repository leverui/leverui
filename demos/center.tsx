import { type JSX } from '@solidjs/web';
import type { Demo, DemoMeta } from './demo-types';
import { ArrowRightIcon, PhoneForwardedIcon, PhoneIcon } from '@lucide/solid';
import {
  AbsoluteCenter,
  Box,
  Center,
  Circle as LeverUICircle,
  HStack,
  Link,
  Square as LeverUISquare,
} from '../src';
import { withComponentInset } from './examples/example-frame';
import './examples/absolute-center-placements.css';
import './center-absolute.css';
import './center-examples.css';

/** Center a short label inside a muted block. */
function CenterBasic(): JSX.Element {
  return (
    <Center class="center-example-basic">
      <Box>This will be centered</Box>
    </Center>
  );
}

/** Compare absolute positioning with the regular Center component. */
function CenterWithAbsolute(): JSX.Element {
  return (
    <Box class="center-example-absolute-frame">
      <AbsoluteCenter class="absolute-center-phone" axis="both">
        <PhoneIcon />
      </AbsoluteCenter>
    </Box>
  );
}

/** Align an icon and a number in matching square surfaces. */
function CenterWithIcons(): JSX.Element {
  return (
    <HStack>
      <Center class="center-example-icon">
        <PhoneIcon />
      </Center>
      <Center class="center-example-icon">
        <Box as="span" class="center-example-count">
          1
        </Box>
      </Center>
    </HStack>
  );
}

/** Place text and an arrow inside an inline Center link. */
function CenterWithInline(): JSX.Element {
  return (
    <Link href="#">
      <Center inline class="center-example-inline">
        <Box>Visit Lever UI</Box>
        <ArrowRightIcon />
      </Center>
    </Link>
  );
}

/** Center a forwarded phone symbol in a purple square. */
function CenterWithSquare(): JSX.Element {
  return (
    <LeverUISquare size="10" class="center-example-square">
      <PhoneForwardedIcon />
    </LeverUISquare>
  );
}

/** Center a forwarded phone symbol in a blue circle. */
function CenterWithCircle(): JSX.Element {
  return (
    <LeverUICircle size="10" class="center-example-circle">
      <PhoneForwardedIcon />
    </LeverUICircle>
  );
}

export const meta = {
  component: CenterBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: CenterBasic };
export const Absolute: Story = { render: CenterWithAbsolute };
export const Icons: Story = {
  render: CenterWithIcons,
  parameters: {
    guide: {
      description: 'Center can be used to create frames around icons or numbers.',
    },
  },
};
export const Inline: Story = {
  render: CenterWithInline,
  parameters: {
    guide: {
      description:
        'Set `inline` to use `display: inline-flex`, so `Center` takes only the width its content needs. It can then sit naturally inside a link, button, or other inline context.',
    },
  },
};
export const Square: Story = {
  render: CenterWithSquare,
  parameters: {
    guide: {
      description:
        '`Square` centers its child within a fixed-size container of equal width and height. Its `size` prop sets both dimensions.',
    },
  },
};
export const Circle: Story = {
  render: CenterWithCircle,
  parameters: {
    guide: {
      description:
        '`Circle` applies `border-radius: 9999px` to an equal-size container. Like `Square`, its `size` prop sets both width and height.',
    },
  },
};
