import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Carousel, type CarouselRootBaseProps } from '../src';

const slides = ['One', 'Two', 'Three'];

/** Exercise reactive machine defaults without replacing the Carousel root. */
function CarouselDefaultsExample(): JSX.Element {
  const [count, setCount] = createSignal(2);

  /** Supply current spacing and loop behavior from one accessor. */
  function readDefaults(): Partial<CarouselRootBaseProps> {
    return { loop: count() === 3, spacing: count() === 2 ? '8px' : '20px' };
  }

  /** Add the third slide without remounting the navigation machine. */
  function showThird(): void {
    setCount(3);
  }

  return (
    <>
      <div style={{ padding: '80px', width: '500px' }}>
        <Carousel.PropsProvider value={readDefaults}>
          <Carousel.Root count={count()} data-testid="carousel-defaults-root">
            <Carousel.ItemGroup>
              <For keyed={false} each={slides.slice(0, count())}>
                {
                  /** Keep each current slide at its machine index. */
                  (label, index) => (
                    <Carousel.Item index={index}>
                      <div style={{ height: '120px', background: '#dbeafe' }}>{label()}</div>
                    </Carousel.Item>
                  )
                }
              </For>
            </Carousel.ItemGroup>
            <Carousel.Control>
              <Carousel.PrevTrigger data-testid="carousel-defaults-prev">
                Previous
              </Carousel.PrevTrigger>
              <Carousel.Indicators data-testid="carousel-defaults-indicator" />
              <Carousel.ProgressText data-testid="carousel-defaults-progress" />
            </Carousel.Control>
          </Carousel.Root>
        </Carousel.PropsProvider>
        <button type="button" onClick={showThird} data-testid="carousel-defaults-toggle">
          Show third
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Carousel/Defaults',
  component: CarouselDefaultsExample,
} satisfies Meta<typeof CarouselDefaultsExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Reactive: Story = {};
