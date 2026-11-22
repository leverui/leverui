import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import * as Breadcrumb from '../src/components/breadcrumb';
import type {
  BreadcrumbLinkProps,
  BreadcrumbRootBaseProps,
} from '../src/components/breadcrumb-props';

type GetChildProps = Parameters<NonNullable<BreadcrumbLinkProps['asChild']>>[0];

/** Show consumer-owned content using the public link class. */
function BreadcrumbStyleProbe(): JSX.Element {
  return (
    <span class="leverui-breadcrumb__link" data-testid="breadcrumb-style-probe">
      Style probe
    </span>
  );
}

/** Exercise semantic parts, reactive defaults, custom children, and router links. */
function BreadcrumbContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Read provider size each time the surrounding signal changes. */
  function readDefaults(): BreadcrumbRootBaseProps {
    return { size: large() ? 'lg' : 'sm' };
  }

  /** Toggle inherited size without remounting the navigation landmark. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Mark the native anchor delivered through the Breadcrumb link ref. */
  function captureParent(element: HTMLAnchorElement): void {
    element.dataset.parentRef = 'true';
  }

  /** Mark the same anchor delivered through the caller-owned child ref. */
  function captureChild(element: HTMLElement): void {
    element.dataset.childRef = 'true';
  }

  /** Render a router-owned anchor while inheriting Breadcrumb link styles. */
  function renderRouterLink(getProps: GetChildProps): JSX.Element {
    return (
      <a {...getProps({ ref: captureChild })} href="#docs" data-testid="breadcrumb-router-link">
        Docs
      </a>
    );
  }

  return (
    <div style={{ padding: '80px', display: 'grid', gap: '40px' }}>
      <Breadcrumb.PropsProvider value={readDefaults}>
        <Breadcrumb.Root data-testid="breadcrumb-root">
          <Breadcrumb.List data-testid="breadcrumb-list">
            <Breadcrumb.Item data-testid="breadcrumb-home-item">
              <Breadcrumb.Link href="#home" data-testid="breadcrumb-home-link">
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator data-testid="breadcrumb-separator" />
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild={renderRouterLink} ref={captureParent} />
            </Breadcrumb.Item>
            <Breadcrumb.Separator data-testid="breadcrumb-custom-separator">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink data-testid="breadcrumb-current">
                Settings
              </Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
          <BreadcrumbStyleProbe />
        </Breadcrumb.Root>
        <button type="button" onClick={toggleSize} data-testid="breadcrumb-size-toggle">
          Toggle size
        </button>
        <Breadcrumb.Root
          size="md"
          variant="underline"
          colorPalette="blue"
          data-testid="breadcrumb-variant-root"
        >
          <Breadcrumb.List data-testid="breadcrumb-variant-list">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#more" data-testid="breadcrumb-variant-link">
                More
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Ellipsis data-testid="breadcrumb-ellipsis" />
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink>Current</Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <Breadcrumb.Root size={{ base: 'sm', md: 'lg' }} data-testid="breadcrumb-responsive-root">
          <Breadcrumb.List data-testid="breadcrumb-responsive-list">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#responsive">Responsive</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <Breadcrumb.Root variant={{ base: 'plain', md: 'underline' }}>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#responsive-variant" data-testid="breadcrumb-responsive-link">
                Responsive treatment
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <Breadcrumb.Root unstyled data-testid="breadcrumb-unstyled-root">
          <Breadcrumb.List data-testid="breadcrumb-unstyled-list">
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink>Unstyled</Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Breadcrumb.PropsProvider>
    </div>
  );
}

const meta = {
  title: 'Components/Breadcrumb',
  component: BreadcrumbContractExample,
} satisfies Meta<typeof BreadcrumbContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
