import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Carousel } from '../src';
import './carousel-orientation.css';

const slides = ['First', 'Second', 'Third'];

/** Show the vertical track and orientation-aware CSS parts. */
function VerticalCarousel(): JSX.Element {
  return (
    <>
      <div style={{ padding: '80px' }}>
        <Carousel.Root
          orientation="vertical"
          count={slides.length}
          spacing="12px"
          style={{ width: '280px', height: '280px' }}
          data-testid="carousel-vertical-root"
        >
          <Carousel.ItemGroup style={{ height: '220px' }} data-testid="carousel-vertical-track">
            <For keyed={false} each={slides}>
              {
                /** Keep each vertical slide's index stable. */
                (label, index) => (
                  <Carousel.Item index={index}>
                    <div style={{ height: '220px', background: '#dbeafe' }}>{label()}</div>
                  </Carousel.Item>
                )
              }
            </For>
          </Carousel.ItemGroup>
          <Carousel.Control data-testid="carousel-vertical-control">
            <Carousel.PrevTrigger data-testid="carousel-vertical-prev">
              Previous
            </Carousel.PrevTrigger>
            <Carousel.NextTrigger data-testid="carousel-vertical-next">Next</Carousel.NextTrigger>
            <Carousel.ProgressText data-testid="carousel-vertical-progress" />
          </Carousel.Control>
        </Carousel.Root>
      </div>
    </>
  );
}

/** Show machine snap points for two slides per page and move. */
function PagedCarousel(): JSX.Element {
  return (
    <>
      <div style={{ padding: '80px', width: '500px' }}>
        <Carousel.Root count={4} slidesPerPage={2} slidesPerMove={2}>
          <Carousel.ItemGroup>
            <For keyed={false} each={['One', 'Two', 'Three', 'Four']}>
              {
                /** Bind each slide to its original machine index. */
                (label, index) => (
                  <Carousel.Item index={index}>
                    <div style={{ height: '140px', background: '#dbeafe' }}>{label()}</div>
                  </Carousel.Item>
                )
              }
            </For>
          </Carousel.ItemGroup>
          <Carousel.Control>
            <Carousel.NextTrigger data-testid="carousel-paged-next">Next</Carousel.NextTrigger>
            <Carousel.Indicators data-testid="carousel-paged-indicator" />
            <Carousel.ProgressText data-testid="carousel-paged-progress" />
          </Carousel.Control>
        </Carousel.Root>
      </div>
    </>
  );
}

/** Resize an active Carousel through a consumer media query. */
function ResponsiveCarousel(): JSX.Element {
  return (
    <>
      <div style={{ padding: '40px' }}>
        <Carousel.Root
          count={slides.length}
          class="carousel-responsive-root"
          data-testid="carousel-responsive-root"
        >
          <Carousel.ItemGroup>
            <For keyed={false} each={slides}>
              {
                /** Keep the same slides mounted while their width changes. */
                (label, index) => (
                  <Carousel.Item index={index} data-testid={`carousel-responsive-item-${index}`}>
                    <div style={{ height: '120px', background: '#dbeafe' }}>{label()}</div>
                  </Carousel.Item>
                )
              }
            </For>
          </Carousel.ItemGroup>
          <Carousel.Control>
            <Carousel.NextTrigger data-testid="carousel-responsive-next">Next</Carousel.NextTrigger>
            <Carousel.ProgressText data-testid="carousel-responsive-progress" />
          </Carousel.Control>
        </Carousel.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Carousel/Orientation',
  component: VerticalCarousel,
} satisfies Meta<typeof VerticalCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Vertical: Story = {};
export const Paged: Story = { render: PagedCarousel };
export const Responsive: Story = { render: ResponsiveCarousel };
