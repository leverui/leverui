import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import { Carousel, IconButton, Image } from '../../src';

const landscapeImages = [
  {
    label: 'Mountain landscape',
    url: '/demo-images/scenes/mountains.webp',
  },
  {
    label: 'Forest path',
    url: '/demo-images/scenes/forest.webp',
  },
  {
    label: 'Ocean waves',
    url: '/demo-images/scenes/ocean.webp',
  },
  {
    label: 'Desert dunes',
    url: '/demo-images/scenes/desert.webp',
  },
  {
    label: 'Sunset lake',
    url: '/demo-images/scenes/sunset-lake.webp',
  },
] as const;

/** Navigate landscape slides through image thumbnails. */
export function CarouselWithThumbnails(): JSX.Element {
  return (
    <Carousel.Root
      count={landscapeImages.length}
      class="carousel-example-2xl carousel-example-gap-4"
    >
      <Carousel.Control class="carousel-example-control-center carousel-example-gap-4 carousel-example-full">
        <Carousel.PrevTrigger
          asChild={
            /** Forward disabled state, event handlers, and refs to the IconButton. */
            (getProps) => (
              <IconButton {...getProps()} size="xs" variant="outline">
                <ChevronLeftIcon class="example-carousel-arrow-icon" />
              </IconButton>
            )
          }
        />
        <Carousel.ItemGroup class="carousel-example-full">
          <For keyed={false} each={landscapeImages}>
            {
              /** Render one indexed landscape slide. */
              (item, index) => (
                <Carousel.Item index={index}>
                  <Image
                    style={{ 'aspect-ratio': '16 / 9', width: '100%', height: '100%' }}
                    src={item().url}
                    alt={item().label}
                  />
                </Carousel.Item>
              )
            }
          </For>
        </Carousel.ItemGroup>
        <Carousel.NextTrigger
          asChild={
            /** Forward disabled state, event handlers, and refs to the IconButton. */
            (getProps) => (
              <IconButton {...getProps()} size="xs" variant="outline">
                <ChevronRightIcon class="example-carousel-arrow-icon" />
              </IconButton>
            )
          }
        />
      </Carousel.Control>
      <Carousel.IndicatorGroup>
        <For keyed={false} each={landscapeImages}>
          {
            /** Highlight the thumbnail of the current slide. */
            (item, index) => (
              <Carousel.Indicator index={index} unstyled class="carousel-example-thumbnail">
                <Image
                  style={{ width: 'var(--leverui-spacing-20)', 'aspect-ratio': '16 / 9' }}
                  src={item().url}
                  alt={item().label}
                />
              </Carousel.Indicator>
            )
          }
        </For>
      </Carousel.IndicatorGroup>
    </Carousel.Root>
  );
}
