import { type JSX } from '@solidjs/web';
import { Stat, StatGroup } from '../../src';

/** Compare sent and clicked totals inside the StatGroup. */
export function StatWithGroup(): JSX.Element {
  return (
    <StatGroup>
      <Stat.Root>
        <Stat.Label>Sent</Stat.Label>
        <Stat.ValueText>345,670</Stat.ValueText>
        <Stat.HelpText>
          <Stat.UpIndicator />
          23.36%
        </Stat.HelpText>
      </Stat.Root>
      <Stat.Root>
        <Stat.Label>Clicked</Stat.Label>
        <Stat.ValueText>45</Stat.ValueText>
        <Stat.HelpText>
          <Stat.DownIndicator />
          9.05%
        </Stat.HelpText>
      </Stat.Root>
    </StatGroup>
  );
}
