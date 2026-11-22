import { Card, SegmentGroup, Slider } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Two display settings: a choice and a slider. */
export function AppearanceCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>Appearance</Card.Title>
      </Card.Header>
      <Card.Body>
        <div class="home-example-stack">
          <SegmentGroup.Root defaultValue="System" size="sm" aria-label="Color mode">
            <SegmentGroup.Indicator />
            <SegmentGroup.Items items={['Light', 'Dark', 'System']} />
          </SegmentGroup.Root>
          <Slider.Root defaultValue={[60]} size="sm" colorPalette="cyan">
            <Slider.Label>Text size</Slider.Label>
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
