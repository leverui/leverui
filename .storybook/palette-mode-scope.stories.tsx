import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button, CodeBlock, DarkMode, IconButton, LightMode } from '../src';

/** Put palette-colored controls inside light and dark scopes that differ from the page. */
function PaletteModeScopeExample(): JSX.Element {
  return (
    <>
      <Button variant="ghost" data-testid="scope-page-button">
        Page
      </Button>
      <DarkMode>
        <Button variant="ghost" data-testid="scope-dark-button">
          Dark
        </Button>
        <LightMode>
          <Button variant="ghost" data-testid="scope-dark-light-button">
            Light inside dark
          </Button>
        </LightMode>
      </DarkMode>
      <CodeBlock.Root code="const copied = true">
        <CodeBlock.Header>
          <CodeBlock.Title>copy.ts</CodeBlock.Title>
          <IconButton variant="ghost" size="2xs" aria-label="Copy" data-testid="scope-code-button">
            C
          </IconButton>
        </CodeBlock.Header>
      </CodeBlock.Root>
      {/* A scope written as plain attributes sets no palette, so the palette around it applies. */}
      <div data-leverui-color-palette="blue">
        <div data-leverui-theme="" data-leverui-color-mode="dark">
          <Button variant="ghost" data-testid="scope-blue-dark-button">
            Blue, dark
          </Button>
        </div>
      </div>
      <div data-leverui-color-palette="red">
        <div data-leverui-color-palette="blue">
          <div data-leverui-theme="" data-leverui-color-mode="dark">
            <Button variant="ghost" data-testid="scope-red-blue-dark-button">
              Nearest palette, dark
            </Button>
          </div>
        </div>
      </div>
      {/* DarkMode is a Theme, which sets its own palette: gray unless told otherwise. */}
      <div data-leverui-color-palette="blue">
        <DarkMode>
          <Button variant="ghost" data-testid="scope-blue-theme-button">
            Theme resets the palette
          </Button>
        </DarkMode>
      </div>
      <DarkMode>
        <Button variant="ghost" colorPalette="blue" data-testid="scope-dark-own-palette-button">
          Own palette
        </Button>
      </DarkMode>
    </>
  );
}

const meta = {
  title: 'Internal/Palette Mode Scope',
  component: PaletteModeScopeExample,
} satisfies Meta<typeof PaletteModeScopeExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
