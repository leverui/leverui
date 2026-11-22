import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Carousel } from '../src';

const slides = ['One', 'Two', 'Three'];

/** Exercise pointer dragging across equal-width slides. */
function DragCarousel(): JSX.Element {
  return (
    <>
      <div style={{ padding: '80px', width: '500px' }}>
        <Carousel.Root allowMouseDrag count={slides.length} data-testid="carousel-drag-root">
          <Carousel.ItemGroup data-testid="carousel-drag-track">
            <For keyed={false} each={slides}>
              {
                /** Preserve each draggable slide's index. */
                (label, index) => (
                  <Carousel.Item index={index}>
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
          <Carousel.ProgressText data-testid="carousel-drag-progress" />
        </Carousel.Root>
      </div>
    </>
  );
}

/** Exercise auto-sized slides without a fixed item width. */
function VariableCarousel(): JSX.Element {
  return (
    <>
      <div style={{ padding: '80px', width: '500px' }}>
        <Carousel.Root autoSize count={3} spacing="16px" data-testid="carousel-variable-root">
          <Carousel.ItemGroup>
            <Carousel.Item index={0} style={{ width: '180px' }}>
              <div style={{ height: '120px', background: '#dbeafe' }}>Narrow</div>
            </Carousel.Item>
            <Carousel.Item index={1} style={{ width: '280px' }}>
              <div style={{ height: '120px', background: '#bfdbfe' }}>Wide</div>
            </Carousel.Item>
            <Carousel.Item index={2} style={{ width: '140px' }}>
              <div style={{ height: '120px', background: '#93c5fd' }}>Small</div>
            </Carousel.Item>
          </Carousel.ItemGroup>
          <Carousel.Control>
            <Carousel.NextTrigger data-testid="carousel-variable-next">Next</Carousel.NextTrigger>
            <Carousel.ProgressText data-testid="carousel-variable-progress" />
          </Carousel.Control>
        </Carousel.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Carousel/Drag',
  component: DragCarousel,
} satisfies Meta<typeof DragCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Mouse: Story = {};
export const Variable: Story = { render: VariableCarousel };
