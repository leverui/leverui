import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import { Box, Carousel, HStack, IconButton } from '../../src';

const items = Array.from({ length: 5 });

/** Show the mouse-drag hint and enable pointer dragging. */
export function CarouselWithMouseDrag(): JSX.Element {
  return (
    <Carousel.Root count={items.length} class="carousel-example-xl" allowMouseDrag>
      <HStack
        textStyle="sm"
        style={{
          'margin-bottom': 'var(--lui-spacing-4)',
        }}
      >
        Click and drag to change slides
      </HStack>
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
      <Carousel.Control class="carousel-example-gap-4 carousel-example-control-center">
        <Carousel.PrevTrigger
          asChild={
            /** Forward disabled state, event handlers, and refs to the IconButton. */
            (getProps) => (
              <IconButton {...getProps()} size="xs" variant="ghost">
                <ChevronLeftIcon class="example-carousel-arrow-icon" />
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
                <ChevronRightIcon class="example-carousel-arrow-icon" />
              </IconButton>
            )
          }
        />
      </Carousel.Control>
    </Carousel.Root>
  );
}

/** Show active page progress between arrow buttons. */
export function CarouselWithProgressText(): JSX.Element {
  return (
    <Carousel.Root count={items.length} slidesPerPage={1.6} spacing="32px">
      <Carousel.ItemGroup class="carousel-example-numbered-group carousel-example-scroll-margin-12">
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
      <Carousel.Control class="carousel-example-gap-4">
        <Carousel.PrevTrigger
          asChild={
            /** Forward disabled state, event handlers, and refs to the IconButton. */
            (getProps) => (
              <IconButton {...getProps()} size="xs" variant="ghost">
                <ArrowLeftIcon class="example-carousel-arrow-icon" />
              </IconButton>
            )
          }
        />
        <Carousel.ProgressText />
        <Carousel.NextTrigger
          asChild={
            /** Forward disabled state, event handlers, and refs to the IconButton. */
            (getProps) => (
              <IconButton {...getProps()} size="xs" variant="ghost">
                <ArrowRightIcon class="example-carousel-arrow-icon" />
              </IconButton>
            )
          }
        />
      </Carousel.Control>
    </Carousel.Root>
  );
}
