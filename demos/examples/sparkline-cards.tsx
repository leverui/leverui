import { type JSX } from '@solidjs/web';
import { GlobeIcon } from '@lucide/solid';
import { Badge, Box, Card, FormatNumber, HStack, Sparkline, Stack, Stat } from '../../src';
import { sparklineValues, stockPrices } from './sparkline-data';
import './card-compositions.css';

/** Pair the Amazon closing price and trend with a compact area chart. */
export function SparklineStock(): JSX.Element {
  const opening = stockPrices[0]?.value ?? 0;
  const closing = stockPrices[stockPrices.length - 1]?.value ?? 0;
  const trend = opening === 0 ? 0 : (closing - opening) / opening;
  return (
    <Card.Root class="card-composition-sparkline" size="sm">
      <Card.Body class="card-composition-stock-body">
        <Stack gap="0" style={{ flex: '1' }}>
          <Box
            textStyle="sm"
            style={{
              'font-weight': 'var(--lui-font-weights-semibold)',
            }}
          >
            AMZN
          </Box>
          <Box
            textStyle="xs"
            style={{
              color: 'var(--lui-colors-fg-muted)',
            }}
          >
            Amazon Inc.
          </Box>
        </Stack>
        <Sparkline
          data={stockPrices}
          color="green.solid"
          gradient
          fillOpacity={0.2}
          aria-label="Amazon stock prices"
        />
        <Stat.Root size="sm" style={{ 'align-items': 'flex-end' }}>
          <Box style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>
            <FormatNumber value={closing} style="currency" currency="USD" />
          </Box>
          <Badge colorPalette={trend > 0 ? 'green' : 'red'} style={{ gap: '0' }}>
            <Stat.UpIndicator />
            <FormatNumber value={trend} style="percent" maximumFractionDigits={2} />
          </Badge>
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
}

/** Fill the base of a statistic card with a short visitor trend. */
export function SparklineStat(): JSX.Element {
  return (
    <Card.Root class="card-composition-sparkline card-composition-clipped" size="sm">
      <Card.Body>
        <Stat.Root>
          <Stat.Label>
            <HStack gap="1.5">
              <GlobeIcon /> Unique visitors
            </HStack>
          </Stat.Label>
          <Stat.ValueText>192.1k</Stat.ValueText>
        </Stat.Root>
      </Card.Body>
      <Sparkline
        data={sparklineValues.slice(0, 6)}
        width="100%"
        height={40}
        inset={0}
        aria-label="Unique visitors over time"
      />
    </Card.Root>
  );
}
