import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Card } from '../src';
import './card-guide.css';

const variants = ['elevated', 'outline', 'subtle'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

/** Show Card variants, sizes, parts, and reactive defaults. */
function CardMatrix(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change inherited size without replacing the root. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <div data-testid="card-matrix">
        {variants.map(
          /** Render one visual treatment with all main Card parts. */
          (variant) => (
            <Card.Root
              variant={variant}
              data-testid={`card-${variant}`}
              class="card-story-fixed-width"
            >
              <Card.Header data-testid={`card-${variant}-header`}>
                <Card.Title>Card title</Card.Title>
                <Card.Description>Card description</Card.Description>
              </Card.Header>
              <Card.Body data-testid={`card-${variant}-body`}>Card content</Card.Body>
              <Card.Footer data-testid={`card-${variant}-footer`}>Card actions</Card.Footer>
            </Card.Root>
          ),
        )}
        {sizes.map(
          /** Render each Card size for spacing and title scale checks. */
          (size) => (
            <Card.Root size={size} data-testid={`card-${size}`} class="card-story-fixed-width">
              <Card.Header data-testid={`card-${size}-header`}>
                <Card.Title data-testid={`card-${size}-title`}>{size} title</Card.Title>
              </Card.Header>
              <Card.Body data-testid={`card-${size}-body`}>{size} content</Card.Body>
              <Card.Footer data-testid={`card-${size}-footer`}>{size} actions</Card.Footer>
            </Card.Root>
          ),
        )}
        <Card.Root size={{ base: 'sm', md: 'lg' }} data-testid="card-responsive">
          <Card.Title data-testid="card-responsive-title">Responsive title</Card.Title>
          <Card.Body data-testid="card-responsive-body">Responsive content</Card.Body>
        </Card.Root>
        <Card.PropsProvider
          value={{ size: large() ? 'lg' : 'sm', variant: large() ? 'elevated' : 'outline' }}
        >
          <Card.Root data-testid="card-reactive">
            <Card.Title data-testid="card-reactive-title">Inherited style</Card.Title>
            <Card.Body data-testid="card-reactive-body">Inherited size</Card.Body>
          </Card.Root>
          <Card.Root size="md" variant="outline" data-testid="card-fixed">
            <Card.Title data-testid="card-fixed-title">Fixed style</Card.Title>
            <Card.Body data-testid="card-fixed-body">Fixed size</Card.Body>
          </Card.Root>
        </Card.PropsProvider>
        <Card.Root unstyled data-testid="card-unstyled">
          <Card.Body unstyled>Plain Card content</Card.Body>
        </Card.Root>
        <button type="button" data-testid="card-size-toggle" onClick={toggleSize}>
          Toggle size
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Card',
  component: CardMatrix,
} satisfies Meta<typeof CardMatrix>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Matrix: Story = {};
