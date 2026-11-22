import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Card, Theme } from '../src';
import './card-guide.css';

/** Show Card parts under color scopes and consumer CSS. */
function CardVisualStates(): JSX.Element {
  return (
    <>
      <div data-testid="card-visual-states">
        <Card.Root data-testid="card-visual-default">
          <Card.Header data-testid="card-visual-header">
            <Card.Title data-testid="card-visual-title">Default title</Card.Title>
            <Card.Description data-testid="card-visual-description">
              Default description
            </Card.Description>
          </Card.Header>
          <Card.Body data-testid="card-visual-body">Default body</Card.Body>
          <Card.Footer data-testid="card-visual-footer">Default footer</Card.Footer>
        </Card.Root>
        <Card.Root variant="elevated" data-testid="card-visual-elevated">
          <Card.Body>Elevated</Card.Body>
        </Card.Root>
        <Card.Root variant="subtle" data-testid="card-visual-subtle">
          <Card.Body>Subtle</Card.Body>
        </Card.Root>
        <Theme appearance="dark" hasBackground={false} data-testid="card-dark-scope">
          <Card.Root data-testid="card-visual-dark">
            <Card.Body>Dark panel</Card.Body>
          </Card.Root>
          <Theme appearance="light" hasBackground={false} data-testid="card-light-scope">
            <Card.Root data-testid="card-visual-nested-light">
              <Card.Body>Nested light panel</Card.Body>
            </Card.Root>
          </Theme>
        </Theme>
        <Card.Root class="card-story-override" data-testid="card-visual-css-override">
          <Card.Body data-testid="card-visual-css-body">Consumer CSS</Card.Body>
        </Card.Root>
        <Card.Root data-testid="card-visual-part-unstyled">
          <Card.Header unstyled data-testid="card-visual-unstyled-header">
            <Card.Description unstyled data-testid="card-visual-unstyled-description">
              Plain description
            </Card.Description>
          </Card.Header>
        </Card.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Card Visual',
  component: CardVisualStates,
} satisfies Meta<typeof CardVisualStates>;

export default meta;

type Story = StoryObj<typeof meta>;

export const States: Story = {};
