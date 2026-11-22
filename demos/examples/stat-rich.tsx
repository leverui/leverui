import { type JSX } from '@solidjs/web';
import { DollarSignIcon } from '@lucide/solid';
import { Badge, FormatNumber, HStack, Icon, InfoTip, Progress, Stat } from '../../src';
import './stat-examples.css';

/** Add a muted dollar icon to a bordered sales summary. */
export function StatWithIcon(): JSX.Element {
  return (
    <Stat.Root class="example-stat-narrow example-stat-card">
      <HStack justify="space-between">
        <Stat.Label>Sales</Stat.Label>
        <Icon class="example-stat-icon">
          <DollarSignIcon />
        </Icon>
      </HStack>
      <Stat.ValueText>$4.24k</Stat.ValueText>
    </Stat.Root>
  );
}

/** Show a red decline indicator beneath the visitor total. */
export function StatWithIndicator(): JSX.Element {
  return (
    <Stat.Root>
      <Stat.Label>Unique visitors</Stat.Label>
      <Stat.ValueText>192.1k</Stat.ValueText>
      <Badge colorPalette="red" variant="plain" class="example-stat-flush-badge">
        <Stat.DownIndicator />
        1.9%
      </Badge>
    </Stat.Root>
  );
}

/** Explain the short label through the information popover. */
export function StatWithInfoTip(): JSX.Element {
  return (
    <Stat.Root>
      <Stat.Label>
        Unique
        <InfoTip contentProps={{ 'aria-label': 'Each visitor is counted once' }}>
          Each visitor is counted once.
        </InfoTip>
      </Stat.Label>
      <Stat.ValueText>192.1k</Stat.ValueText>
    </Stat.Root>
  );
}

/** Place an indeterminate Progress track beneath weekly revenue. */
export function StatWithProgressBar(): JSX.Element {
  return (
    <Stat.Root class="example-stat-narrow">
      <Stat.Label>This week</Stat.Label>
      <Stat.ValueText>
        <FormatNumber value={1340} style="currency" currency="USD" maximumFractionDigits={0} />
      </Stat.ValueText>
      <Stat.HelpText class="example-stat-help-text">+12% from last week</Stat.HelpText>
      <Progress.Root>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </Stat.Root>
  );
}

/** Pair formatted revenue with a positive trend badge. */
export function StatWithTrend(): JSX.Element {
  return (
    <Stat.Root>
      <Stat.Label>Revenue</Stat.Label>
      <HStack>
        <Stat.ValueText>
          <FormatNumber value={8456.4} style="currency" currency="USD" />
        </Stat.ValueText>
        <Badge colorPalette="green" class="example-stat-tight-badge">
          <Stat.UpIndicator />
          12%
        </Badge>
      </HStack>
      <Stat.HelpText>Since last month</Stat.HelpText>
    </Stat.Root>
  );
}
