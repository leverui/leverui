import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button, DownloadTrigger } from '../src';

interface ChildEventsExampleProps {
  cancel: boolean;
}

/** Show how a styled child's click runs before the trigger's click. */
function ChildEventsExample(props: ChildEventsExampleProps): JSX.Element {
  const [sequence, setSequence] = createSignal('');
  // Solid 2 defers signal reads until the next flush, so both handlers of one
  // click record into a plain list instead of reading the signal back.
  let events: string[] = [];

  /** Record the child action and optionally cancel the download. */
  function handleChildClick(event: MouseEvent): void {
    events = ['child'];
    setSequence(events.join(','));
    if (props.cancel) event.preventDefault();
  }

  /** Record the trigger action after the child has handled the click. */
  function handleTriggerClick(): void {
    events = [...events, 'parent'];
    setSequence(events.join(','));
  }

  return (
    <>
      <DownloadTrigger
        data="child event content"
        fileName="child-events.txt"
        mimeType="text/plain"
        onClick={handleTriggerClick}
        asChild={
          /** Merge the child's handler before applying the parent's download action. */
          (getProps) => (
            <Button {...getProps({ onClick: handleChildClick })} variant="outline">
              {props.cancel ? 'Cancel child download' : 'Download with child handler'}
            </Button>
          )
        }
      />
      <output data-testid="child-event-sequence">{sequence()}</output>
    </>
  );
}

/** Show a child callback that allows the download. */
function ComposedDownload(): JSX.Element {
  return <ChildEventsExample cancel={false} />;
}

/** Show a child callback that prevents the download. */
function CancelledDownload(): JSX.Element {
  return <ChildEventsExample cancel />;
}

const meta = {
  title: 'Components/Download Trigger Child Events',
  component: ComposedDownload,
} satisfies Meta<typeof ComposedDownload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Composed: Story = { render: ComposedDownload };
export const Cancelled: Story = { render: CancelledDownload };
