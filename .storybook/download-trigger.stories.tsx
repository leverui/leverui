import { createSignal, type Setter } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button, DownloadTrigger, FormatByte, useDownload } from '../src';

const text = 'The quick brown fox jumps over the lazy dog';
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="red"/></svg>';

/** Download plain text through the native Lever UI button. */
function BasicDownload(): JSX.Element {
  return (
    <DownloadTrigger
      data={text}
      fileName="sample.txt"
      mimeType="text/plain"
      class="download-override"
    >
      Download txt
    </DownloadTrigger>
  );
}

const meta = {
  title: 'Components/Download Trigger',
  component: BasicDownload,
} satisfies Meta<typeof BasicDownload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: BasicDownload };

/** Render the trigger as a styled Button without nesting buttons. */
function StyledDownload(): JSX.Element {
  /** Mark the actual native button received by the caller's ref. */
  function captureButton(element: Element): void {
    element.setAttribute('data-download-ref', element.tagName);
  }

  return (
    <>
      <DownloadTrigger
        data={text}
        fileName="styled.txt"
        mimeType="text/plain"
        ref={captureButton}
        asChild={
          /** Put download behavior on the styled child element. */
          (getProps) => (
            <Button {...getProps()} variant="outline" data-testid="styled-download">
              Download txt
            </Button>
          )
        }
      />
    </>
  );
}

export const StyledButton: Story = { render: StyledDownload };

/** Preserve the requested SVG content and MIME type. */
function SvgDownload(): JSX.Element {
  return (
    <>
      <DownloadTrigger data={svg} fileName="circle.svg" mimeType="image/svg+xml">
        Download svg
      </DownloadTrigger>
    </>
  );
}

export const Svg: Story = { render: SvgDownload };

/** Resolve a Blob only after the user activates the trigger. */
function AsyncDownload(): JSX.Element {
  const [requests, setRequests] = createSignal(0);

  /** Make a local async payload without depending on network access. */
  async function loadData(): Promise<Blob> {
    setRequests(
      /** Count each request started by the download action. */
      (count) => count + 1,
    );
    return new Blob(['async content'], { type: 'text/plain' });
  }

  return (
    <>
      <DownloadTrigger data={loadData} fileName="async.txt" mimeType="text/plain">
        Download async
      </DownloadTrigger>
      <output data-testid="download-requests">{requests()}</output>
    </>
  );
}

export const PromiseData: Story = { render: AsyncDownload };

/** Keep data, name, and visible file size synchronized with Solid state. */
function ReactiveDownload(): JSX.Element {
  const [expanded, setExpanded] = createSignal(false);
  /** Read the current payload only when its size or download is requested. */
  const data = () => (expanded() ? `${text} again` : text);

  /** Switch the selected content before downloading. */
  function toggleContent(): void {
    setExpanded(!expanded());
  }

  return (
    <>
      <button type="button" onClick={toggleContent}>
        Switch content
      </button>
      <DownloadTrigger
        data={data}
        fileName={expanded() ? 'expanded.txt' : 'sample.txt'}
        mimeType="text/plain"
      >
        Download (<FormatByte value={data().length} unitDisplay="narrow" />)
      </DownloadTrigger>
    </>
  );
}

export const FileSize: Story = { render: ReactiveDownload };

/** Expose the primitive's imperative hook without rendering the trigger component. */
function HookDownload(): JSX.Element {
  const { download } = useDownload({ data: text, fileName: 'hook.txt', mimeType: 'text/plain' });
  return (
    <>
      <button type="button" onClick={download}>
        Download with hook
      </button>
    </>
  );
}

export const Hook: Story = { render: HookDownload };

/** Allow a caller to cancel the download from its click handler. */
function CancelledDownload(): JSX.Element {
  const [clicks, setClicks] = createSignal(0);

  /** Record a bound click while preventing the default file action. */
  function cancelDownload(updateClicks: Setter<number>, event: MouseEvent): void {
    updateClicks(
      /** Count activations even when the file action is cancelled. */
      (count) => count + 1,
    );
    event.preventDefault();
  }

  return (
    <>
      <DownloadTrigger
        data={text}
        fileName="cancelled.txt"
        mimeType="text/plain"
        onClick={[cancelDownload, setClicks]}
      >
        Cancel download
      </DownloadTrigger>
      <output data-testid="cancelled-clicks">{clicks()}</output>
    </>
  );
}

export const Cancelled: Story = { render: CancelledDownload };

/** Keep a disabled trigger visible without allowing an activation. */
function DisabledDownload(): JSX.Element {
  return (
    <>
      <DownloadTrigger data={text} fileName="disabled.txt" mimeType="text/plain" disabled>
        Disabled download
      </DownloadTrigger>
    </>
  );
}

export const Disabled: Story = { render: DisabledDownload };
