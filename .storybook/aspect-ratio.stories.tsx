import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { AspectRatio, type AspectRatioProps } from '../src';
import './aspect-ratio-contract.css';

type GetChildProps = Parameters<NonNullable<AspectRatioProps['asChild']>>[0];

const imageSource =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100"/%3E';

/** Render a caller-owned link with the ratio root's native attributes. */
function renderRatioLink(getProps: GetChildProps): JSX.Element {
  return <a {...getProps()} href="#ratio-target" data-testid="child-ratio" />;
}

/** Exercise media, responsive ratios, native refs, and reactive content. */
function AspectRatioContractExample(): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Record the selected section supplied through the component ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change one ratio while preserving its root and child elements. */
  function toggleRatio(): void {
    setWide(!wide());
  }

  return (
    <section class="aspect-ratio-contract" data-testid="aspect-ratio-story">
      <AspectRatio class="ratio-wide" data-testid="default-ratio">
        <div class="ratio-content" data-testid="default-content">
          Default
        </div>
      </AspectRatio>
      <AspectRatio ratio={16 / 9} class="ratio-wide" data-testid="image-ratio">
        <img src={imageSource} alt="Ratio illustration" data-testid="ratio-image" />
      </AspectRatio>
      <AspectRatio ratio={9 / 16} class="ratio-narrow" data-testid="video-ratio">
        <video muted aria-label="Ratio video" data-testid="ratio-video" />
      </AspectRatio>
      <AspectRatio ratio={{ base: 1, md: 16 / 9 }} class="ratio-wide" data-testid="map-ratio">
        <iframe title="Ratio map" srcdoc="<p>Map preview</p>" data-testid="ratio-map" />
      </AspectRatio>
      <AspectRatio ratio={[1, null, 16 / 9]} class="ratio-wide" data-testid="array-ratio">
        <div data-testid="array-content">Array ratio</div>
      </AspectRatio>
      <AspectRatio asChild={renderRatioLink} class="ratio-wide">
        <span data-testid="child-ratio-content">Ratio link</span>
      </AspectRatio>
      <AspectRatio
        as="section"
        ref={markSection}
        ratio={wide() ? 2 : 1}
        class="ratio-reactive"
        aria-label="Reactive ratio"
        data-testid="reactive-ratio"
      >
        <button type="button" data-testid="reactive-child">
          Reactive child
        </button>
      </AspectRatio>
      <button type="button" data-testid="ratio-toggle" onClick={toggleRatio}>
        Toggle ratio
      </button>
    </section>
  );
}

const meta = {
  title: 'Layout/Aspect Ratio',
  component: AspectRatioContractExample,
} satisfies Meta<typeof AspectRatioContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
