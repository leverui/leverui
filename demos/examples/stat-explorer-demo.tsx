import { type JSX } from '@solidjs/web';
import { For } from 'solid-js';
import { HStack, Stack, Stat } from '../../src';

const cardStyle = {
  'border-radius': 'var(--leverui-radii-md)',
  width: '100%',
  padding: 'var(--leverui-spacing-4)',
  'border-width': '1px',
} as const;
const labelStyle = {
  'font-size': 'var(--leverui-font-sizes-sm)',
  color: 'var(--leverui-colors-gray-600)',
  'margin-bottom': 'var(--leverui-spacing-1)',
} as const;
const valueStyle = {
  'font-size': 'var(--leverui-font-sizes-2xl)',
  'font-weight': 'var(--leverui-font-weights-bold)',
  'line-height': '1',
} as const;
const unitStyle = {
  'margin-inline-start': 'var(--leverui-spacing-1)',
  'font-size': 'var(--leverui-font-sizes-lg)',
  color: 'var(--leverui-colors-gray-500)',
  'line-height': '1',
} as const;
const helpStyle = {
  'font-size': 'var(--leverui-font-sizes-sm)',
  color: 'var(--leverui-colors-gray-500)',
  'margin-top': 'var(--leverui-spacing-2)',
} as const;

/** Render the indicator trend matching one statistic's direction. */
function Trend(props: { up: boolean }): JSX.Element {
  const style = {
    'font-size': 'var(--leverui-font-sizes-sm)',
    'line-height': '1',
  } as const;
  return (
    <>
      {props.up ? (
        <Stat.UpIndicator as="span" style={{ ...style, color: 'var(--leverui-colors-green-500)' }}>
          ▲ 12%
        </Stat.UpIndicator>
      ) : (
        <Stat.DownIndicator as="span" style={{ ...style, color: 'var(--leverui-colors-red-500)' }}>
          ▼ 8%
        </Stat.DownIndicator>
      )}
    </>
  );
}

const cards = [
  { label: 'Unique visitors', value: '192.1', unit: 'k', up: true },
  { label: 'New signups', value: '85', unit: 'users', up: false },
] as const;

/** Show every Stat part in the Explorer's two comparison cards. */
export function StatExplorerDemo(): JSX.Element {
  return (
    <Stack gap="6" align="stretch" style={{ 'max-width': 'var(--leverui-sizes-sm)' }}>
      <For each={cards}>
        {
          /** Render one statistic card with its unit and trend. */
          (card) => (
            <Stat.Root style={cardStyle}>
              <Stat.Label style={labelStyle}>{card.label}</Stat.Label>
              <HStack gap="2">
                <Stat.ValueText as="span" style={valueStyle}>
                  {card.value}
                  <Stat.ValueUnit as="span" style={unitStyle}>
                    {card.unit}
                  </Stat.ValueUnit>
                </Stat.ValueText>
                <Trend up={card.up} />
              </HStack>
              <Stat.HelpText style={helpStyle}>Compared to last week</Stat.HelpText>
            </Stat.Root>
          )
        }
      </For>
    </Stack>
  );
}
