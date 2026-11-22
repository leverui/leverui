import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Button, Theme } from '../src';
import { renderCustomSystemsExample } from './custom-systems-example';
import './custom-systems.css';

/** Show two independently scoped CSS themes beside the default theme. */
function CustomSystemsStory(): JSX.Element {
  return renderCustomSystemsExample({ Box, Button, Theme });
}

/** Reapply the same CSS scope to content mounted under body. */
function ScopedPortalStory(): JSX.Element {
  return (
    <Theme appearance="light" hasBackground={false} class="css-scope-alpha" id="portal-source-root">
      <Button id="portal-source-button" colorPalette="blue">
        Source
      </Button>
      <Portal>
        <Theme appearance="light" hasBackground={false} class="css-scope-alpha" id="portal-bridge">
          <Button id="portalled-button" colorPalette="blue">
            Portalled
          </Button>
          <Theme appearance="dark" hasBackground={false}>
            <Box id="portalled-dark-bg" class="css-scope-background">
              Nested mode
            </Box>
          </Theme>
        </Theme>
      </Portal>
    </Theme>
  );
}

const meta = {
  title: 'Setup/Custom Systems',
  component: CustomSystemsStory,
} satisfies Meta<typeof CustomSystemsStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SideBySide: Story = {};

export const PortalBridge: Story = { render: ScopedPortalStory };
