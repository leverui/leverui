import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  Avatar,
  AvatarGroup,
  AvatarRootProvider,
  useAvatar,
  type AvatarStatusChangeDetails,
} from '../src';

const loadedImage =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" fill="purple"/></svg>',
  );

/** Exercise image status, fallback content, group styling, and reactive defaults. */
function AvatarContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [name, setName] = createSignal('Ada Lovelace');
  const [source, setSource] = createSignal('data:image/png;base64,broken');
  const [status, setStatus] = createSignal('idle');
  const external = useAvatar({ id: 'external-avatar' });

  /** Toggle inherited size without remounting an Avatar root. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Change the visible initials through Solid's reactive name prop. */
  function toggleName(): void {
    setName(name() === 'Ada Lovelace' ? 'Grace Hopper' : 'Ada Lovelace');
  }

  /** Load a real image after initially displaying the fallback. */
  function loadImage(): void {
    setSource(loadedImage);
  }

  /** Expose the primitive's image status transition for browser verification. */
  function recordStatus(details: AvatarStatusChangeDetails): void {
    setStatus(details.status);
  }

  /** Record the native Avatar root delivered to the consumer ref. */
  function markRoot(element: HTMLDivElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  return (
    <>
      <div data-testid="avatar-contract">
        <Avatar.PropsProvider value={{ size: large() ? 'lg' : 'sm', variant: 'solid' }}>
          <Avatar.Root
            id="contract-avatar"
            ref={markRoot}
            colorPalette="blue"
            onStatusChange={recordStatus}
            data-testid="avatar-root"
          >
            <Avatar.Image src={source()} alt={name()} data-testid="avatar-image" />
            <Avatar.Fallback name={name()} data-testid="avatar-fallback" />
          </Avatar.Root>
          <Avatar.Root data-testid="avatar-icon-root">
            <Avatar.Fallback data-testid="avatar-icon-fallback" />
          </Avatar.Root>
          <Avatar.Root data-testid="avatar-custom-root">
            <Avatar.Fallback data-testid="avatar-custom-fallback">Custom</Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root data-testid="avatar-empty-child-root">
            <Avatar.Fallback name="Ada Lovelace" data-testid="avatar-empty-child-fallback">
              {0}
            </Avatar.Fallback>
          </Avatar.Root>
          <AvatarRootProvider value={external} data-testid="avatar-external-root">
            <Avatar.Fallback name="External Store" />
          </AvatarRootProvider>
          <Avatar.Root
            asChild={
              /** Keep the primitive root attributes on the consumer's section element. */
              (getProps) => (
                <section {...getProps({})} data-testid="avatar-child-root">
                  <Avatar.Fallback
                    asChild={
                      /** Keep fallback status attributes on a custom strong element. */
                      (getFallbackProps) => (
                        <strong {...getFallbackProps({})} data-testid="avatar-child-fallback">
                          Child fallback
                        </strong>
                      )
                    }
                  />
                </section>
              )
            }
          />
        </Avatar.PropsProvider>
        <AvatarGroup size="xs" variant="outline" data-testid="avatar-group">
          <Avatar.Root data-testid="avatar-group-first">
            <Avatar.Fallback name="First Person" />
          </Avatar.Root>
          <Avatar.Root data-testid="avatar-group-last">
            <Avatar.Fallback name="Last Person" />
          </Avatar.Root>
        </AvatarGroup>
        <button type="button" onClick={toggleSize} data-testid="avatar-size-toggle">
          Size
        </button>
        <button type="button" onClick={toggleName} data-testid="avatar-name-toggle">
          Name
        </button>
        <button type="button" onClick={loadImage} data-testid="avatar-image-toggle">
          Image
        </button>
        <output data-testid="avatar-status">{status()}</output>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Avatar',
  component: AvatarContractExample,
} satisfies Meta<typeof AvatarContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
