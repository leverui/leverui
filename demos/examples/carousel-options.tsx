import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import { Box, Carousel, HStack, IconButton } from '../../src';

const items = Array.from({ length: 5 });

/** Show two numbered slides per visible page. */
export function CarouselSlidesPerPage(): JSX.Element {
  return (
    <Carousel.Root count={items.length} slidesPerPage={2} class="carousel-example-xl">
      <HStack
        textStyle="sm"
        style={{
          'margin-bottom': 'var(--leverui-spacing-4)',
        }}
      >
        {'slidesPerPage={2}'}
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

/** Advance one slide while retaining two slides per visible page. */
export function CarouselSlidesPerMove(): JSX.Element {
  return (
    <Carousel.Root
      count={items.length}
      slidesPerMove={1}
      slidesPerPage={2}
      class="carousel-example-xl"
    >
      <HStack
        textStyle="sm"
        style={{
          'margin-bottom': 'var(--leverui-spacing-4)',
        }}
      >
        {'slidesPerPage={2} + slidesPerMove={1}'}
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

/** Give the slide track a 48px gap and a fractional page width. */
export function CarouselSpacing(): JSX.Element {
  return (
    <Carousel.Root
      spacing="48px"
      slidesPerPage={1.5}
      count={items.length}
      class="carousel-example-xl"
    >
      <HStack
        textStyle="sm"
        style={{
          'margin-bottom': 'var(--leverui-spacing-4)',
        }}
      >
        {"spacing='48px'"}
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
