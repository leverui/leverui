import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Button, Theme } from '../src';
import './css-theme.css';

interface ThemeGalleryProps {
  branded?: boolean;
}

/** Compare default component styles with the same parts under CSS token overrides. */
function ThemeGallery(props: ThemeGalleryProps): JSX.Element {
  return (
    <>
      <Theme
        appearance={props.branded ? 'light' : undefined}
        class={props.branded ? 'brand-theme' : undefined}
        data-testid="theme-panel"
      >
        <Box class="css-theme-content" data-testid="theme-content">
          Theme colors
        </Box>
        <div class="css-theme-gallery">
          <Button colorPalette="blue" data-testid="solid-button">
            Solid
          </Button>
          <Button colorPalette="blue" variant="subtle" data-testid="subtle-button">
            Subtle
          </Button>
          <Button colorPalette="blue" variant="outline" data-testid="outline-button">
            Outline
          </Button>
          <Button colorPalette="blue" variant="ghost" data-testid="ghost-button">
            Ghost
          </Button>
          <Button colorPalette="blue" size="xs">
            Small
          </Button>
          <Button colorPalette="blue" size="lg">
            Large
          </Button>
          <Theme hasBackground={false} data-testid="inherited-theme">
            <Button colorPalette="blue" data-testid="nested-button">
              Inherited
            </Button>
          </Theme>
        </div>
      </Theme>
    </>
  );
}

const meta = {
  title: 'Setup/CSS Theme',
  component: ThemeGallery,
} satisfies Meta<typeof ThemeGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { branded: false } };

export const Brand: Story = { args: { branded: true } };
