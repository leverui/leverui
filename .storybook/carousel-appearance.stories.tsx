import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Carousel } from '../src';
import './carousel-appearance.css';

/** Show consumer CSS and the root's appearance-free mode. */
function CarouselAppearanceExample(): JSX.Element {
  return (
    <div>
      <Carousel.Root
        count={2}
        class="carousel-appearance-override"
        data-testid="carousel-override-root"
      >
        <Carousel.ItemGroup>
          <Carousel.Item index={0}>First</Carousel.Item>
          <Carousel.Item index={1}>Second</Carousel.Item>
        </Carousel.ItemGroup>
        <Carousel.Control>
          <Carousel.NextTrigger data-testid="carousel-override-next">Next</Carousel.NextTrigger>
          <Carousel.Indicators data-testid="carousel-override-indicator" />
        </Carousel.Control>
      </Carousel.Root>
      <Carousel.Root count={2} unstyled data-testid="carousel-unstyled-root">
        <Carousel.ItemGroup>
          <Carousel.Item index={0}>First</Carousel.Item>
          <Carousel.Item index={1}>Second</Carousel.Item>
        </Carousel.ItemGroup>
        <Carousel.Control>
          <Carousel.NextTrigger data-testid="carousel-unstyled-next">Next</Carousel.NextTrigger>
          <Carousel.Indicators data-testid="carousel-unstyled-indicator" />
          <Carousel.ProgressText data-testid="carousel-unstyled-progress" />
        </Carousel.Control>
      </Carousel.Root>
    </div>
  );
}

/** Keep an inner horizontal Carousel independent of its vertical parent. */
function NestedCarouselExample(): JSX.Element {
  return (
    <Carousel.Root orientation="vertical" count={1} style={{ width: '320px', height: '240px' }}>
      <Carousel.ItemGroup>
        <Carousel.Item index={0}>
          <Carousel.Root count={2} data-testid="carousel-inner-root">
            <Carousel.ItemGroup>
              <Carousel.Item index={0}>First</Carousel.Item>
              <Carousel.Item index={1}>Second</Carousel.Item>
            </Carousel.ItemGroup>
            <Carousel.Control data-testid="carousel-inner-control">
              <Carousel.NextTrigger data-testid="carousel-inner-next">Next</Carousel.NextTrigger>
              <Carousel.Indicators data-testid="carousel-inner-indicator" />
              <Carousel.ProgressText data-testid="carousel-inner-progress" />
            </Carousel.Control>
          </Carousel.Root>
        </Carousel.Item>
      </Carousel.ItemGroup>
    </Carousel.Root>
  );
}

const meta = {
  title: 'Components/Carousel/Appearance',
  component: CarouselAppearanceExample,
} satisfies Meta<typeof CarouselAppearanceExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const CSS: Story = {};
export const Nested: Story = { render: NestedCarouselExample };
