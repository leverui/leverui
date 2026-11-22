import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Image, type ImageProps } from '../src';
import './image-story.css';

type GetImageProps = Parameters<NonNullable<ImageProps['asChild']>>[0];

const imageSource =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"%3E%3Crect width="100" height="100" fill="red"/%3E%3Crect x="100" width="100" height="100" fill="blue"/%3E%3C/svg%3E';

/** Exercise Image defaults, native attributes, styling, and Solid composition. */
function ImageContractExample(): JSX.Element {
  const [active, setActive] = createSignal(false);
  const [loads, setLoads] = createSignal(0);

  /** Record the native image supplied to a consumer ref. */
  function markImage(element: HTMLImageElement): void {
    element.dataset.imageRef = element.tagName.toLowerCase();
  }

  /** Record the parent ref when an image is rendered through asChild. */
  function markParentImage(element: Element): void {
    element.setAttribute('data-parent-image-ref', element.tagName.toLowerCase());
  }

  /** Record the child ref on the same rendered image. */
  function markChildImage(element: Element): void {
    element.setAttribute('data-child-image-ref', element.tagName.toLowerCase());
  }

  /** Count native load events from the data image. */
  function countLoad(): void {
    setLoads(
      /** Count each completed native image load. */
      (count) => count + 1,
    );
  }

  /** Update aliases and responsive styles without replacing the image. */
  function toggleImage(): void {
    setActive(!active());
  }

  /** Render one native image with merged parent and child attributes. */
  function renderChild(getProps: GetImageProps): JSX.Element {
    return (
      <img
        {...getProps({ class: 'child-image', ref: markChildImage })}
        src={imageSource}
        data-testid="image-child"
      />
    );
  }

  return (
    <section>
      <Image
        src={imageSource}
        alt="Two color image"
        class="consumer-image named-image"
        htmlWidth={200}
        htmlHeight={100}
        style={{ width: '120px', height: '120px' }}
        loading="lazy"
        decoding="async"
        ref={markImage}
        onLoad={countLoad}
        data-testid="image-default"
      />
      <Image
        src={imageSource}
        alt="Fitted image"
        fit={active() ? 'fill' : 'contain'}
        align={active() ? 'right bottom' : 'left top'}
        style={{ width: '140px', height: '90px' }}
        data-testid="image-fit"
      />
      <Image
        src={imageSource}
        alt="Direct style override"
        fit="contain"
        style={{ 'object-fit': 'fill', width: '100px', height: '100px' }}
        data-testid="image-direct-fit"
      />
      <Image
        src={imageSource}
        alt="Circular image"
        style={{ width: '90px', height: '90px', 'border-radius': '9999px' }}
        data-testid="image-circular"
      />
      <Image
        src={imageSource}
        alt="Aspect image"
        style={{ width: '140px', 'aspect-ratio': '1' }}
        data-testid="image-aspect"
      />
      <Image
        src={imageSource}
        alt="Responsive image"
        class="image-story-responsive"
        data-testid="image-responsive"
      />
      <Image
        src={imageSource}
        alt="Responsive fit image"
        fit={{ base: 'cover', md: 'contain' }}
        align={{ base: 'left top', md: 'right bottom' }}
        style={{ width: '100px', height: '100px' }}
        data-testid="image-responsive-fit"
      />
      <Image src={imageSource} alt="Unstyled image" unstyled data-testid="image-unstyled" />
      <Image
        asChild={renderChild}
        alt="Child image"
        fit="contain"
        style={{ width: active() ? '130px' : '90px' }}
        ref={markParentImage}
      />
      <Image as="a" href="#image-target" data-testid="image-link">
        Image link
      </Image>
      <button type="button" onClick={toggleImage} data-testid="image-toggle">
        Change image
      </button>
      <output data-testid="image-loads">{loads()}</output>
      <span id="image-target">Target</span>
    </section>
  );
}

const meta = {
  title: 'Layout/Image',
  component: ImageContractExample,
} satisfies Meta<typeof ImageContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
