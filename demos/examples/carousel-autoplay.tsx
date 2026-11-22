import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from '@lucide/solid';
import { Box, Carousel, IconButton } from '../../src';

const items = Array.from({ length: 5 });

/** Show the explorer's progress, autoplay, and page indicators. */
export function CarouselExplorerDemo(): JSX.Element {
  return (
    <Carousel.Root count={items.length} spacing="20px" class="carousel-example-grow">
      <Carousel.ItemGroup class="carousel-example-numbered-group carousel-example-padding-2">
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
        <Carousel.ProgressText class="carousel-example-progress" />
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
