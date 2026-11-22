import { type JSX } from '@solidjs/web';
import { FormatNumber, Stat } from '../../src';

/** Show the unique visitor statistic. */
export function StatBasic(): JSX.Element {
  return (
    <Stat.Root>
      <Stat.Label>Unique visitors</Stat.Label>
      <Stat.ValueText>192.1k</Stat.ValueText>
    </Stat.Root>
  );
}

/** Format a numeric revenue value as US dollars. */
export function StatWithFormatOptions(): JSX.Element {
  return (
    <Stat.Root>
      <Stat.Label>Revenue</Stat.Label>
      <Stat.ValueText>
        <FormatNumber value={935.4} style="currency" currency="USD" />
      </Stat.ValueText>
    </Stat.Root>
  );
}

/** Pair hour and minute values with their unit labels. */
export function StatWithValueUnit(): JSX.Element {
  return (
    <Stat.Root>
      <Stat.Label>Time to complete</Stat.Label>
      <Stat.ValueText style={{ 'align-items': 'baseline' }}>
        3 <Stat.ValueUnit>hr</Stat.ValueUnit>
        20 <Stat.ValueUnit>min</Stat.ValueUnit>
      </Stat.ValueText>
    </Stat.Root>
  );
}
