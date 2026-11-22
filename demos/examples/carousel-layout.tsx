import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, ChevronUpIcon } from '@lucide/solid';
import { Box, Carousel, IconButton } from '../../src';

const items = Array.from({ length: 5 });

/** Stack slides vertically and rotate the navigation controls. */
export function CarouselVertical(): JSX.Element {
  return (
    <Carousel.Root
      orientation="vertical"
      count={items.length}
      class="carousel-example-xl carousel-example-vertical"
    >
      <Carousel.ItemGroup class="carousel-example-numbered-group carousel-example-grow">
        <For keyed={false} each={items}>
          {
            /** Keep the machine index stable while the visible page moves. */
            (_, index) => (
              <Carousel.Item index={index}>
                <Box
                  class="carousel-example-decorative carousel-example-square"
                  style={{ height: '100%' }}
                >
                  {index + 1}
                </Box>
              </Carousel.Item>
            )
          }
        </For>
      </Carousel.ItemGroup>
      <Carousel.Control class="carousel-example-gap-4 carousel-example-control-vertical">
        <Carousel.PrevTrigger
          asChild={
            /** Forward disabled state, event handlers, and refs to the IconButton. */
            (getProps) => (
              <IconButton {...getProps()} size="xs" variant="ghost">
                <ChevronUpIcon class="example-carousel-arrow-icon" />
              </IconButton>
            )
          }
        />
        <Carousel.Indicators />
        <Carousel.NextTrigger
          asChild={
            /** Forward disabled state, event handlers, and refs to the IconButton. */
            (getProps) => (
              <IconButton {...getProps()} size="xs" variant="ghost">
                <ChevronDownIcon class="example-carousel-arrow-icon" />
              </IconButton>
            )
          }
        />
      </Carousel.Control>
    </Carousel.Root>
  );
}

/** Position outline arrows beside the slide track. */
export function CarouselWithFloatingArrow(): JSX.Element {
  return (
    <Carousel.Root count={items.length} class="carousel-example-xl carousel-example-gap-4">
      <Carousel.Control class="carousel-example-control-center carousel-example-gap-4 carousel-example-full">
        <Carousel.PrevTrigger
          asChild={
            /** Forward disabled state, event handlers, and refs to the IconButton. */
            (getProps) => (
              <IconButton {...getProps()} size="xs" variant="outline">
                <ArrowLeftIcon class="example-carousel-arrow-icon" />
              </IconButton>
            )
          }
        />
        <Carousel.ItemGroup class="carousel-example-numbered-group carousel-example-full">
          <For keyed={false} each={items}>
            {
              /** Keep the machine index stable while the visible page moves. */
              (_, index) => (
                <Carousel.Item index={index}>
                  <Box class="carousel-example-decorative" style={{ height: '300px' }}>
                    {index + 1}
                  </Box>
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
                <ArrowRightIcon class="example-carousel-arrow-icon" />
              </IconButton>
            )
          }
        />
      </Carousel.Control>
      <Carousel.Indicators />
    </Carousel.Root>
  );
}

/** Show only the page indicators below the slide track. */
export function CarouselWithIndicators(): JSX.Element {
  return (
    <Carousel.Root count={items.length} class="carousel-example-md carousel-example-gap-4">
      <Carousel.ItemGroup class="carousel-example-numbered-group">
        <For keyed={false} each={items}>
          {
            /** Keep the machine index stable while the visible page moves. */
            (_, index) => (
              <Carousel.Item index={index}>
                <Box class="carousel-example-decorative" style={{ height: '300px' }}>
                  {index + 1}
                </Box>
              </Carousel.Item>
            )
          }
        </For>
      </Carousel.ItemGroup>
      <Carousel.Control class="carousel-example-control-center carousel-example-gap-4">
        <Carousel.Indicators />
      </Carousel.Control>
    </Carousel.Root>
  );
}
