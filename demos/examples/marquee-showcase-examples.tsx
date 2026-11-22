import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Avatar, Card, Marquee, Stack } from '../../src';
import { imageColumns, testimonials, type Testimonial } from './marquee-showcase-data';
import './marquee-examples.css';
import { Star } from '@lucide/solid';

/** Build one vertical column of the image gallery. */
function GalleryColumn(props: { photos: readonly string[]; side: 'top' | 'bottom' }): JSX.Element {
  return (
    <Marquee.Root side={props.side} class="example-marquee-gallery-column" autoFill>
      <Marquee.Viewport>
        <Marquee.Content>
          <For each={props.photos}>
            {
              /** Keep each photo in its own measured vertical item. */
              (photo, index) => (
                <Marquee.Item class="example-marquee-gallery-item">
                  <img
                    src={photo}
                    alt={`Gallery image ${index() + 1}`}
                    class="example-marquee-gallery-image"
                  />
                </Marquee.Item>
              )
            }
          </For>
        </Marquee.Content>
      </Marquee.Viewport>
    </Marquee.Root>
  );
}

/** Angle three alternating vertical photo tracks with perspective. */
export function MarqueeImageGallery(): JSX.Element {
  return (
    <div class="example-marquee-gallery">
      <div class="example-marquee-gallery-columns">
        <GalleryColumn photos={imageColumns[0]} side="top" />
        <GalleryColumn photos={imageColumns[1]} side="bottom" />
        <GalleryColumn photos={imageColumns[2]} side="top" />
      </div>
    </div>
  );
}

/** Render one testimonial card with rating, quote, and author. */
function TestimonialCard(props: { item: Testimonial }): JSX.Element {
  return (
    <Card.Root class="example-marquee-testimonial">
      <Card.Body>
        <Stack gap="3">
          <div class="example-marquee-rating" aria-label={`${props.item.rating} stars`}>
            <For each={Array.from({ length: 5 })}>
              {
                /** Draw one rating star. */
                () => <Star />
              }
            </For>
          </div>
          <Card.Description class="example-marquee-quote">
            &quot;{props.item.content}&quot;
          </Card.Description>
          <div class="example-marquee-author">
            <Avatar.Root size="sm">
              <Avatar.Image src={props.item.avatar} />
              <Avatar.Fallback name={props.item.name} />
            </Avatar.Root>
            <div class="example-marquee-author-text">
              <div class="example-marquee-author-name">{props.item.name}</div>
              <div class="example-marquee-author-role">{props.item.role}</div>
            </div>
          </div>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

/** Scroll five customer testimonials between two edge fades. */
export function MarqueeTestimonials(): JSX.Element {
  return (
    <Marquee.Root pauseOnInteraction class="example-marquee-testimonials">
      <Marquee.Edge side="start" />
      <Marquee.Viewport>
        <Marquee.Content>
          <For each={testimonials}>
            {
              /** Preserve the card order. */
              (item) => (
                <Marquee.Item class="example-marquee-testimonial-item">
                  <TestimonialCard item={item} />
                </Marquee.Item>
              )
            }
          </For>
        </Marquee.Content>
      </Marquee.Viewport>
      <Marquee.Edge side="end" />
    </Marquee.Root>
  );
}
