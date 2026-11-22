import { type JSX } from '@solidjs/web';
import { DownloadIcon, ImageDownIcon } from '@lucide/solid';
import { Button, DownloadTrigger, FormatByte } from '../../src';

const textData = 'The quick brown fox jumps over the lazy dog';
const svgData = String.raw`
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"/>
</svg>
`;

/** Fetch the image only when the download is activated. */
async function loadReferenceImage(): Promise<Blob> {
  const response = await fetch('/demo-images/scenes/mountains.webp');
  if (!response.ok) throw new Error(`Image download failed: ${response.status}`);
  return response.blob();
}

/** Show the plain text download. */
export function DownloadTriggerBasic(): JSX.Element {
  return (
    <DownloadTrigger
      data={textData}
      fileName="sample.txt"
      mimeType="text/plain"
      asChild={
        /** Put the download behavior on the outline button. */
        (getProps) => (
          <Button {...getProps()} variant="outline">
            Download text file
          </Button>
        )
      }
    />
  );
}

/** Show the same download with its formatted size. */
export function DownloadTriggerWithFileSize(): JSX.Element {
  return (
    <DownloadTrigger
      data={textData}
      fileName="sample.txt"
      mimeType="text/plain"
      asChild={
        /** Put the download behavior on the button with the byte count. */
        (getProps) => (
          <Button {...getProps()} variant="outline">
            <DownloadIcon /> Download (
            <FormatByte value={textData.length} unitDisplay="narrow" />)
          </Button>
        )
      }
    />
  );
}

/** Show a downloadable SVG document. */
export function DownloadTriggerSvg(): JSX.Element {
  return (
    <DownloadTrigger
      data={svgData}
      fileName="sample.svg"
      mimeType="image/svg+xml"
      asChild={
        /** Put the download behavior on the outline button. */
        (getProps) => (
          <Button {...getProps()} variant="outline">
            Download SVG
          </Button>
        )
      }
    />
  );
}

/** Show an image payload resolved asynchronously on activation. */
export function DownloadTriggerWithPromise(): JSX.Element {
  return (
    <DownloadTrigger
      data={loadReferenceImage}
      fileName="mountains.webp"
      mimeType="image/webp"
      asChild={
        /** Put the download behavior on the icon button. */
        (getProps) => (
          <Button {...getProps()} variant="outline">
            <ImageDownIcon /> Download
          </Button>
        )
      }
    />
  );
}
