import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Carousel } from '../src';

/** Exercise autoplay controls and the play/pause shortcut. */
function AutoplayCarousel(): JSX.Element {
  return (
    <>
      <div style={{ padding: '80px', width: '500px' }}>
        <Carousel.Root autoPlay={{ delay: 60_000 }} count={3} data-testid="carousel-autoplay-root">
          <Carousel.ItemGroup>
            <For keyed={false} each={['One', 'Two', 'Three']}>
              {
                /** Bind each autoplay slide to its machine index. */
                (label, index) => (
                  <Carousel.Item index={index}>
                    <div style={{ height: '140px', background: '#dbeafe' }}>{label()}</div>
                  </Carousel.Item>
                )
              }
            </For>
          </Carousel.ItemGroup>
          <Carousel.Control>
            <Carousel.AutoplayTrigger data-testid="carousel-autoplay-trigger">
              <Carousel.AutoplayIndicator
                play={<span data-testid="carousel-play-icon">Play</span>}
                paused={<span data-testid="carousel-pause-icon">Pause</span>}
              />
            </Carousel.AutoplayTrigger>
            <Carousel.ProgressText data-testid="carousel-autoplay-progress" />
          </Carousel.Control>
        </Carousel.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Carousel/Autoplay',
  component: AutoplayCarousel,
} satisfies Meta<typeof AutoplayCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Toggle: Story = {};
