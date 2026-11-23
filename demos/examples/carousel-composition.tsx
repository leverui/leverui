import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@lucide/solid';
import { Badge, Box, Carousel, HStack, Icon, IconButton, Image, Span, Stack } from '../../src';
import { carouselProperties, type CarouselProperty } from './carousel-property-data';

/** Render one property with its image, price, and rating. */
function PropertyCard(props: { data: CarouselProperty }): JSX.Element {
  return (
    <Stack gap="3">
      <Box style={{ position: 'relative' }}>
        <Image
          src={props.data.image}
          alt={props.data.title}
          style={{ 'border-radius': 'var(--lui-radii-l2)', width: '100%', height: '200px' }}
          draggable={false}
        />
        {props.data.favorite && (
          <Badge
            size="sm"
            style={{
              position: 'absolute',
              top: 'var(--lui-spacing-2)',
              'inset-inline-start': 'var(--lui-spacing-2)',
            }}
          >
            Guest favorite
          </Badge>
        )}
      </Box>
      <Stack gap="1">
        <Span
          textStyle="sm"
          style={{
            'font-weight': 'var(--lui-font-weights-semibold)',
          }}
        >
          {props.data.title}
        </Span>
        <HStack
          textStyle="xs"
          style={{
            color: 'var(--lui-colors-fg-muted)',
          }}
        >
          <Span>
            ${props.data.price} for {props.data.nights} nights
          </Span>
          <HStack gap="1">
            <Icon style={{ color: 'var(--lui-colors-orange-solid)' }}>
              <StarIcon />
            </Icon>
            <Span style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>
              {props.data.rating}
            </Span>
          </HStack>
        </HStack>
      </Stack>
    </Stack>
  );
}

/** Show three rental cards per page with text and images. */
export function CarouselComposition(): JSX.Element {
  return (
    <Carousel.Root
      count={carouselProperties.length}
      slidesPerPage={3}
      class="carousel-example-gap-3"
    >
      <HStack justify="space-between">
        <Span style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>
          Popular homes this week
        </Span>
        <HStack>
          <Carousel.PrevTrigger
            asChild={
              /** Forward disabled state, event handlers, and refs to the IconButton. */
              (getProps) => (
                <IconButton {...getProps()} size="xs" variant="subtle">
                  <ChevronLeftIcon class="example-carousel-arrow-icon" />
                </IconButton>
              )
            }
          />
          <Carousel.NextTrigger
            asChild={
              /** Forward disabled state, event handlers, and refs to the IconButton. */
              (getProps) => (
                <IconButton {...getProps()} size="xs" variant="subtle">
                  <ChevronRightIcon class="example-carousel-arrow-icon" />
                </IconButton>
              )
            }
          />
        </HStack>
      </HStack>
      <Carousel.ItemGroup>
        <For keyed={false} each={carouselProperties}>
          {
            /** Keep each rental card paired with its machine index. */
            (property, index) => (
              <Carousel.Item index={index}>
                <PropertyCard data={property()} />
              </Carousel.Item>
            )
          }
        </For>
      </Carousel.ItemGroup>
    </Carousel.Root>
  );
}
