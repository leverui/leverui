import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Container, ContainerPropsProvider, type ContainerProps } from '../src';
import './container-contract.css';

type GetChildProps = Parameters<NonNullable<ContainerProps['asChild']>>[0];

/** Render a native link with Container styles and attributes. */
function renderContainerLink(getProps: GetChildProps): JSX.Element {
  return (
    <a {...getProps()} href="#container-target" data-testid="container-link">
      Container link
    </a>
  );
}

/** Exercise the default appearance, variants, provider, and native element paths. */
function ContainerContractExample(): JSX.Element {
  const [fluid, setFluid] = createSignal(false);

  /** Record the native section supplied through the public ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change the provider's fluid default without replacing its descendants. */
  function toggleFluid(): void {
    setFluid(!fluid());
  }

  return (
    <>
      <section data-testid="container-story">
        <Container data-testid="container-default">
          <span data-testid="container-default-child">Default content</span>
        </Container>
        <Container fluid data-testid="container-fluid">
          Fluid content
        </Container>
        <Container
          centerContent
          class="container-contract-centered"
          data-testid="container-centered"
        >
          <span data-testid="container-centered-child">Centered content</span>
        </Container>
        <Container class="container-contract-sized" data-testid="container-sized">
          Sized content
        </Container>
        <Container fluid={{ base: false, lg: true }} data-testid="container-responsive-fluid">
          Responsive fluid
        </Container>
        <Container unstyled data-testid="container-unstyled">
          Unstyled content
        </Container>
        <Container class="container-contract-custom" data-testid="container-custom-css">
          Custom CSS
        </Container>
        <ContainerPropsProvider value={() => ({ fluid: fluid() })}>
          <Container as="section" ref={markSection} data-testid="container-reactive">
            <span data-testid="container-reactive-child">Reactive content</span>
          </Container>
          <Container fluid={false} data-testid="container-instance-override">
            Instance override
          </Container>
        </ContainerPropsProvider>
        <Container asChild={renderContainerLink} aria-label="Container link" />
        <span id="container-target">Link target</span>
        <button type="button" onClick={toggleFluid} data-testid="container-toggle">
          Change provider fluid
        </button>
      </section>
    </>
  );
}

const meta = {
  title: 'Layout/Container',
  component: ContainerContractExample,
} satisfies Meta<typeof ContainerContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
