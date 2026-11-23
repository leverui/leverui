import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Badge, ColorSwatch, ColorSwatchMix, ColorSwatchPropsProvider, Theme } from '../src';

const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inherit', 'full'] as const;
const shapes = ['square', 'circle', 'rounded'] as const;

/** Show the guide examples and mounted Color Swatch updates. */
function ColorSwatchMatrix(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [blue, setBlue] = createSignal(false);

  /** Change the provider's size without replacing descendants. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Change one swatch's color and shape in place. */
  function toggleColor(): void {
    setBlue(!blue());
  }

  return (
    <>
      <style>{`#swatch-css-override { --lui-swatch-color: rgb(102, 51, 153); --lui-swatch-checker-size: 4px; } #swatch-background-override { background: rgb(55, 66, 77); } #swatch-css-background { background: rgb(21, 33, 45); }`}</style>
      <div data-testid="swatch-matrix">
        <ColorSwatch value="red" data-testid="swatch-default" title="Red sample" />
        {sizes.map(
          /** Display each size inside a fixed parent box. */
          (size) => (
            <span
              style={{
                display: 'inline-flex',
                width: '48px',
                height: '48px',
                '--lui-swatch-size': '48px',
              }}
            >
              <ColorSwatch value="blue" size={size} data-testid={`swatch-${size}`} />
            </span>
          ),
        )}
        {shapes.map(
          /** Display each documented silhouette. */
          (shape) => (
            <ColorSwatch value="green" shape={shape} data-testid={`shape-${shape}`} />
          ),
        )}
        <ColorSwatch
          value="purple"
          size={{ base: 'xs', md: 'lg' }}
          shape={{ base: 'square', md: 'circle' }}
          data-testid="swatch-responsive"
        />
        <ColorSwatchMix
          items={['red', 'blue']}
          size={{ base: 'xs', md: 'lg' }}
          shape={{ base: 'square', md: 'circle' }}
          data-testid="mix-responsive"
        />
        <ColorSwatch value="rgba(255, 0, 0, 0.5)" data-testid="swatch-alpha" />
        <ColorSwatch value="transparent" data-testid="swatch-transparent" />
        <Badge>
          <ColorSwatch value="purple" size="xs" /> Purple
        </Badge>
        <ColorSwatchMix items={['red', 'blue']} data-testid="mix-two" />
        <ColorSwatchMix items={['red', 'green', 'blue']} data-testid="mix-three" />
        <ColorSwatchMix items={['red', 'green', 'blue', 'yellow']} data-testid="mix-four" />
        <ColorSwatchPropsProvider value={{ size: large() ? 'lg' : 'xs' }}>
          <ColorSwatch value="red" data-testid="swatch-inherited" />
          <ColorSwatch value="blue" size="sm" data-testid="swatch-fixed" />
        </ColorSwatchPropsProvider>
        <ColorSwatch
          value={blue() ? 'blue' : 'red'}
          shape={blue() ? 'circle' : 'square'}
          data-testid="swatch-reactive"
        />
        <ColorSwatch value="red" style={{ width: '32px' }} data-testid="swatch-css" />
        <ColorSwatch value="red" id="swatch-css-background" data-testid="swatch-css-background" />
        <ColorSwatch value="red" unstyled data-testid="swatch-unstyled" />
        <ColorSwatch value="red" id="swatch-css-override" />
        <ColorSwatch value="red" id="swatch-background-override" />
        <Theme appearance="dark" hasBackground={false}>
          <ColorSwatch value="transparent" data-testid="swatch-dark" />
          <Theme appearance="light" hasBackground={false}>
            <ColorSwatch value="transparent" data-testid="swatch-nested-light" />
          </Theme>
        </Theme>
        <button type="button" onClick={toggleSize} data-testid="swatch-size-toggle">
          Toggle size
        </button>
        <button type="button" onClick={toggleColor} data-testid="swatch-color-toggle">
          Toggle color
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Color Swatch',
  component: ColorSwatchMatrix,
} satisfies Meta<typeof ColorSwatchMatrix>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Matrix: Story = {};
