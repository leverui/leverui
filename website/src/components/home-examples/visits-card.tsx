import { Badge, Card, Sparkline, Stat } from '@leverui/components';
import { type JSX } from '@solidjs/web';

const visits = [18, 24, 21, 30, 28, 36, 41].map(
  /** Wrap one day's count as a chart point. */
  (value) => ({ value }),
);

/** A week of visits as a number and a small chart. */
export function VisitsCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Body>
        <div class="home-example-stack">
          <Stat.Root size="sm">
            <Stat.Label>Visits this week</Stat.Label>
            <div class="home-example-row">
              <Stat.ValueText>19.8k</Stat.ValueText>
              <Badge colorPalette="green">
                <Stat.UpIndicator />
                12%
              </Badge>
            </div>
          </Stat.Root>
          <Sparkline
            data={visits}
            color="cyan.solid"
            width="100%"
            height={56}
            inset={0}
            aria-label="Visits for each day this week"
          />
        </div>
      </Card.Body>
    </Card.Root>
  );
}
