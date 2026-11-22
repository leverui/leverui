import { Card, Progress, Stat } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** How much storage is used, as a number and a bar. */
export function UsageCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Body>
        <div class="home-example-stack">
          <Stat.Root size="sm">
            <Stat.Label>Storage used</Stat.Label>
            <Stat.ValueText>12.4 GB</Stat.ValueText>
            <Stat.HelpText>of 20 GB</Stat.HelpText>
          </Stat.Root>
          <Progress.Root value={62} size="sm" colorPalette="cyan" aria-label="Storage used">
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
