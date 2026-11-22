import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Toast, Toaster, createToaster } from '../src';

/** Expose styled and unstyled Toast paths under one primitive store. */
function ToastCssContract(): JSX.Element {
  const toaster = createToaster({ placement: 'bottom-end', duration: 30_000, max: 2 });

  /** Show the default authored CSS path. */
  function showStyled(): void {
    toaster.create({ title: 'Styled toast', type: 'success' });
  }

  /** Show an unstyled root while keeping its primitive lifecycle. */
  function showUnstyled(): void {
    toaster.create({ title: 'Unstyled toast', type: 'info' });
  }

  return (
    <>
      <button data-testid="toast-css-show-styled" onClick={showStyled}>
        Show styled toast
      </button>
      <button data-testid="toast-css-show-unstyled" onClick={showUnstyled}>
        Show unstyled toast
      </button>
      <Toaster toaster={toaster} data-testid="toast-css-region">
        {
          /** Keep one native root and title for each store item. */
          (item) => (
            <Toast.Root
              unstyled={item().type === 'info'}
              data-testid={item().type === 'info' ? 'toast-css-unstyled' : 'toast-css-styled'}
            >
              <Toast.Content>
                <Toast.Title unstyled={item().type === 'info'}>{item().title}</Toast.Title>
              </Toast.Content>
              <Toast.CloseTrigger />
            </Toast.Root>
          )
        }
      </Toaster>
    </>
  );
}

const meta = {
  title: 'Internal/Toast CSS',
  component: ToastCssContract,
} satisfies Meta<typeof ToastCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: ToastCssContract };
