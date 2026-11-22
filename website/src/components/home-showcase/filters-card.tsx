import { Card, SegmentGroup, Slider, Switch } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

const conditions = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
];

/** Search filters: a condition, a price range, and an in-stock switch. */
export function FiltersCard(): JSX.Element {
  const [price, setPrice] = createSignal([40, 160]);

  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>Filters</Card.Title>
      </Card.Header>
      <Card.Body>
        <div class="home-showcase-filters">
          <SegmentGroup.Root
            defaultValue="all"
            size="sm"
            aria-label="Condition"
            class="home-showcase-fit"
          >
            <SegmentGroup.Indicator />
            <SegmentGroup.Items items={conditions} />
          </SegmentGroup.Root>
          <Slider.Root
            value={price()}
            onValueChange={
              /** Keep the chosen range for the label. */
              (details) => setPrice(details.value)
            }
            min={0}
            max={200}
            step={10}
            minStepsBetweenThumbs={1}
            size="sm"
            colorPalette="cyan"
          >
            <div class="home-example-row home-showcase-between">
              <Slider.Label>Price</Slider.Label>
              <span class="home-showcase-hint">
                ${price()[0]} to ${price()[1]}
              </span>
            </div>
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
          <Switch.Root defaultChecked size="sm" colorPalette="cyan">
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>In stock only</Switch.Label>
          </Switch.Root>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
