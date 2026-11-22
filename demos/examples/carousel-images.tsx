import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/solid';
import { AspectRatio, Box, Carousel, IconButton, Image } from '../../src';
import './aspect-ratio-placements.css';

const scenicImages = [
  '/demo-images/scenes/product-headphones.webp',
  '/demo-images/scenes/product-watch.webp',
  '/demo-images/scenes/product-sunglasses.webp',
  '/demo-images/scenes/product-camera.webp',
  '/demo-images/scenes/product-backpack.webp',
  '/demo-images/scenes/product-sneaker.webp',
] as const;

/** Overlay arrows and animated indicators on the image carousel. */
export function CarouselWithImages(): JSX.Element {
  return (
    <Carousel.Root
      count={scenicImages.length}
      class="carousel-example-2xl carousel-example-gap-4 carousel-example-images"
    >
      <Carousel.Control class="carousel-example-gap-4 carousel-example-full carousel-example-relative">
        <Carousel.PrevTrigger
          asChild={
            /** Float the left arrow inside the image Carousel track. */
            (getProps) => (
              <IconButton
                {...getProps()}
                size="xs"
                variant="outline"
                style={{
                  'border-radius': 'var(--leverui-radii-full)',
                  position: 'absolute',
                  'z-index': '1',
                  background: 'var(--leverui-colors-bg)',
                  'inset-inline-start': 'var(--leverui-spacing-4)',
                }}
              >
                <ArrowLeftIcon class="example-carousel-arrow-icon" />
              </IconButton>
            )
          }
        />
        <Carousel.ItemGroup class="carousel-example-full">
          <For keyed={false} each={scenicImages}>
            {
              /** Keep image alt text and machine index aligned. */
              (src, index) => (
                <Carousel.Item index={index}>
                  <AspectRatio ratio={16 / 9} class="ratio-carousel-dialog-image">
                    <Image src={src()} alt={`Product ${index + 1}`} fit="contain" />
                  </AspectRatio>
                </Carousel.Item>
              )
            }
          </For>
        </Carousel.ItemGroup>
        <Carousel.NextTrigger
          asChild={
            /** Float the right arrow inside the image Carousel track. */
            (getProps) => (
              <IconButton
                {...getProps()}
                size="xs"
                variant="outline"
                style={{
                  'border-radius': 'var(--leverui-radii-full)',
                  position: 'absolute',
                  'z-index': '1',
                  background: 'var(--leverui-colors-bg)',
                  'inset-inline-end': 'var(--leverui-spacing-4)',
                }}
              >
                <ArrowRightIcon class="example-carousel-arrow-icon" />
              </IconButton>
            )
          }
        />
        <Box style={{ position: 'absolute', bottom: 'var(--leverui-spacing-6)', width: '100%' }}>
          <Carousel.Indicators class="carousel-example-image-indicator" />
        </Box>
      </Carousel.Control>
    </Carousel.Root>
  );
}
