import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import {
  AspectRatio,
  Button,
  Carousel,
  CloseButton,
  Dialog,
  HStack,
  Image,
  IconButton,
  useCarouselContext,
} from '../../src';
import './aspect-ratio-placements.css';

const productImages = [
  '/demo-images/scenes/product-headphones.webp',
  '/demo-images/scenes/product-watch.webp',
  '/demo-images/scenes/product-sunglasses.webp',
  '/demo-images/scenes/product-camera.webp',
  '/demo-images/scenes/product-backpack.webp',
  '/demo-images/scenes/product-sneaker.webp',
] as const;

/** Jump to a product image by clicking its square thumbnail. */
function CarouselDialogThumbnails(): JSX.Element {
  const carousel = useCarouselContext();
  return (
    <HStack justify="center">
      <Carousel.ProgressText class="carousel-example-progress-margin" />
      <For keyed={false} each={productImages}>
        {
          /** Bind each thumbnail to its stable slide index. */
          (src, index) => (
            <AspectRatio
              ratio={1}
              class="ratio-carousel-thumb"
              onClick={
                /** Scroll the caller's Carousel machine to this thumbnail. */
                () => carousel().scrollToIndex(index)
              }
            >
              <Image
                src={src()}
                alt={`Product ${index + 1}`}
                style={{ width: '100%', height: '100%' }}
              />
            </AspectRatio>
          )
        }
      </For>
    </HStack>
  );
}

/** Open a full-screen product image Carousel inside a dialog. */
export function CarouselWithDialog(): JSX.Element {
  return (
    <Dialog.Root size="full">
      <Dialog.Trigger
        asChild={
          /** Forward the dialog trigger behavior to the button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              View product images
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content class="carousel-example-dialog-content">
            <Dialog.CloseTrigger
              asChild={
                /** Forward the dismissal behavior to a white close button. */
                (getProps) => <CloseButton {...getProps()} size="lg" style={{ color: 'white' }} />
              }
            />
            <Dialog.Body class="carousel-example-dialog-body">
              <Carousel.Root
                count={productImages.length}
                class="carousel-example-full carousel-example-height-full"
              >
                <Carousel.Control class="carousel-example-control-center carousel-example-gap-4 carousel-example-control-padding">
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
                  <Carousel.ItemGroup class="carousel-example-full">
                    <For keyed={false} each={productImages}>
                      {
                        /** Render one full-screen product image. */
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
                      /** Forward disabled state, event handlers, and refs to the IconButton. */
                      (getProps) => (
                        <IconButton {...getProps()} size="xs" variant="ghost">
                          <ChevronRightIcon class="example-carousel-arrow-icon" />
                        </IconButton>
                      )
                    }
                  />
                </Carousel.Control>
                <CarouselDialogThumbnails />
              </Carousel.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
