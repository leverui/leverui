import type { Demo, DemoMeta } from './demo-types';
import { CarouselExplorerDemo } from './examples/carousel-autoplay';
import { CarouselBasic, CarouselControlled, CarouselWithStore } from './examples/carousel-basic';
import { CarouselComposition } from './examples/carousel-composition';
import { CarouselWithDialog } from './examples/carousel-dialog';
import { CarouselWithMouseDrag, CarouselWithProgressText } from './examples/carousel-drag';
import { CarouselWithImages } from './examples/carousel-images';
import {
  CarouselVertical,
  CarouselWithFloatingArrow,
  CarouselWithIndicators,
} from './examples/carousel-layout';
import {
  CarouselSlidesPerMove,
  CarouselSlidesPerPage,
  CarouselSpacing,
} from './examples/carousel-options';
import { CarouselVariableSize } from './examples/carousel-variable-size';
import { CarouselWithAutoplay } from './examples/carousel-with-autoplay';
import { CarouselWithThumbnails } from './examples/carousel-thumbnails';
import { withComponentInset } from './examples/example-frame';
import './examples/carousel-examples.css';

export const meta = {
  component: CarouselBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: CarouselBasic };
export const Controlled: Story = {
  render: CarouselControlled,
  parameters: guide(
    'Use the `page` and `onPageChange` props to programatically control the active carousel page.',
  ),
};
export const Store: Story = {
  render: CarouselWithStore,
  parameters: guide(
    'Alternatively, use the `useCarousel` hook to create a carousel store and pass it to the `Carousel.RootProvider` component for full programmatic control.',
  ),
};
export const FloatingArrow: Story = {
  render: CarouselWithFloatingArrow,
  parameters: guide(
    'Use the `Carousel.PrevTrigger` and `Carousel.NextTrigger` components to create arrows that navigate between slides.',
  ),
};
export const Indicators: Story = {
  render: CarouselWithIndicators,
  parameters: guide(
    'Use the `Carousel.Indicators` component to render visual indicators that help users track the progress of the carousel and jump to specific slides.',
  ),
};
export const Thumbnails: Story = {
  render: CarouselWithThumbnails,
  parameters: guide("Here's an example that uses an image thumbnail as a custom indicator."),
};
export const Spacing: Story = {
  render: CarouselSpacing,
  parameters: guide('Use the `spacing` prop to control the spacing between slides.'),
};
export const VariableSize: Story = {
  render: CarouselVariableSize,
  parameters: guide('Use the `autoSize` prop to allow variable width/height slide items.'),
};
export const Vertical: Story = {
  render: CarouselVertical,
  parameters: guide(
    'Use the `orientation` prop to `vertical` to transform your carousel into a vertical slider.',
  ),
};
export const MouseDrag: Story = {
  render: CarouselWithMouseDrag,
  parameters: guide('Use the `allowMouseDrag` prop to enable mouse dragging on the carousel.'),
};
export const Autoplay: Story = {
  render: CarouselWithAutoplay,
  parameters: guide(
    'Pass the `autoPlay` prop to the `Carousel.Root` component to make the carousel automatically move between slides.',
  ),
};
export const Dialog: Story = {
  render: CarouselWithDialog,
  parameters: guide(
    'Compose the `Carousel` component with the `Dialog` component to create a lightbox.',
  ),
};
export const Images: Story = {
  render: CarouselWithImages,
  parameters: guide(
    "Here's an example that shows how to create an image carousel for a product showcase.",
  ),
};
export const Composition: Story = {
  render: CarouselComposition,
  parameters: guide(
    "Here's an example that shows how to compose the `Carousel` component with other components to create a property card carousel.",
  ),
};
export const ProgressText: Story = { render: CarouselWithProgressText };
export const SlidesPerPage: Story = { render: CarouselSlidesPerPage };
export const SlidesPerMove: Story = { render: CarouselSlidesPerMove };
export const _Explorer: Story = { render: CarouselExplorerDemo };
