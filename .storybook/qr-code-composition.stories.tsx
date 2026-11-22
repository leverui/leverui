import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { QrCode, useQrCode } from '../src';

/** Mark the native element selected by a QR ref. */
function markRef(element: Element): void {
  element.setAttribute('data-qr-ref', element.tagName.toLowerCase());
}

/** Show selected tags, child renderers, refs, aliases, and native button states. */
function QrCodeComposition(): JSX.Element {
  const [clicks, setClicks] = createSignal(0);
  const [rootTag, setRootTag] = createSignal<'div' | 'section'>('div');
  const [providerTag, setProviderTag] = createSignal<'div' | 'article'>('div');
  const [overlayTag, setOverlayTag] = createSignal<'div' | 'strong'>('div');
  const external = useQrCode({ defaultValue: 'External selected root' });
  const reactiveExternal = useQrCode({
    defaultValue: 'Reactive external root',
    ids: { root: 'qr-reactive-provider-root', frame: 'qr-reactive-provider-frame' },
  });

  /** Record a consumer event on a selected root. */
  function recordClick(): void {
    setClicks(clicks() + 1);
  }

  /** Switch the owned root between its default and selected tags. */
  function toggleRootTag(): void {
    setRootTag(rootTag() === 'div' ? 'section' : 'div');
  }

  /** Switch the external root between its default and selected tags. */
  function toggleProviderTag(): void {
    setProviderTag(providerTag() === 'div' ? 'article' : 'div');
  }

  /** Switch a styled part while retaining its Zag overlay props. */
  function toggleOverlayTag(): void {
    setOverlayTag(overlayTag() === 'div' ? 'strong' : 'div');
  }

  return (
    <>
      <QrCode.Root
        as="section"
        value="Selected tags"
        ref={markRef}
        onClick={recordClick}
        data-testid="qr-tag-root"
      >
        <QrCode.Frame htmlWidth={96} htmlHeight={96} ref={markRef} data-testid="qr-tag-frame" />
        <QrCode.Overlay as="strong" ref={markRef} data-testid="qr-tag-overlay">
          UI
        </QrCode.Overlay>
        <QrCode.DownloadTrigger
          fileName="disabled.png"
          mimeType="image/png"
          disabled
          onClick={recordClick}
          data-testid="qr-disabled-download"
        >
          Disabled
        </QrCode.DownloadTrigger>
      </QrCode.Root>
      <QrCode.RootProvider
        as="article"
        value={external}
        ref={markRef}
        data-testid="qr-tag-provider"
      >
        <QrCode.Frame data-testid="qr-tag-provider-frame" />
      </QrCode.RootProvider>
      <QrCode.Root
        as={rootTag()}
        value="Reactive selected tags"
        ref={markRef}
        data-testid="qr-reactive-root"
      >
        <QrCode.Frame data-testid="qr-reactive-frame" />
        <QrCode.Overlay as={overlayTag()} ref={markRef} data-testid="qr-reactive-overlay">
          UI
        </QrCode.Overlay>
      </QrCode.Root>
      <QrCode.RootProvider
        as={providerTag()}
        value={reactiveExternal}
        ref={markRef}
        data-testid="qr-reactive-provider"
      >
        <QrCode.Frame data-testid="qr-reactive-provider-frame" />
      </QrCode.RootProvider>
      <button type="button" onClick={toggleRootTag} data-testid="qr-toggle-root-tag">
        Toggle root tag
      </button>
      <button type="button" onClick={toggleProviderTag} data-testid="qr-toggle-provider-tag">
        Toggle provider tag
      </button>
      <button type="button" onClick={toggleOverlayTag} data-testid="qr-toggle-overlay-tag">
        Toggle overlay tag
      </button>
      <QrCode.Root
        value="Consumer owned elements"
        ref={markRef}
        class="consumer-qr-root"
        asChild={
          /** Keep Zag root props on the selected section. */
          (getProps) => <section {...getProps({ ref: markRef })} data-testid="qr-child-root" />
        }
      >
        <QrCode.Frame
          asChild={
            /** Put the machine SVG props on a consumer owned frame. */
            (getProps) => (
              <svg {...getProps({})} data-testid="qr-child-frame">
                <QrCode.Pattern data-testid="qr-child-pattern" />
              </svg>
            )
          }
        />
        <QrCode.Overlay
          asChild={
            /** Put overlay positioning on a selected emphasis element. */
            (getProps) => (
              <em {...getProps({})} data-testid="qr-child-overlay">
                UI
              </em>
            )
          }
        />
        <QrCode.DownloadTrigger
          fileName="child.png"
          mimeType="image/png"
          asChild={
            /** Preserve native button semantics on a selected download control. */
            (getProps) => (
              <button {...getProps({})} data-testid="qr-child-download">
                Save
              </button>
            )
          }
        />
      </QrCode.Root>
      <output data-testid="qr-consumer-clicks">{clicks()}</output>
    </>
  );
}

const meta = {
  title: 'Content/QR Code Composition',
  component: QrCodeComposition,
} satisfies Meta<typeof QrCodeComposition>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
