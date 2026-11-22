import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  FloatingPanelBody,
  FloatingPanelContent,
  FloatingPanelPositioner,
  FloatingPanelRoot,
  FloatingPanelTitle,
  Portal,
} from '../src';

/** Exercise native CSS customization and part-level opt-out across a portal. */
function FloatingPanelCssExample(): JSX.Element {
  return (
    <>
      <FloatingPanelRoot defaultOpen defaultPosition={{ x: 80, y: 80 }}>
        <Portal>
          <FloatingPanelPositioner>
            <FloatingPanelContent
              class="consumer-content"
              style={{ 'min-height': '123px' }}
              data-testid="floating-css-content"
            >
              <FloatingPanelTitle>Styled panel</FloatingPanelTitle>
              <FloatingPanelBody unstyled data-testid="floating-css-bare-body">
                Bare body
              </FloatingPanelBody>
            </FloatingPanelContent>
          </FloatingPanelPositioner>
        </Portal>
      </FloatingPanelRoot>
      <FloatingPanelRoot defaultOpen unstyled defaultPosition={{ x: 440, y: 80 }}>
        <Portal>
          <FloatingPanelPositioner>
            <FloatingPanelContent data-testid="floating-css-bare-content">
              Bare panel
            </FloatingPanelContent>
          </FloatingPanelPositioner>
        </Portal>
      </FloatingPanelRoot>
    </>
  );
}

const meta = {
  title: 'Internal/Floating Panel CSS',
  component: FloatingPanelCssExample,
} satisfies Meta<typeof FloatingPanelCssExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
