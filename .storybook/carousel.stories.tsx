import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Carousel } from '../src';

const slides = ['One', 'Two', 'Three', 'Four'];

/** Exercise native slide, control, indicator, and progress semantics. */
function CarouselContractExample(): JSX.Element {
  return (
    <>
      <div style={{ padding: '80px', width: '520px' }}>
        <Carousel.Root count={slides.length} data-testid="carousel-root">
          <Carousel.ItemGroup data-testid="carousel-item-group">
            <For keyed={false} each={slides}>
              {
                /** Keep each slide's machine index stable. */
                (label, index) => (
                  <Carousel.Item index={index} data-testid={`carousel-item-${index}`}>
                    <div
                      style={{
                        height: '180px',
                        display: 'grid',
                        'place-items': 'center',
                        background: '#dbeafe',
                      }}
                    >
                      {label()}
                    </div>
                  </Carousel.Item>
                )
              }
            </For>
          </Carousel.ItemGroup>
          <Carousel.Control data-testid="carousel-control">
            <Carousel.PrevTrigger
              data-testid="carousel-prev"
              style={{ width: '24px', height: '24px' }}
            />
            <Carousel.Indicators data-testid="carousel-indicator" />
            <Carousel.NextTrigger
              data-testid="carousel-next"
              style={{ width: '24px', height: '24px' }}
            />
            <Carousel.ProgressText data-testid="carousel-progress" />
          </Carousel.Control>
        </Carousel.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Carousel',
  component: CarouselContractExample,
} satisfies Meta<typeof CarouselContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
