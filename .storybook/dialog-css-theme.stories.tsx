import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Dialog, Portal, Theme } from '../src';
import './dialog-css-theme.css';

/** Show a Dialog whose portal destination inherits a changing Theme scope. */
function DialogCssTheme(): JSX.Element {
  const [appearance, setAppearance] = createSignal<'dark' | 'light'>('dark');
  const [container, setContainer] = createSignal<HTMLDivElement>();

  /** Save the destination inside the Theme's native element. */
  function captureContainer(element: HTMLDivElement): void {
    setContainer(element);
  }

  /** Switch the nearest color mode without replacing the Dialog root. */
  function toggleAppearance(): void {
    setAppearance(appearance() === 'dark' ? 'light' : 'dark');
  }

  return (
    <>
      <Theme appearance={appearance()} data-testid="dialog-theme-scope">
        <button type="button" onClick={toggleAppearance}>
          Toggle dialog appearance
        </button>
        <div ref={captureContainer} data-testid="dialog-theme-container" />
        <Dialog.Root>
          <Dialog.Trigger>Open scoped dialog</Dialog.Trigger>
          <Portal container={container}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content class="dialog-theme-override" data-testid="dialog-theme-content">
                <Dialog.Header>
                  <Dialog.Title>Scoped dialog</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>Theme colors follow the portal destination.</Dialog.Body>
                <Dialog.Footer>
                  <Dialog.CloseTrigger>Close scoped dialog</Dialog.CloseTrigger>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Theme>
    </>
  );
}

const meta = {
  title: 'Internal/Dialog CSS Theme',
  component: DialogCssTheme,
} satisfies Meta<typeof DialogCssTheme>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: DialogCssTheme };
