import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Dialog, Portal } from '../src';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'cover', 'full'] as const;
const placements = ['center', 'top', 'bottom'] as const;
const scrollBehaviors = ['inside', 'outside'] as const;
const motionPresets = [
  'scale',
  'slide-in-bottom',
  'slide-in-top',
  'slide-in-left',
  'slide-in-right',
  'none',
] as const;

/** Resolve a native select value to one declared finite appearance choice. */
function findChoice<Choice extends string>(choices: readonly Choice[], value: string): Choice {
  const choice = choices.find(
    /** Match the selected option without widening its literal type. */
    (candidate) => candidate === value,
  );
  if (choice === undefined) throw new Error(`Unknown Dialog appearance choice: ${value}`);
  return choice;
}

/** Render the selectable Dialog appearance through its public CSS hooks. */
function DialogVisualCase(props: {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  size: () => (typeof sizes)[number];
  placement: () => (typeof placements)[number];
  scrollBehavior: () => (typeof scrollBehaviors)[number];
  motionPreset: () => (typeof motionPresets)[number];
  unstyled: () => boolean;
}): JSX.Element {
  /** Close the controlled Dialog after Escape or its close trigger. */
  function handleOpenChange(details: { open: boolean }): void {
    props.setOpen(details.open);
  }

  return (
    <Dialog.Root
      open={props.open()}
      onOpenChange={handleOpenChange}
      size={props.size()}
      placement={props.placement()}
      scrollBehavior={props.scrollBehavior()}
      motionPreset={props.motionPreset()}
      unstyled={props.unstyled()}
    >
      <Portal>
        <Dialog.Backdrop data-testid="dialog-css-backdrop" />
        <Dialog.Positioner data-testid="dialog-css-positioner">
          <Dialog.Content
            data-testid="dialog-css-content"
            class="consumer-dialog"
            style={{ 'border-color': 'rgb(40, 50, 60)' }}
          >
            <Dialog.Header data-testid="dialog-css-header">
              <Dialog.Title>Visual comparison</Dialog.Title>
              <Dialog.Description>Dialog appearance</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body data-testid="dialog-css-body">Content</Dialog.Body>
            <Dialog.Footer data-testid="dialog-css-footer">
              <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

/** Exercise every finite Dialog appearance from the CSS contract. */
function DialogCssContract(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [size, setSize] = createSignal<(typeof sizes)[number]>('md');
  const [placement, setPlacement] = createSignal<(typeof placements)[number]>('top');
  const [scrollBehavior, setScrollBehavior] =
    createSignal<(typeof scrollBehaviors)[number]>('outside');
  const [motionPreset, setMotionPreset] = createSignal<(typeof motionPresets)[number]>('scale');
  const [unstyled, setUnstyled] = createSignal(false);

  /** Read one selected finite size from its native control. */
  function changeSize(event: Event & { currentTarget: HTMLSelectElement }): void {
    setSize(findChoice(sizes, event.currentTarget.value));
  }

  /** Read one selected placement from its native control. */
  function changePlacement(event: Event & { currentTarget: HTMLSelectElement }): void {
    setPlacement(findChoice(placements, event.currentTarget.value));
  }

  /** Read one selected scroll choice from its native control. */
  function changeScrollBehavior(event: Event & { currentTarget: HTMLSelectElement }): void {
    setScrollBehavior(findChoice(scrollBehaviors, event.currentTarget.value));
  }

  /** Read one selected motion preset from its native control. */
  function changeMotionPreset(event: Event & { currentTarget: HTMLSelectElement }): void {
    setMotionPreset(findChoice(motionPresets, event.currentTarget.value));
  }

  /** Open the selected Dialog appearance. */
  function openDialog(): void {
    setOpen(true);
  }

  /** Toggle the native unstyled path without replacing the Dialog machine. */
  function changeUnstyled(event: Event & { currentTarget: HTMLInputElement }): void {
    setUnstyled(event.currentTarget.checked);
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', padding: '24px' }}>
        <select data-testid="dialog-css-size" onInput={changeSize}>
          {sizes.map(
            /** Expose each supported Dialog size to the visual check. */
            (value) => (
              <option value={value}>{value}</option>
            ),
          )}
        </select>
        <select data-testid="dialog-css-placement" onInput={changePlacement}>
          {placements.map(
            /** Expose each supported Dialog placement. */
            (value) => (
              <option value={value}>{value}</option>
            ),
          )}
        </select>
        <select data-testid="dialog-css-scroll" onInput={changeScrollBehavior}>
          {scrollBehaviors.map(
            /** Expose both scrolling modes. */
            (value) => (
              <option value={value}>{value}</option>
            ),
          )}
        </select>
        <select data-testid="dialog-css-motion" onInput={changeMotionPreset}>
          {motionPresets.map(
            /** Expose every entrance and exit motion preset. */
            (value) => (
              <option value={value}>{value}</option>
            ),
          )}
        </select>
        <button type="button" data-testid="dialog-css-open" onClick={openDialog}>
          Open dialog
        </button>
        <label>
          <input type="checkbox" data-testid="dialog-css-unstyled" onChange={changeUnstyled} />
          Unstyled
        </label>
      </div>
      <DialogVisualCase
        open={open}
        setOpen={setOpen}
        size={size}
        placement={placement}
        scrollBehavior={scrollBehavior}
        motionPreset={motionPreset}
        unstyled={unstyled}
      />
    </>
  );
}

const meta = {
  title: 'Internal/Dialog CSS Contract',
  component: DialogCssContract,
} satisfies Meta<typeof DialogCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: DialogCssContract };
