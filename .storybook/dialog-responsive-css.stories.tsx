import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Dialog, Portal, type DialogRootProps } from '../src';

const selections = {
  up: { base: 'full', sm: 'cover', md: 'xs', lg: 'sm', xl: 'md', '2xl': 'lg' },
  array: ['full', 'cover', 'xs', 'sm', 'md', 'lg'],
  down: {
    base: 'md',
    '2xlDown': 'xl',
    xlDown: 'lg',
    lgDown: 'sm',
    mdDown: 'xs',
    smDown: 'cover',
  },
  mixed: { base: 'md', sm: 'cover', mdDown: 'full', md: 'lg', xlDown: 'xs', '2xl': 'sm' },
} as const satisfies Record<string, DialogRootProps['size']>;
type Selection = keyof typeof selections;

/** Render one portal case for responsive CSS checks. */
function ResponsiveDialogCase(props: {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  size: () => DialogRootProps['size'];
}): JSX.Element {
  /** Close the active case when the primitive reports dismissal. */
  function handleOpenChange(details: { open: boolean }): void {
    props.setOpen(details.open);
  }

  return (
    <Dialog.Root open={props.open()} onOpenChange={handleOpenChange} size={props.size()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner data-testid="dialog-responsive-positioner">
          <Dialog.Content data-testid="dialog-responsive-content">
            <Dialog.Title>Responsive Dialog</Dialog.Title>
            <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

/** Switch finite breakpoint patterns on one persistent Dialog machine. */
function DialogResponsiveCssContract(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [selection, setSelection] = createSignal<Selection>('up');

  /** Read the selected responsive pattern from the native control. */
  function changeSelection(event: Event & { currentTarget: HTMLSelectElement }): void {
    const value = event.currentTarget.value;
    if (value !== 'up' && value !== 'array' && value !== 'down' && value !== 'mixed') {
      throw new Error(`Unknown pattern: ${value}`);
    }
    setSelection(value);
  }

  /** Open the selected responsive Dialog. */
  function openDialog(): void {
    setOpen(true);
  }

  /** Keep the selected responsive object reactive for the mounted root. */
  function size(): DialogRootProps['size'] {
    return selections[selection()];
  }

  return (
    <>
      <select data-testid="dialog-responsive-selection" onInput={changeSelection}>
        <option value="up">Up</option>
        <option value="array">Array</option>
        <option value="down">Down</option>
        <option value="mixed">Mixed</option>
      </select>
      <button type="button" data-testid="dialog-responsive-open" onClick={openDialog}>
        Open dialog
      </button>
      <ResponsiveDialogCase open={open} setOpen={setOpen} size={size} />
    </>
  );
}

const meta = {
  title: 'Internal/Dialog Responsive CSS Contract',
  component: DialogResponsiveCssContract,
} satisfies Meta<typeof DialogResponsiveCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: DialogResponsiveCssContract };
