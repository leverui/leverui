import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, PauseIcon, PlayIcon } from '@lucide/solid';
import { Box, Carousel, HStack, IconButton } from '../../src';

const items = Array.from({ length: 5 });

/** Auto-advance five slides every two seconds with a pause toggle. */
export function CarouselWithAutoplay(): JSX.Element {
  return (
    <Carousel.Root autoPlay={{ delay: 2000 }} count={items.length} class="carousel-example-xl">
      <HStack
        textStyle="sm"
        style={{
          'margin-bottom': 'var(--leverui-spacing-4)',
        }}
      >
        <ClockIcon /> {'autoPlay={{ delay: 2000 }}'} or {'autoPlay={true}'}
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
      <Carousel.Control class="carousel-example-control-center carousel-example-gap-4">
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
        <Carousel.AutoplayTrigger
          asChild={
            /** Preserve the machine's toggle handler and current accessibility label. */
            (getProps) => (
              <IconButton {...getProps()} aria-label="Toggle autoplay" size="sm" variant="ghost">
                <Carousel.AutoplayIndicator paused={<PauseIcon />} play={<PlayIcon />} />
              </IconButton>
            )
          }
        />
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
