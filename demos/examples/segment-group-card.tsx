import { type JSX } from '@solidjs/web';
import { SearchIcon } from '@lucide/solid';
import { Button, Card, Field, Heading, SegmentGroup } from '../../src';
import './segment-group-card.css';

interface CardPreferenceProps {
  label: string;
  selected: string;
  options: string[];
}

/** Render one labeled home-search preference. */
function CardPreference(props: CardPreferenceProps): JSX.Element {
  return (
    <Field.Root>
      <Field.Label>{props.label}</Field.Label>
      <SegmentGroup.Root defaultValue={props.selected}>
        <SegmentGroup.Indicator />
        <SegmentGroup.Items items={props.options} />
      </SegmentGroup.Root>
    </Field.Root>
  );
}

/** Show segment controls inside the home-search card. */
export function SegmentGroupCard(): JSX.Element {
  return (
    <Card.Root class="segment-group-card">
      <Card.Header>
        <Heading size="lg">Search homes for rent</Heading>
      </Card.Header>
      <Card.Body class="segment-group-card-body">
        <CardPreference label="Bedrooms" selected="Any" options={['Any', '1', '2', '3', '3+']} />
        <CardPreference label="Beds" selected="1" options={['Any', '1', '2', '2+']} />
        <CardPreference label="Bathrooms" selected="3" options={['Any', '1', '2', '3']} />
      </Card.Body>
      <Card.Footer class="segment-group-card-footer">
        <Button variant="surface">Reset</Button>
        <Button>
          <SearchIcon /> 24 results
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
