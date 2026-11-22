import type { Demo, DemoMeta } from './demo-types';
import {
  ImageBasic,
  ImageCircular,
  ImageWithAspectRatio,
  ImageWithFit,
  ImageWithHeight,
  ImageWithHtmlHeight,
} from './examples/image-display';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: ImageBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: ImageBasic };
export const Height: Story = {
  render: ImageWithHeight,
  parameters: {
    guide: { description: 'Use the `height` style to change the height of the image component.' },
  },
};
export const Circular: Story = {
  render: ImageCircular,
  parameters: { guide: { description: "Here's an example of how to render a circular image." } },
};
export const AspectRatio: Story = {
  render: ImageWithAspectRatio,
  parameters: {
    guide: {
      description:
        'Use the `aspect-ratio` style to change the aspect ratio of the image component.',
    },
  },
};
export const Fit: Story = {
  render: ImageWithFit,
  parameters: {
    guide: {
      description:
        'By default, the image applies `object-fit: cover`. Use the `fit` prop to change the fit of the image component.',
    },
  },
};
export const HtmlHeight: Story = {
  render: ImageWithHtmlHeight,
  parameters: {
    guide: {
      description:
        'Use the `htmlWidth` and `htmlHeight` props to set the native width and height of the image component.',
    },
  },
};
