import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Clipboard, Link, type ClipboardCopyStatusDetails } from '../src';

/** Exercise browser copy, native selection, custom slots, and child refs. */
function InteractiveClipboardStory(): JSX.Element {
  const [status, setStatus] = createSignal('idle');
  const machine = Clipboard.useClipboard({
    value: 'https://leverui.com/docs',
    timeout: 1000,
    translations: {
      /** Keep the accessible label distinct from the visible link value. */
      triggerLabel: (copied) => (copied ? 'Copied project link' : 'Copy project link'),
    },
    onStatusChange: recordStatus,
  });

  /** Record the copied status reported by Zag. */
  function recordStatus(details: ClipboardCopyStatusDetails): void {
    setStatus(details.copied ? 'copied' : 'idle');
  }

  /** Mark the caller-owned root after the primitive forwards its ref. */
  function captureRoot(element: Element): void {
    element.setAttribute('data-root-ref', 'attached');
  }

  /** Mark the caller-owned trigger after the primitive forwards its ref. */
  function captureTrigger(element: Element): void {
    element.setAttribute('data-trigger-ref', 'attached');
  }

  return (
    <>
      <Clipboard.RootProvider
        value={machine}
        ref={captureRoot}
        asChild={
          /** Render the machine root on a caller-owned section. */
          (getProps) => <section {...getProps()} data-testid="clipboard-child-root" />
        }
      >
        <Clipboard.Label data-testid="clipboard-child-label">Copy project link</Clipboard.Label>
        <Clipboard.Input
          asChild={
            /** Preserve selection on a caller-owned native input. */
            (getProps) => <input {...getProps()} data-testid="clipboard-child-input" />
          }
        />
        <Clipboard.Trigger
          ref={captureTrigger}
          asChild={
            /** Style a native button like a link without losing keyboard use. */
            (getProps) => (
              <Link as="button" {...getProps()} data-testid="clipboard-child-trigger">
                <Clipboard.Indicator copied={<strong>Done</strong>}>Ready</Clipboard.Indicator>
                <Clipboard.ValueText />
                <Clipboard.CopyText data-testid="clipboard-null-copy-text" copied={null} />
                <Clipboard.CopyText
                  data-testid="clipboard-custom-copy-text"
                  copied={<em>Saved</em>}
                />
              </Link>
            )
          }
        />
      </Clipboard.RootProvider>
      <output data-testid="clipboard-status">{status()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Clipboard Interactions',
  component: InteractiveClipboardStory,
} satisfies Meta<typeof InteractiveClipboardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChildRenderers: Story = { render: InteractiveClipboardStory };
