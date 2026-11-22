import { type JSX } from '@solidjs/web';
import { CheckIcon, PackageIcon, ShipIcon } from '@lucide/solid';
import { Text, Timeline } from '../../src';

/** Show the shipping timeline with three dated milestones. */
export function TimelineBasic(): JSX.Element {
  return (
    <Timeline.Root style={{ 'max-width': '400px' }}>
      <Timeline.Item>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator>
            <ShipIcon />
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title>Order shipped</Timeline.Title>
          <Timeline.Description>12 March 2025</Timeline.Description>
          <Text textStyle="sm">
            We sent your order with <strong>FedEx</strong>. It should arrive in 3 to 5 working days.
          </Text>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator>
            <CheckIcon />
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title style={{ 'font-size': 'var(--leverui-font-sizes-sm)' }}>
            Customs cleared
          </Timeline.Title>
          <Timeline.Description>15 March 2025</Timeline.Description>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator>
            <PackageIcon />
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title style={{ 'font-size': 'var(--leverui-font-sizes-sm)' }}>
            Order delivered
          </Timeline.Title>
          <Timeline.Description>17 March 2025, 10:30 am</Timeline.Description>
        </Timeline.Content>
      </Timeline.Item>
    </Timeline.Root>
  );
}
