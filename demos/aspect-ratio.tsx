import { type JSX } from '@solidjs/web';
import type { Demo, DemoMeta } from './demo-types';
import { AspectRatio, Box, Center, Image as LeverUIImage } from '../src';
import { withLayoutInset } from './examples/example-frame';
import './aspect-ratio-examples.css';
import './examples/decorative-box.css';

/** Show the default widescreen ratio with centered content. */
function AspectRatioBasic(): JSX.Element {
  return (
    <AspectRatio ratio={16 / 9} class="aspect-ratio-example-basic">
      <Center class="aspect-ratio-example-basic-label">16 / 9</Center>
    </AspectRatio>
  );
}

/** Embed an image in a four-to-three frame. */
function AspectRatioWithImage(): JSX.Element {
  return (
    <AspectRatio ratio={4 / 3} class="aspect-ratio-example-image">
      <LeverUIImage src="/demo-images/scenes/mountains.webp" alt="Mountain landscape" />
    </AspectRatio>
  );
}

/** Override a video's native shape with a square frame. */
function AspectRatioWithVideo(): JSX.Element {
  return (
    <AspectRatio ratio={1} class="aspect-ratio-example-video">
      <iframe title="Sample video" src="/demo-embeds/video.html" allowfullscreen />
    </AspectRatio>
  );
}

/** Embed a responsive map in a widescreen frame. */
function AspectRatioWithMap(): JSX.Element {
  return (
    <AspectRatio ratio={16 / 9}>
      <iframe title="Sample street map" src="/demo-embeds/map.html" />
    </AspectRatio>
  );
}

/** Change a box from square to widescreen at the medium breakpoint. */
function AspectRatioResponsive(): JSX.Element {
  return (
    <AspectRatio ratio={{ base: 1, md: 16 / 9 }} class="aspect-ratio-example-responsive">
      <Box class="example-decorative-box">Box</Box>
    </AspectRatio>
  );
}

export const meta = {
  component: AspectRatioBasic,
  decorators: [withLayoutInset],
  parameters: { guide: { outerInset: true } },
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: AspectRatioBasic };
export const Image: Story = {
  render: AspectRatioWithImage,
  parameters: {
    guide: {
      description: 'An image in a 4 / 3 frame.',
    },
  },
};
export const Video: Story = {
  render: AspectRatioWithVideo,
  parameters: {
    guide: {
      description: "A video in a square frame. `ratio` overrides the video's own shape.",
    },
  },
};
export const Map: Story = {
  render: AspectRatioWithMap,
  parameters: {
    guide: {
      description: 'A map in a 16 / 9 frame.',
    },
  },
};
export const Responsive: Story = {
  render: AspectRatioResponsive,
  parameters: {
    guide: {
      description: 'Square on small screens, 16 / 9 from the `md` breakpoint up.',
    },
  },
};
