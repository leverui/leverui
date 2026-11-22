import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Card, Span } from '../../src';
import './card-tables.css';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['elevated', 'outline', 'subtle'] as const;
type CardSize = (typeof sizes)[number];
type CardVariant = (typeof variants)[number];

/** Render one Card choice with a title, description, and action. */
function CardDemo(props: { size?: CardSize; variant?: CardVariant }): JSX.Element {
  return (
    <Card.Root size={props.size} variant={props.variant}>
      <Card.Body class="card-example-body-gap">
        <Card.Title>Card title</Card.Title>
        <Card.Description>A short line that says what the card is about.</Card.Description>
      </Card.Body>
      <Card.Footer>
        <Button variant="solid" colorPalette="blue">
          Action
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}

/** Compare all documented Card variants in one row. */
export function CardVariantTable(): JSX.Element {
  return (
    <table class="card-example-table">
      <thead>
        <tr>
          <For each={variants}>
            {
              /** Label one Card variant. */
              (variant) => <td>{variant}</td>
            }
          </For>
        </tr>
      </thead>
      <tbody>
        <tr>
          <For each={variants}>
            {
              /** Render one Card variant. */
              (variant) => (
                <td>
                  <CardDemo variant={variant} />
                </td>
              )
            }
          </For>
        </tr>
      </tbody>
    </table>
  );
}

/** Compare Card sizes against each of the three variants. */
export function CardSizeTable(): JSX.Element {
  return (
    <table class="card-example-table">
      <thead>
        <tr>
          <td />
          <For each={sizes}>
            {
              /** Label one Card size. */
              (size) => <td>{size}</td>
            }
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={variants}>
          {
            /** Show every Card size for one variant. */
            (variant) => (
              <tr>
                <td>
                  <Span class="card-example-table-label">{variant}</Span>
                </td>
                <For each={sizes}>
                  {
                    /** Render one size and variant. */
                    (size) => (
                      <td>
                        <CardDemo size={size} variant={variant} />
                      </td>
                    )
                  }
                </For>
              </tr>
            )
          }
        </For>
      </tbody>
    </table>
  );
}
