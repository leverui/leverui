import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import { Carousel, Center, IconButton } from '../../src';

const items = [
  { width: '120px', label: 'Small' },
  { width: '200px', label: 'Medium size' },
  { width: '80px', label: 'XS' },
  { width: '250px', label: 'Large content here' },
  { width: '150px', label: 'Regular' },
] as const;

/** Measure five uneven slide widths instead of forcing equal cells. */
export function CarouselVariableSize(): JSX.Element {
  return (
    <Carousel.Root count={items.length} autoSize spacing="8px" class="carousel-example-xl">
      <Carousel.Control class="carousel-example-gap-4">
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
      <Carousel.ItemGroup>
        <For keyed={false} each={items}>
          {
            /** Keep each measured item tied to a stable machine index. */
            (item, index) => (
              <Carousel.Item index={index} snapAlign="center" class="carousel-example-auto-width">
                <Center
                  style={{
                    width: item().width,
                    height: '100px',
                    background: 'var(--leverui-colors-bg-emphasized)',
                    'border-radius': 'var(--leverui-radii-l2)',
                  }}
                >
                  {item().label}
                </Center>
              </Carousel.Item>
            )
          }
        </For>
      </Carousel.ItemGroup>
    </Carousel.Root>
  );
}
