import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import { Box, Button, Carousel, IconButton, useCarousel } from '../../src';

const items = Array.from({ length: 5 });

/** Show a five-slide Carousel with centered chevrons and indicators. */
export function CarouselBasic(): JSX.Element {
  return (
    <Carousel.Root count={items.length} class="carousel-example-md">
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

/** Drive the active page from caller-owned Solid state. */
export function CarouselControlled(): JSX.Element {
  const [page, setPage] = createSignal(0);

  return (
    <Carousel.Root
      count={items.length}
      class="carousel-example-md"
      page={page()}
      onPageChange={
        /** Mirror the page change request into the controlled signal. */
        (details) => setPage(details.page)
      }
    >
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

/** Supply a caller-owned Carousel machine with an external jump action. */
export function CarouselWithStore(): JSX.Element {
  const carousel = useCarousel({ count: items.length });

  return (
    <Carousel.RootProvider value={carousel} class="carousel-example-xl">
      <Button
        variant="outline"
        onClick={
          /** Jump to the third indexed slide from outside the track controls. */
          () => carousel().scrollToIndex(2)
        }
      >
        Go to slide 3
      </Button>
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
    </Carousel.RootProvider>
  );
}
